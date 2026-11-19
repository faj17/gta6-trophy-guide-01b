# VICE TRACKER — GTA VI Trophy Guide & Platinum Roadmap

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI
(1 platinum, 2 gold, 6 silver, 46 bronze). Built for the make.fun competition
`gta6-trophy-guide-01`.

## What it is

- **Checklist of all 55 trophies** with the official name, description and grade exactly as
  PlayStation publishes them, plus a guide in our own words for each one — what to do,
  where and how, and when it can be missed — with its sources named beside it
  (PSNProfiles and Exophase trophy lists, linked per trophy).
- **Tracker:** tick a trophy when you earn it; progress saves in the browser (localStorage,
  key `gta6-trophy-guide-v1`) and can be exported to a JSON file and imported back.
- **Filters:** by grade, by kind (story, missable, collectibles, activities, online), and
  free-text search. There are **no online trophies** in this set — the online filter says
  so on purpose.
- **Spoiler setting:** hides the names and descriptions of story trophies until they are
  earned ("Hidden story trophy — earn it to reveal").
- **Roadmap to the platinum:** eight stages built from the official descriptions — story
  chapters 1–4 and the finale in order, then stranger strands, then the collectible and
  activity grinds with their counts (250 stunts, 42 Shooting Range golds, 14 drone races,
  20 races, 18 meditation spots, 3 card sets, 100 WAiNK, 100 vehicles, 52 areas, 5 bank
  vaults, $250k laundering, $100k spending, 8 garages, 10 Scooter Bros registrations,
  50 challenges), ending at 100% completion and the platinum.
- **Missable flags:** 22 trophies carry a visible ⚑ MISSABLE badge — chapter completions,
  named missions, story choices and partner co-op moments. Count trophies are flagged as
  grinds, not missables.

## Honesty note

The game had not released when this guide was written. Guides follow the official
descriptions and what PSNProfiles and Exophase list, and any detail not yet confirmed in
play is flagged as such in the guide — check the linked source before trusting it. No
precise location is stated as fact without a source.

## Run it

Static files, no build step, works with the network off:

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Open `app/index.html` in desktop Chrome. The app fetches only its own local
`app/data/trophies.json`; source links open only when you follow them.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Layout

- `app/index.html` — page, roadmap, checklist, detail panel
- `app/app.js` — tracker: render, filters, spoiler setting, localStorage, export/import
- `app/style.css` — dark neon "Vice" look (our own design; no Rockstar logo or artwork)
- `app/data/trophies.json` — all 55 trophies: official fields + kind, missable flag, count,
  own-words guide, sources
- `screenshots/` — 4 real browser renders of the app (cover first)
- `main.ts` — hand-in program; `serve.ts` — local static server

## License

MIT — see `LICENSE`.
