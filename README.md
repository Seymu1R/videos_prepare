# Videos

Kodla yaradılan motion-graphics videoları (Remotion + React).

## Quraşdırma
```bash
npm ci
```

## Yeni video yaratmaq
İki platforma seçimi var:

| Seçim | Format | Harada paylaşmaq |
|---|---|---|
| `youtube` | 16:9, 1920×1080 (üfüqi) | YouTube, Facebook, LinkedIn, X |
| `tiktok` | 9:16, 1080×1920 (şaquli) | TikTok, Instagram Reels/Stories, YouTube Shorts |
| `hər ikisi` | ikisi birdən, hər biri öz düzülüşü ilə | hamısı |

Interaktiv (Claude ilə):
```bash
claude
> /video Qəhvə dükanı reklamı, youtube, 15s
> /video Qəhvə dükanı reklamı, tiktok, 15s
> /video Qəhvə dükanı reklamı, hər ikisi, 15s
```
Platforma yazılmasa, Claude soruşacaq.

Bir əmrlə (sessiya açmadan):
```bash
./make-video.sh youtube "Qəhvə dükanı reklamı, 15s"
./make-video.sh tiktok  "Qəhvə dükanı reklamı, 15s"
./make-video.sh both    "Qəhvə dükanı reklamı, 15s"
```

Hazır videolar `out/<slug>-youtube.mp4` və `out/<slug>-tiktok.mp4` adı ilə düşür, kodu isə `src/videos/<slug>/`-dədir. **Hər ikisi yalnız lokalda qalır**: git-də yalnız skelet var (skill-lər, ayarlar, `Root.tsx`). Videolar hər dəfə sıfırdan `/video` skill-inin şablonlarına görə yaradılır.

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
