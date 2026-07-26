# 🍑 April Eats Out — Your Sassy Foodie Guide

**April Kot** (אפריל קוט) is a playful restaurant-shuffler with opinions. One screen,
one decision, one good meal. Live at
[where-to-eat-out.theapricotlabs.com](https://where-to-eat-out.theapricotlabs.com/).

## How it works

- The content is a **public Google Sheet** ([this one](https://docs.google.com/spreadsheets/d/1h1IIi8Ns3j8z2VoLs6Hr-3yl58LV3PhevL_qIKNU8SY)) read through OpenSheet — no backend, no database. Add a row, the app picks it up in seconds.
- Maps are embedded **without any API key** (Google's keyless `output=embed`).
- The shuffle never repeats a place until it has shown everything in the chosen city.

## The sheet columns

| Column | What to put there |
|---|---|
| שם המקום | Restaurant name (required — empty rows are skipped) |
| עיר | City (feeds the city filter) |
| כתובת (אופציונלי) | Address shown on the card |
| קטגוריה / קטגוריה יבשה ? / מתי ללכת? / תגיות | Free text — also used to auto-pick April's pose |
| משפט | April's one-liner. Empty → she improvises by category |
| שם תמונה מתאימה | A pose name from the wardrobe below, or empty to auto-pick |
| לינק לאינסטגרם, אתר, לינק לגוגל מפות, לינק וולט, לינק להזמנות - לא וולט | Links (use `אין` or leave empty when there's none) |

## April's wardrobe

Every pose is a file in `public/characters/`, registered in
[`src/lib/characters.ts`](src/lib/characters.ts). In the sheet you can write the
English key, the Hebrew alias, or nothing at all (auto-pick by category):

| Key | Hebrew | Scene |
|---|---|---|
| `toast` | קוקטייל / יין → | elegant martini toast |
| `sassy` | בר | side-eye martini |
| `wink` | קריצה | winking |
| `surprised` | הפתעה | shocked delight |
| `thinking` | חושבת | coy glance |
| `excited` | מתלהבת | waving, sparkle eyes |
| `crystal` | קסם | crystal ball |
| `cafe` | קפה / מאפים | coffee + pastries |
| `burger` | בורגר | burger bite |
| `noodles` | אסייתי / נודלס | chopsticks + bowl |
| `bbq` | על האש / מנגל | grill + skewers |
| `scooter` | וולט / משלוחים | Wolt scooter |
| `wine` | יין | red wine swirl |
| `fancy` | שף | silver cloche reveal |
| `dessert` | גלידה / קינוח | triple-scoop cone |
| `pizza` | פיצה | cheese-pull slice |
| `shakshuka` | שקשוקה / בוקר | cast-iron skillet |
| `hummus` | חומוס | pita dip |
| `sushi` | סושי | nigiri + chopsticks |
| `seafood` | דגים / פירות ים | grilled fish plate |

To add a pose: generate it in the same retro style (references: any file in
`public/characters/`), save as `public/characters/<key>.png` (~640px), and add
one line to `CHARACTERS` in `src/lib/characters.ts`.

## Tech

React + TypeScript + Vite · Tailwind · Radix UI · Google Sheets as CMS (OpenSheet)

## Running locally

```bash
git clone https://github.com/yayayam-uxui/april-eats-out-now.git
cd april-eats-out-now
npm install
npm run dev
```

## ✍️ Built by Apricot Labs

Designed with love, sass, and a lot of good food.
