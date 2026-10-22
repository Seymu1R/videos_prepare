#!/usr/bin/env bash
# Generates a video without opening an interactive session.
# Usage: ./make-video.sh <youtube|tiktok|both> "<mövzu>, [müddət], [üslub]"
#   youtube → 16:9 1920×1080 (YouTube, Facebook, LinkedIn, X)
#   tiktok  → 9:16 1080×1920 (TikTok, Instagram Reels, YouTube Shorts)
#   both    → hər ikisi
set -euo pipefail
cd "$(dirname "$0")"

usage() {
  echo "İstifadə: ./make-video.sh <youtube|tiktok|both> \"<mövzu>, [müddət], [üslub]\"" >&2
  exit 1
}

[ $# -ge 2 ] || usage
case "$1" in
  youtube) platform="youtube" ;;
  tiktok) platform="tiktok" ;;
  both) platform="hər ikisi" ;;
  *) usage ;;
esac
shift

[ -d node_modules ] || npm ci

claude -p "/video $*, $platform" --permission-mode acceptEdits
