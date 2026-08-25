#!/usr/bin/env python3
"""
Screenshot the local site at true device sizes via the Chrome DevTools Protocol.

Chrome's headless --window-size clamps the viewport to a 500px minimum, which
silently makes "mobile" screenshots wrong. Emulation.setDeviceMetricsOverride
does not clamp, so this is the only trustworthy way to check narrow layouts.

    .venv/bin/python scripts/shoot.py [--url URL] [--out DIR] [--full] [preset ...]

Presets: mobile (390x844 @3x), tablet (834x1112 @2x), desktop (1440x900 @2x),
         wide (1920x1080 @1x). Default: all four.
"""
import base64, json, os, socket, subprocess, sys, time, urllib.request

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 9222

PRESETS = {
    "mobile":  dict(width=390,  height=844,  scale=3, mobile=True),
    "tablet":  dict(width=834,  height=1112, scale=2, mobile=True),
    "desktop": dict(width=1440, height=900,  scale=2, mobile=False),
    "wide":    dict(width=1920, height=1080, scale=1, mobile=False),
}


def free(port):
    s = socket.socket()
    try:
        s.connect(("127.0.0.1", port)); s.close(); return False
    except OSError:
        return True


def launch():
    if not free(PORT):
        return None
    p = subprocess.Popen(
        [CHROME, "--headless=new", f"--remote-debugging-port={PORT}",
         "--disable-gpu", "--hide-scrollbars", "--no-first-run",
         "--user-data-dir=/tmp/canvas-chrome-profile",
         "--remote-allow-origins=*", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        time.sleep(0.25)
        if not free(PORT):
            return p
    raise RuntimeError("Chrome did not open a debugging port")


def ws_url():
    """Open a fresh tab. Chrome 111+ requires PUT on /json/new, not GET."""
    last = None
    for _ in range(40):
        try:
            req = urllib.request.Request(
                f"http://127.0.0.1:{PORT}/json/new?about:blank", method="PUT")
            d = json.load(urllib.request.urlopen(req, timeout=10))
            return d["webSocketDebuggerUrl"]
        except Exception as e:
            last = e
            time.sleep(0.25)
    raise RuntimeError(f"no CDP target: {last}")


def shoot(url, preset, out_path, full=False, scroll=None):
    from websocket import create_connection
    ws = create_connection(ws_url(), timeout=60,
                           suppress_origin=True)
    n = [0]

    def cmd(method, params=None):
        n[0] += 1
        ws.send(json.dumps({"id": n[0], "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == n[0]:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    cmd("Emulation.setDeviceMetricsOverride", {
        "width": preset["width"], "height": preset["height"],
        "deviceScaleFactor": preset["scale"], "mobile": preset["mobile"],
    })
    if preset["mobile"]:
        cmd("Emulation.setTouchEmulationEnabled", {"enabled": True})
        cmd("Emulation.setEmitTouchEventsForMouse", {"enabled": True})
    cmd("Page.enable")
    cmd("Runtime.enable")
    cmd("Page.navigate", {"url": url})
    time.sleep(4.5)   # fonts, video attach, entrance timeline

    def evaluate(expr):
        r = cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return r.get("result", {}).get("value")

    if scroll is not None:
        # Scroll-driven pages cannot be captured full-page: a pinned ScrollTrigger
        # inflates the document and the single tall capture is meaningless. Scroll
        # to the position, let the timeline settle, then grab the viewport.
        evaluate(f"window.scrollTo(0, {scroll}); 1")
        time.sleep(1.8)
    elif full:
        m = cmd("Page.getLayoutMetrics")
        h = int(m["cssContentSize"]["height"])
        cmd("Emulation.setDeviceMetricsOverride", {
            "width": preset["width"], "height": min(h, 24000),
            "deviceScaleFactor": preset["scale"], "mobile": preset["mobile"],
        })
        time.sleep(1.6)

    res = cmd("Page.captureScreenshot",
              {"format": "png", "captureBeyondViewport": bool(full and scroll is None)})
    open(out_path, "wb").write(base64.b64decode(res["data"]))
    height = evaluate("document.documentElement.scrollHeight")
    ws.close()
    return os.path.getsize(out_path), height


if __name__ == "__main__":
    args = sys.argv[1:]
    url = "http://localhost:8099/"
    out = "/tmp/shots"
    full = "--full" in args
    if "--url" in args: url = args[args.index("--url") + 1]
    if "--out" in args: out = args[args.index("--out") + 1]
    # --scroll 0,900,1800  → one viewport capture per position
    scrolls = None
    if "--scroll" in args:
        scrolls = [int(x) for x in args[args.index("--scroll") + 1].split(",")]
    names = [a for a in args if a in PRESETS] or list(PRESETS)

    os.makedirs(out, exist_ok=True)
    proc = launch()
    try:
        for name in names:
            p = PRESETS[name]
            for i, sc in enumerate(scrolls or [None]):
                tag = f"-s{i}" if sc is not None else ("-full" if full else "")
                path = os.path.join(out, f"{name}{tag}.png")
                size, h = shoot(url, p, path, full, sc)
                pos = f"@y={sc}" if sc is not None else ""
                print(f"  {name:8} {p['width']}x{p['height']} {pos:10} -> {path} ({size//1024}KB, doc {h}px)")
    finally:
        if proc:
            proc.terminate()
