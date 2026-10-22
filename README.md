# Videos

Kodla yaradılan motion-graphics videoları (Remotion + React).

## Quraşdırma
```bash
npm ci
```

## Yeni video yaratmaq
Interaktiv (Claude ilə):
```bash
claude
> /video Qəhvə dükanı reklamı, 15s, 9:16
```

Bir əmrlə (sessiya açmadan):
```bash
./make-video.sh "Qəhvə dükanı reklamı, 15s, 9:16"
```

Hazır video `out/<slug>.mp4`-ə düşür. `out/` git-ə yüklənmir.

## Remotion skill-ləri
Rəsmi Remotion skill-ləri (`remotion-dev/skills`) repo-nun içindədir: `.claude/skills/remotion-*`. `/video` hər dəfə onları yükləyib istifadə edir. Clone edəndə avtomatik gəlir.

Yeni versiyaya yeniləmək:
```bash
npx skills update -p -y
```

## Digər əmrlər
```bash
npm run studio                                   # brauzerdə canlı önizləmə
npx remotion render OrbitLaunch out/orbit.mp4    # mövcud videonu yenidən render et
```
