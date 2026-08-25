#!/usr/bin/env bash
#
# Start the Canvas site.
#
#   ./start.sh            dev server, hot reload      (default)
#   ./start.sh prod       production build + serve
#   ./start.sh docker     build image + run container
#
#   PORT=4000 ./start.sh  override the port (default 3000)
#
# Stop with ./stop.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-dev}"
PORT="${PORT:-3000}"
RUN_DIR=".run"
PID_FILE="$RUN_DIR/server.pid"
LOG_FILE="$RUN_DIR/server.log"
CONTAINER="canvas-bd-run"
IMAGE="canvas-bd:local"

mkdir -p "$RUN_DIR"

bold()  { printf "\033[1m%s\033[0m\n" "$1"; }
info()  { printf "  \033[2m%s\033[0m\n" "$1"; }
ok()    { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn()  { printf "  \033[33m!\033[0m %s\n" "$1"; }
die()   { printf "\n  \033[31m✗ %s\033[0m\n\n" "$1" >&2; exit 1; }

port_busy() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }

# --------------------------------------------------------------------------
# Already running?
# --------------------------------------------------------------------------
if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  warn "Already running (pid $(cat "$PID_FILE")). Run ./stop.sh first."
  exit 0
fi
if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "$CONTAINER"; then
  warn "Container '$CONTAINER' is already running. Run ./stop.sh first."
  exit 0
fi
if port_busy "$PORT"; then
  die "Port $PORT is in use by something else. Set PORT=… or free it."
fi

echo
bold "Canvas · ${MODE}"
echo

# --------------------------------------------------------------------------
# Docker mode — self-contained, no local toolchain needed
# --------------------------------------------------------------------------
if [[ "$MODE" == "docker" ]]; then
  command -v docker >/dev/null 2>&1 || die "docker is not installed."
  docker info >/dev/null 2>&1 || die "Docker daemon is not running. Start Docker Desktop and retry."

  info "Building image (first run takes a few minutes)…"
  docker build -q -t "$IMAGE" . >/dev/null
  ok "Image built"

  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  docker run -d --name "$CONTAINER" -p "${PORT}:3000" "$IMAGE" >/dev/null
  ok "Container started"

  info "Waiting for healthcheck…"
  for _ in $(seq 1 30); do
    sleep 2
    case "$(docker inspect --format '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null)" in
      healthy)   ok "Healthy";  break ;;
      unhealthy) die "Container went unhealthy. Logs: docker logs $CONTAINER" ;;
    esac
  done

  echo
  bold "  http://localhost:${PORT}"
  echo
  info "logs:  docker logs -f $CONTAINER"
  info "stop:  ./stop.sh"
  echo
  exit 0
fi

# --------------------------------------------------------------------------
# Prerequisites for dev/prod
# --------------------------------------------------------------------------
command -v node >/dev/null 2>&1 || die "Node is not installed. Needs Node 20+."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
(( NODE_MAJOR >= 20 )) || die "Node ${NODE_MAJOR} is too old. Next 16 needs Node 20+."

if [[ ! -d node_modules ]]; then
  info "Installing npm dependencies…"
  npm install --no-audit --no-fund
  ok "Dependencies installed"
fi

# Media is git-ignored build output. Without it every image 404s, which looks
# like a broken site rather than a missing build step — so check and fix it.
if [[ ! -d public/media || -z "$(ls -A public/media 2>/dev/null)" ]]; then
  warn "public/media is empty — building it from brand/ (one time, ~1 min)"

  PY=""
  if   [[ -x .venv/bin/python ]]; then PY=".venv/bin/python"
  elif command -v python3 >/dev/null 2>&1; then
    info "Creating .venv…"
    python3 -m venv .venv
    .venv/bin/pip install --quiet pillow websocket-client
    PY=".venv/bin/python"
  else
    die "python3 is required to build media. Install it, or copy public/ from another machine."
  fi

  command -v ffmpeg >/dev/null 2>&1 \
    || warn "ffmpeg not found — images will build, video will be skipped (brew install ffmpeg)"

  "$PY" tools/build-media.py
  ok "Media built"
fi

# --------------------------------------------------------------------------
# Dev / prod
# --------------------------------------------------------------------------
if [[ "$MODE" == "prod" ]]; then
  info "Building for production…"
  npm run build
  ok "Build complete"
  CMD=(npm run start -- --port "$PORT")
elif [[ "$MODE" == "dev" ]]; then
  CMD=(npm run dev -- --port "$PORT")
else
  die "Unknown mode '$MODE'. Use: dev | prod | docker"
fi

: > "$LOG_FILE"
"${CMD[@]}" >>"$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

info "Waiting for the server…"
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://localhost:${PORT}/" 2>/dev/null; then
    ok "Responding"
    echo
    bold "  http://localhost:${PORT}"
    echo
    info "logs:  tail -f $LOG_FILE"
    info "stop:  ./stop.sh"
    echo
    exit 0
  fi
  # Surface a crash immediately rather than waiting out the whole timeout.
  if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo
    tail -20 "$LOG_FILE" >&2
    rm -f "$PID_FILE"
    die "Server exited during startup — see above."
  fi
  sleep 1
done

tail -20 "$LOG_FILE" >&2
die "Server did not respond within 60s."
