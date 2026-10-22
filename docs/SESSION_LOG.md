# Layihə jurnalı — harada qalmışıq

> **Claude üçün:** yeni sessiyanın əvvəlində bu faylı oxu. **"Hazırkı vəziyyət"** və **"Növbəti addım"** bölmələri sənin başlanğıc nöqtəndir. Sessiyanın sonunda bu faylı yenilə: "Qərarlar tarixçəsi"nə yeni maddələr əlavə et, "Hazırkı vəziyyət"i və "Növbəti addım"ı dəyiş, sonra commit və push et.
>
> İstifadəçi Azərbaycan dilində yazır. Cavablar Azərbaycan dilində olmalıdır.

Son yenilənmə: **2026-10-22**

---

## Hazırkı vəziyyət

- ✅ Kodla motion-graphics video yaradan sistem işləyir (Remotion + React).
- ✅ `/video` skill-i videonu sıfırdan qurur: üslub seçir, ssenari yazır, kodu yaradır, QC edir, render edir.
- ✅ Platforma seçimi: `youtube` (16:9), `tiktok` (9:16), `hər ikisi`.
- ✅ 7 dizayn üslubu var.
- ✅ SFX (səs effektləri) hərəkətlə kadrına qədər sinxrondur və avtomatik əlavə olunur.
- ✅ `.env` git-ə düşmür, `.env.example` şablonu var.
- ⏳ **Gözləyir: diktor səsi (TTS).** İstifadəçi hələ ElevenLabs və ya Azure seçməyib və API açarını `.env`-ə qoymayıb.

## Növbəti addım

**Diktor səsi (Azərbaycan dilində TTS)**

1. İstifadəçidən xidməti soruş: **ElevenLabs** (ən təbii səs, ödənişli plan lazımdır) və ya **Azure** (ucuz, rəsmi `az-AZ-BabekNeural` kişi və `az-AZ-BanuNeural` qadın səsləri).
2. İstifadəçi açarı **özü** `.env`-ə yazır (`cp .env.example .env`). Açarı çata yazdırma və `.env`-in içini oxuma, yalnız faylın mövcud olduğunu yoxla.
3. Qısa test cümləsi səsləndir ("Bəhanə yox! Bu gün başla!"). İstifadəçi tələffüzü dinləyib qiymətləndirsin.
4. Səsi fitnes videosuna (`GymBoldPop`) əlavə et. Diktor danışanda SFX-in səsi azalsın (ducking).
5. Bəyənilsə, `/video` skill-inə diktor rejimini əlavə et: Claude mətni yazır, səsləndirir və videonu səsin uzunluğuna uyğunlaşdırır (Remotion-un `voiceover.md` və `calculateMetadata` üsulu ilə).
6. **MCP lazım deyil.** API açarı və kiçik bir skript kifayətdir. Bu, `./make-video.sh` ilə də problemsiz işləyir.

Sonrakı ideyalar: fon musiqisi (`public/audio/music/` qovluğuna lisenziyalı trek qoyulur, sonda yumşaq sönür, diktor danışanda səsi azalır), səsin −14 LUFS səviyyəsinə normallaşdırılması.

---

## Başqa kompüterdə başlamaq

```bash
git clone https://github.com/Seymu1R/videos_prepare.git
cd videos_prepare
npm ci
cp .env.example .env      # TTS açarı lazım olanda doldur
claude                    # sonra: /video <mövzu>, <youtube|tiktok|hər ikisi>, ...
```

Lazım olanlar: Node.js 22+, ffmpeg (QC və `npm run sfx` üçün), Claude Code.

⚠️ **Videolar git-də deyil.** `src/videos/*` və `out/` yalnız orijinal kompüterdə (Linux, `~/Desktop/My_projects/videos`) qalır. Yeni kompüterdə `src/videos/` boşdur və `npx remotion compositions` "Array of 0 length" verir. Bu normaldır, ilk `/video`-dan sonra video görünəcək.

---

## Layihənin quruluşu

```
.claude/
  skills/video/            ← bizim skill: SKILL.md + references/
    references/scaffold.md ← fayl şablonları (theme, timeline, background, scene, index)
    references/motion.md   ← easing/spring, hook-lar, keçidlər, kamera, effektlər, platforma ölçüləri
    references/styles.md   ← 7 dizayn üslubu
    references/sound.md    ← SFX qaydaları
  skills/remotion-*        ← Remotion-un rəsmi skill-ləri (12 ədəd, vendored)
  settings.json            ← icazələr (render, typecheck, ffmpeg)
src/
  Root.tsx                 ← src/videos/*/index.ts fayllarını avtomatik tapır (redaktə etmə)
  types.ts                 ← VideoEntry, PLATFORMS (youtube / tiktok / square)
  sfx.tsx                  ← SfxTrack komponenti
  videos/                  ← videolar (git-ignored, yalnız .gitkeep izlənir)
public/audio/sfx/          ← 7 SFX WAV (izlənir); public/audio/* qalan hissəsi ignored
scripts/make-sfx.sh        ← SFX-i ffmpeg ilə sintez edir (npm run sfx)
make-video.sh              ← ./make-video.sh <youtube|tiktok|both> "<mövzu>"
docs/SESSION_LOG.md        ← bu fayl
```

## Əsas qaydalar (razılaşdıqlarımız)

- **Git-də yalnız skelet var:** skill-lər, ayarlar, Root, types, sfx, SFX dəsti. Videoların kodu (`src/videos/*`) və render-lər (`out/`) **lokalda qalır**. Onları heç vaxt git-ə əlavə etmə.
- **Videolar hər dəfə sıfırdan qurulur.** Köhnə videolara baxılmır, ancaq skill-in `references/` şablonlarından istifadə olunur. Belə ki, hər video fərqli görünür.
- Hər video `src/videos/<slug>/index.ts` faylında `videos` (və ya `video`) export edir, `Root.tsx` onu özü tapır.
- **Platformalar:** `youtube` 1920×1080 (YouTube, Facebook, LinkedIn, X), `tiktok` 1080×1920 (TikTok, Reels, Shorts). "Hər ikisi" seçiləndə eyni koddan iki ayrı düzülüş qurulur (`useLayout()`): 16:9-da elementlər yan-yana, 9:16-da üst-üstə. Kəsmə və ya çərçivəyə salma yoxdur.
- **Remotion skill-ləri ilə ziddiyyətdə bizim `/video` qaydaları üstündür:** həmişə MP4 render olunur, Studio açılmır, yeni proyekt yaradılmır, `Root.tsx` redaktə olunmur.
- **Animasiya:** xətti (linear) hərəkət yoxdur, hər şey spring və ya easing ilə. Səhnələr 6–10 kadr üst-üstə düşür, kəskin kəsilmə olmur. İlk 2 saniyədə güclü hook olmalıdır.
- **Azərbaycan hərfləri:** şriftlər `latin-ext` dəstəkləməlidir. Orbitron dəstəkləmir, ona görə çıxarıldı.
- **Lisenziya:** musiqi və diktor faylları `public/audio/music/` və `voiceover/` qovluqlarına qoyulur və git-ə düşmür. SFX dəsti bizim özümüzündür.
- **Commit-lər** `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` sətri ilə bitir.

---

## Qərarlar tarixçəsi

### 2026-10-22 — Birinci sessiya

1. **Başlanğıc:** istifadəçi "Elite Creative Director" prompt şablonu göndərdi, amma boşluqları doldurmamışdı. Şablonun öz nümunəsi götürüldü: SaaS təqdimatı, 15 san, 9:16, Remotion. Nəticədə **`OrbitLaunch`** videosu yarandı (uydurma "Orbit" brendi, Dark Tech üslubu). QC-də keçid zamanı nöqtə ilə loqonun yerləri uyğun gəlmirdi, `LOGO_Y` anchor-u ilə düzəldildi.
2. **Git və GitHub:** layihə `Seymu1R/videos_prepare` repo-suna yükləndi. `gh` CLI quraşdırılmayıb, push HTTPS ilə işləyir.
3. **Avtomatlaşdırma:** `/video` skill-i və `make-video.sh` (sessiyasız işə salmaq üçün) yaradıldı.
4. **MCP araşdırması:** Remotion-un rəsmi MCP serveri **köhnəlib (deprecated)**, onun yerinə Agent Skills tövsiyə olunur. Üçüncü tərəf Remotion MCP-lərinə ehtiyac yoxdur. ElevenLabs-ın MCP-si var, amma bizə lazım deyil (8-ci bəndə bax).
5. **Remotion skill-ləri:** `npx skills add remotion-dev/skills` ilə 12 skill repo-ya kopyalandı (versiya 4.0.537). Məzmunu yoxlanıldı, təhlükəli heç nə tapılmadı. `/video` hər dəfə əvvəlcə `remotion-best-practices`-i yükləyir.
6. **Videolar git-dən çıxarıldı:** istifadəçi istədi ki, git-də yalnız skelet olsun. `Root.tsx` avtomatik tapmaya keçirildi, `src/videos/*` ignore edildi. Əvvəlcə `orbit-launch` nümunə şablon kimi saxlanılmışdı, sonra istifadəçinin istəyi ilə o da çıxarıldı və bütün bilik ümumi şablonlar kimi skill-in `references/` qovluğuna yazıldı (7 üslub ilə birlikdə).
7. **Platforma seçimi:** istifadəçi iki seçim istədi. YouTube üçün **üfüqi 16:9**, TikTok/Instagram üçün **şaquli 9:16** seçildi. Köhnə videolar çevrilmədi, bu yalnız yeni videolara aiddir.
8. **Səs:** peşəkar reklam səsinin 3 qatı izah edildi (musiqi, SFX, diktor). Əvvəlcə yalnız SFX əlavə olundu: 7 səs ffmpeg ilə sintez edilir, lisenziyasızdır və hər dəfə eyni nəticə verir. `GymBoldPop` videosuna 30 səs işarəsi qoşuldu (pik −1.6 dBFS, −16.8 LUFS, sinxronluq dalğa forması ilə yoxlanıldı). Sonra SFX skeletə və skill-ə daxil edildi (`references/sound.md`).
9. **Diktor üçün MCP lazımdırmı?** **Xeyr**, API açarı kifayətdir. `.env` git-ignore edildi və `.env.example` əlavə olundu. Xidmət seçimi istifadəçidədir.

**Qeyd:** Claude səsi eşidə bilmir. Səsləri yalnız ölçür, spektroqram və dalğa formasına baxır. Səs keyfiyyətinə istifadəçi qulaqla qiymət verməlidir. Fitnes videosundakı SFX üçün istifadəçinin rəyi hələ gözlənilir.

---

## Lokalda olan videolar (yalnız orijinal kompüterdə)

| Video | Composition id | Üslub | Format | Qeyd |
|---|---|---|---|---|
| `orbit-launch` | `OrbitLaunch` | Dark Tech | 9:16 | SaaS təqdimatı, uydurma "Orbit" |
| `coffee-shop-promo` | `CoffeeShopPromo` | Warm Premium | 9:16 | Qəhvə dükanı, uydurma "Dəmlə"; qiymətlər nümunədir |
| `gym-bold-pop` | `GymBoldPop` | Bold Pop | 9:16 | Fitnes, uydurma "QÜVVƏ GYM", **SFX var**. Yoxlanılmalı: 49/79 AZN, "24/7" ilə "06:00–24:00" bir-birinə ziddir, "30 gündə yeni sən" vədi |

Render-lər: `out/orbit-launch.mp4`, `out/coffee-shop-promo.mp4`, `out/gym-bold-pop.mp4`.

## Faydalı əmrlər

```bash
npm run studio                                 # brauzerdə önizləmə
npm run typecheck
npx remotion compositions                      # mövcud videoların siyahısı
npx remotion render <Id> out/<slug>.mp4        # render
npm run sfx                                    # SFX dəstini yenidən yarat
npx skills update -p -y                        # Remotion skill-lərini yenilə
./make-video.sh <youtube|tiktok|both> "<mövzu>, 15s, <üslub>"
```
