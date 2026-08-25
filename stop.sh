#!/usr/bin/env bash
#
# Stop the Canvas site — whichever way it was started.
#
#   ./stop.sh             stop dev/prod server and any container
#   PORT=4000 ./stop.sh   also free a non-default port
#
set -uo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

PORT="${PORT:-3000}"
RUN_DIR=".run"
PID_FILE="$RUN_DIR/server.pid"
CONTAINER="canvas-bd-run"

info()  { printf "  \033[2m%s\033[0m\n" "$1"; }
ok()    { printf "  \033[32m✓\033[0m %s\n" "$1"; }

stopped=0

echo

# --- the process we started ------------------------------------------------
if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE")"
  if kill -0 "$PID" 2>/dev/null; then
    # Kill the process group: `npm run dev` spawns next as a child, and
    # signalling only the npm wrapper orphans the server holding the port.
    PGID="$(ps -o pgid= "$PID" 2>/dev/null | tr -d ' ')"
    if [[ -n "$PGID" ]]; then kill -TERM "-$PGID" 2>/dev/null; else kill -TERM "$PID" 2>/dev/null; fi

    for _ in $(seq 1 20); do
      kill -0 "$PID" 2>/dev/null || break
      sleep 0.25
    done
    if kill -0 "$PID" 2>/dev/null; then
      [[ -n "$PGID" ]] && kill -KILL "-$PGID" 2>/dev/null || kill -KILL "$PID" 2>/dev/null
      ok "Server force-stopped (pid $PID)"
    else
      ok "Server stopped (pid $PID)"
    fi
    stopped=1
  fi
  rm -f "$PID_FILE"
fi

# --- the container ---------------------------------------------------------
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER"; then
    docker rm -f "$CONTAINER" >/dev/null 2>&1 && ok "Container removed" && stopped=1
  fi
fi

# --- anything still holding the port --------------------------------------
# Covers a server started by hand (npm run dev in another terminal).
if command -v lsof >/dev/null 2>&1; then
  LEFT="$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$LEFT" ]]; then
    info "Port $PORT still held by pid(s): $(echo "$LEFT" | tr '\n' ' ')"
    # shellcheck disable=SC2086
    kill -TERM $LEFT 2>/dev/null
    sleep 1
    LEFT="$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
    # shellcheck disable=SC2086
    [[ -n "$LEFT" ]] && kill -KILL $LEFT 2>/dev/null
    ok "Port $PORT freed"
    stopped=1
  fi
fi

if (( stopped )); then
  echo
else
  info "Nothing was running."
  echo
fi
