# Changelog

All notable changes to What Should I Do are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions match the tags on the [Releases page](https://github.com/Illyriat/WhatShouldIDo/releases).

## [Unreleased]

### Added
- Language support: a Settings -> Language picker for switching this app's own UI text (labels, buttons, headings, descriptions) between English, French, German and Spanish, applied instantly and persisted across restarts. ESO's own game data (dungeon names, alchemy reagents/effects, enchanting runes, music box names/descriptions) always stays in English. Gated behind a `languageSupport` developer flag whose value is an array of per-language switches, so an individual language can be pulled without disabling the feature altogether
- Achievements page (above Settings in the sidebar): this app's own medals for progress you've already made elsewhere in the app - Music Box Collection (Tin-Gold: Owner/Collector/Curator/Maestro at 1/5/half/all collected), Alliance War Veterans (Tin-Platinum: Veteran/Champion/Warlord/Grand Marshal/Grand Overlord for 1/3/6/10/20 characters at Alliance Rank 50), and Wealth (Peasant through Magnate - gated on Gold, AP, Tel Var Stones and Writ Vouchers all clearing that class's bar at once, not just one of them; Magnate is intentionally the hardest medal in the app)
- Alliance Rank page: each character's Alliance War rank as a dual-ring progress circle toward Rank 50, plus exact Alliance Points remaining - powered by the new **What Should I Do - Data Collector** companion addon
- A welcome banner on Home naming the selected account, with that realm's total Champion Points shown underneath (also from the Data Collector addon)
- Wealth Tracker board on Home, next to Today's Pledges: realm-wide Gold / Alliance Points / Tel Var Stones / Writ Vouchers totals (the shared account-wide bank plus every character's carried amount), with a collapsible breakdown showing the bank total and a per-character table - also powered by the Data Collector addon
- Upcoming Pledges: a 5-day preview of future Undaunted Pledges, collapsed by default under Today's Pledges
- Developer feature flags (`src/shared/featureFlags.ts`) to ship a release with a feature pulled, plus a matching Settings -> Features checklist so users can hide pages they don't personally use
- Settings: collapsible Features/Addons lists and a jump-to-section nav, so the page stays manageable as more sections are added

### Changed
- Sidebar reorganized: Alliance Rank promoted to a top-level item, Alchemy/Enchanting grouped under Crafting, Music Boxes under Collections
- Settings now hides an addon's row entirely once nothing currently enabled still needs it
- Settings -> Features descriptions for Alliance Rank, Music Boxes and Wealth Tracker now note their tie-in with the new Achievements page, and the Achievements description lists all three achievements it covers
- Refreshed every README screenshot in dark theme
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

[Unreleased]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Illyriat/WhatShouldIDo/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Illyriat/WhatShouldIDo/releases/tag/v0.1.0
