#!/usr/bin/env bash
# Generates a video without opening an interactive session.
# Usage: ./make-video.sh "Qəhvə dükanı reklamı, 15s, 9:16"
set -euo pipefail
cd "$(dirname "$0")"

if [ $# -eq 0 ]; then
  echo "İstifadə: ./make-video.sh \"<mövzu>, [müddət], [9:16|16:9|1:1]\"" >&2
  exit 1
fi

[ -d node_modules ] || npm ci

claude -p "/video $*" --permission-mode acceptEdits
