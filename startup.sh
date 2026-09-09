#!/bin/sh
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
cd /workspace/frontend
BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 8080 --host lan >>/tmp/app-startup.log 2>&1 &
