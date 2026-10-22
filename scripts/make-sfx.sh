#!/usr/bin/env bash
# Synthesizes a royalty-free SFX kit with ffmpeg into public/audio/sfx/ (48 kHz stereo WAV).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/audio/sfx
mkdir -p "$OUT"

gen() { # name duration expression filters
  ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='$3':s=48000:d=$2" -af "$4,alimiter=limit=0.89:level=false" -ac 2 "$OUT/$1.wav"
}

# Big impact: sub-bass pitch drop + transient click
gen hit 0.9 "0.9*sin(2*PI*(45*t+120*(1-exp(-14*t))/14))*exp(-4.5*t)+0.45*(2*random(0)-1)*exp(-50*t)" "lowpass=f=6000"
# Sticker / stamp slap: punchy mid thump
gen stamp 0.4 "0.8*sin(2*PI*(110*t+260*(1-exp(-30*t))/30))*exp(-11*t)+0.5*(2*random(0)-1)*exp(-70*t)" "highpass=f=60,lowpass=f=7000"
# UI pop
gen pop 0.15 "0.7*sin(2*PI*(500*t+700*(1-exp(-40*t))/40))*exp(-30*t)" "highpass=f=200"
# Transition whoosh: swelling band-limited noise with phaser swirl
gen whoosh 0.55 "(2*random(0)-1)*pow(sin(PI*t/0.55),3)" "highpass=f=250,lowpass=f=4200,aphaser=type=t:speed=2:decay=0.5,volume=3.2"
# Short swish for strike-through lines
gen swish 0.22 "(2*random(0)-1)*pow(sin(PI*t/0.22),2)" "highpass=f=1800,lowpass=f=9000,volume=1.2"
# Falling whistle before a drop lands
gen fall 0.42 "0.35*sin(2*PI*(1900*t-1500*t*t/(2*0.42)))*sin(PI*t/0.42)" "lowpass=f=5000"
# Success chime for the CTA
gen ding 1.2 "0.35*sin(2*PI*1318.5*t)*exp(-3*t)+0.25*sin(2*PI*1975.5*t)*exp(-4*t)+0.15*sin(2*PI*2637*t)*exp(-6*t)" "aecho=0.8:0.6:60:0.3,volume=2"

ls -la "$OUT"
