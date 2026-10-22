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

Hazır video `out/<slug>.mp4`-ə düşür, kodu isə `src/videos/<slug>/`-dədir. **Hər ikisi yalnız lokalda qalır**: git-də yalnız skelet var (skill-lər, ayarlar, `Root.tsx`). Videolar hər dəfə sıfırdan `/video` skill-inin şablonlarına görə yaradılır.

Üslub seçmək olar: `/video Zərgərlik mağazası, 15s, 9:16, Luxury Editorial`. Üslublar: Dark Tech, Warm Premium, Light Minimal, Bold Pop, Neon Night, Luxury Editorial, Playful Kids (`.claude/skills/video/references/styles.md`).

## Remotion skill-ləri
Rəsmi Remotion skill-ləri (`remotion-dev/skills`) repo-nun içindədir: `.claude/skills/remotion-*`. `/video` hər dəfə onları yükləyib istifadə edir. Clone edəndə avtomatik gəlir.

Yeni versiyaya yeniləmək:
```bash
npx skills update -p -y
```

## Digər əmrlər
```bash
npm run studio                                   # brauzerdə canlı önizləmə
npx remotion render <Id> out/<slug>.mp4           # mövcud videonu yenidən render et
```
