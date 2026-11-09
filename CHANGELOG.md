# Changelog

All notable changes to What Should I Do are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions match the tags on the [Releases page](https://github.com/Illyriat/WhatShouldIDo/releases).

## [Unreleased]

### Added
- Dungeon Check List: two new sections for skill points earned outside the Undaunted Pledge dungeons, tracked per character. **Solo Dungeons** covers the Update 51 solo versions of Moon Hunter Keep and March of Sacrifices, whose quests are separate from the group versions', so each character can earn both points. **Arenas** covers Maelstrom Arena (normal or veteran) and the Infinite Archive; the other arenas don't grant a skill point. Needs the Data Collector addon v1.6.0, and each character has to log in once with it before their ticks show
- Campaign Tiers page: a table of each character's home Alliance War campaign, reward tier and progress toward the next tier, straight from the game. Once a campaign's end time passes, its rows show "campaign ended" until that character logs in again. Needs the Data Collector addon v1.7.0
- A new PvP dropdown in the sidebar holds Alliance Rank and Campaign Tiers

### Changed
- Alchemy updated for Update 51's rework: 38 reagents (new: Cultivated Cryptpods, Daedra-Blood Maggots, Fossilized Verminous Bones, Winter's Grave Tongue) and 34 effects. Weapon/Spell Power are now **Increase Power**, Weapon/Spell Critical are now **Critical**, Maim is gone, and **Force**, **Mending**, **Vexation**, **Damage Shield** and **Heal Absorption** are new. Many existing reagents changed traits, so old recipes may give different results. Data from eso-hub, checked pair by pair against UESP
- The Dungeon Check List is now a sidebar dropdown with four sub-pages (Base Game, DLC, Solo Dungeons, Arenas) instead of one long page, so it doesn't turn into an endless scroll as more content is added
- Upgraded Electron 33 to 44 (Chromium 152, Node 24)
- Upgraded the build toolchain: electron-vite 2 to 5 and Vite 5 to 7, with `@vitejs/plugin-react` 5 to match. Vite is now a direct devDependency, and the deprecated `externalizeDepsPlugin` is gone from `electron.vite.config.ts` (electron-vite 5 externalizes dependencies by default)
- Updated React to 19.3, react-i18next to 17.0.15 and `@types/node` to 24
- Refreshing is faster: the addon's SavedVariables file is now read once per refresh instead of up to three times, and the Wealth board no longer rebuilds its number formatter for every cell
- Internal tidy-up of the SavedVariables readers - the helpers each one had its own copy of now live in `src/main/eso/collectorSavedVars.ts`, and the account builder's repeated merge blocks are two shared helpers. No change in behaviour

### Fixed
- Campaign Tiers table: its header row was as tall as the Dungeon Check List's rotated headers and its cells had no padding, because the dungeon table's own styles overrode the page's
- Corrected stale and misplaced code comments, including one that still named the retired AllianceRankTracker addon.
- German translations checked by a German speaker and corrected were needed.

### Security
- Cleared every known dependency vulnerability (`npm audit`: 8 down to 0). Electron 33 was end-of-life with around 35 open advisories; the rest were in brace-expansion, fast-uri, undici, extract-zip and esbuild
- Patched newly published dependency advisories (`npm audit`: 13 down to 6, no high-severity left): Electron 44.5.1 to 44.10.2 (compromised eMudhra intermediate certificates), Vite 7.3.6 to 7.3.8, Vitest 4.1.11 to 4.1.12, electron-builder 26.15.3 to 26.18.0 and electron-updater 6.8.9 to 6.8.11, plus a lockfile refresh that also clears the undici, fast-uri and source-map-js advisories. The 6 remaining are moderate `minimatch` advisories inside electron-builder's packaging tools - they only run at build time, never ship in the app, and need a breaking upgrade to clear
- Links now only open in your browser if they are `https` - anything else is refused instead of being handed to the operating system

## [0.3.1] - 2026-09-21

### Changed
- The "Support the project" links (the sidebar button and the line in Settings -> About) now point to Ko-fi (ko-fi.com/illyriat)

## [0.3.0] - 2026-09-21

### Added
- The **What Should I Do - Data Collector** addon now ships inside the app. Settings -> Addons has an **Install** button that copies it into your ESO AddOns folder (every profile it finds: live, EU, PTS), so there's no separate download or manual copying (this release bundles Data Collector v1.5.0). On each launch the app also updates an already-installed Data Collector to the version bundled with it - it never downgrades a newer install and never installs into a profile you didn't install to. Restart ESO (or `/reloadui`) after installing or updating
- Settings -> Addons now lists **LibUndauntedPledges** (the third-party library the Data Collector needs) with a detected/missing/too-old status and a link to ESOUI. It is not bundled - it's someone else's addon, so it's still a separate download
- Language support: a Settings -> Language picker for switching this app's own UI text (labels, buttons, headings, descriptions) between English, French, German, Spanish, Polish and Russian, applied instantly and persisted across restarts. ESO's own game data (dungeon names, alchemy reagents/effects, enchanting runes, music box names/descriptions) always stays in English. Gated behind a `languageSupport` developer flag whose value is an array of per-language switches, so an individual language can be pulled without disabling the feature altogether. Polish and Russian use CLDR's four-form plural system (one/few/many/other) rather than English's one/other
- Achievements page (above Settings in the sidebar): this app's own medals for progress you've already made elsewhere in the app - Music Box Collection (Tin-Gold: Owner/Collector/Curator/Maestro at 1/5/half/all collected), Alliance War Veterans (Tin-Platinum: Veteran/Champion/Warlord/Grand Marshal/Grand Overlord for 1/3/6/10/20 characters at Alliance Rank 50), and Wealth (Peasant through Magnate - gated on Gold, AP, Tel Var Stones and Writ Vouchers all clearing that class's bar at once, not just one of them; Magnate is intentionally the hardest medal in the app)
- Alliance Rank page: each character's Alliance War rank as a dual-ring progress circle toward Rank 50, plus exact Alliance Points remaining - powered by the new **What Should I Do - Data Collector** companion addon
- A welcome banner on Home naming the selected account, with that realm's total Champion Points shown underneath (also from the Data Collector addon)
- Wealth Tracker board on Home, next to Today's Pledges: realm-wide Gold / Alliance Points / Tel Var Stones / Writ Vouchers totals (the shared account-wide bank plus every character's carried amount), with a collapsible breakdown showing the bank total and a per-character table - also powered by the Data Collector addon
- Upcoming Pledges: a 5-day preview of future Undaunted Pledges, collapsed by default under Today's Pledges
- Developer feature flags (`src/shared/featureFlags.ts`) to ship a release with a feature pulled, plus a matching Settings -> Features checklist so users can hide pages they don't personally use
- Settings: collapsible Features/Addons lists and a jump-to-section nav, so the page stays manageable as more sections are added

### Changed
- Settings -> Addons status now reflects the installed addon version and whether an update is available, instead of only whether the addon had written its SavedVariables file yet
- Character list, server labels and dungeon quest completion (Pledges + Dungeon Check List) now come from the **What Should I Do - Data Collector** companion addon (v1.3.0+) instead of USPF and Skill Lines - those two addons are no longer required or read at all. The Data Collector now ships with the app: after updating, open Settings -> Addons and click Install (an existing copy is updated automatically on launch), then restart ESO and log into each character once with it active.
- Riding training status now also comes from the **What Should I Do - Data Collector** addon (v1.4.0+) instead of DailyCraftStatus, which is no longer required or read at all. WhatShouldIDo now depends on a single addon.
- Today's + upcoming Undaunted Pledges are now computed by the **What Should I Do - Data Collector** addon (v1.5.0+, via the [LibUndauntedPledges](https://www.esoui.com/downloads/info3946-LibUndauntedPledges.html) library) instead of this app scraping a website - no more network fetch, cache file, or blocking risk, and the rotation is now resolved per realm (NA and EU can differ on the same calendar day, which the old single global scrape couldn't represent). Requires the Data Collector (bundled with the app, see above) and LibUndauntedPledges, which is a separate download from ESOUI.
- Sidebar reorganized: Alliance Rank promoted to a top-level item, Alchemy/Enchanting grouped under Crafting, Music Boxes under Collections
- Settings now hides an addon's row entirely once nothing currently enabled still needs it
- Settings -> Features descriptions for Alliance Rank, Music Boxes and Wealth Tracker now note their tie-in with the new Achievements page, and the Achievements description lists all three achievements it covers
- Number formatting (Gold, Alliance Points, Tel Var Stones, Writ Vouchers, Champion Points) now follows the selected app language's locale instead of the OS default

### Fixed
- Achievements page: the Music Box Collection medal now hides itself when the Music Boxes feature is turned off in Settings, matching how the Alliance War Veterans and Wealth medals already behave; the page also shows a message instead of an empty screen if every underlying feature is disabled

## [0.2.0] - 2026-09-13

### Added
- Music Boxes collection checklist under a new Collections sidebar group - every currently-obtainable Music Box furnishing with its cost and source, tracked separately per account and server
- Settings addon list now shows a live "detected" / "not detected" badge per addon, instead of just naming them

### Changed
- Renamed "Potion Crafting" to "Alchemy" throughout, matching the game's own naming

## [0.1.2] - 2026-08-29

### Added
- Settings page lists every required and optional addon, with install links and what each one powers
- GitHub pull request and issue templates

## [0.1.1] - 2026-08-29

### Added
- Direct download buttons and a download-count badge in the README
- A real LICENSE file

### Fixed
- Releases now publish immediately instead of sitting as drafts
- Installer filenames no longer contain spaces, which GitHub was mangling inconsistently
- Corrected the electron-builder publish config (`releaseType` instead of a non-existent `publish.draft` option)

## [0.1.0] - 2026-08-29

### Added
- Initial release: Today's Undaunted Pledges resolved against real dungeon names, with per-character completion tracking
- Dungeon Check List: full base-game and DLC quest completion, per character
- Riding Training board (Capacity / Stamina / Speed)
- Alchemy and Enchanting calculators, with bundled official icons
- Account and Server switcher for multi-account, multi-realm setups
- Settings: ESO data folder picker and five themes (System, Dark, Light, Ember, Frost)
- Auto-updates via electron-updater

[Unreleased]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Illyriat/WhatShouldIDo/releases/tag/v0.1.0
