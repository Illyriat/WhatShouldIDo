# What Should I Do

![Version](https://img.shields.io/badge/version-v0.1.1-blue)  [![License: All Rights Reserved](https://img.shields.io/badge/license-All--Rights--Reserved-red)](./LICENSE)  ![Usage: No Redistribution](https://img.shields.io/badge/Usage-No%20Redistribution-red)  ![Built with Electron](https://img.shields.io/badge/Built%20with-Electron-9feaf9)  [![Downloads](https://img.shields.io/github/downloads/Illyriat/WhatShouldIDo/total)](https://github.com/Illyriat/WhatShouldIDo/releases/latest)

### A desktop companion that tells you what to do today across every character on every account, for every server.

[![Download for Windows](https://img.shields.io/badge/Download-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/Illyriat/WhatShouldIDo/releases/latest/download/WhatShouldIDo-Setup.exe)
[![Download for macOS](https://img.shields.io/badge/Download-macOS%20(Apple%20Silicon)-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/Illyriat/WhatShouldIDo/releases/latest/download/WhatShouldIDo-arm64.dmg)
[![Download for Linux](https://img.shields.io/badge/Download-Linux%20(AppImage)-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/Illyriat/WhatShouldIDo/releases/latest/download/WhatShouldIDo.AppImage)

These always grab the newest release directly - no need to dig through the [Releases page](https://github.com/Illyriat/WhatShouldIDo/releases). None of these builds are code-signed yet, so expect a "Windows protected your PC" (click **More info → Run anyway**) or macOS Gatekeeper warning (right-click the app → **Open**) on first launch - that's expected, not a sign anything's broken. The macOS build is Apple Silicon (M-series) only for now; there's no Intel Mac build yet. Prefer a `.deb`? Grab it from the [latest release](https://github.com/Illyriat/WhatShouldIDo/releases/latest) instead.

    * For this app to work you first need the required addons installed in ESO (see below).
        ** Log into each character at least once with them active so they have data to read.
        ** ESO only writes SavedVariables to disk on logout or /reloadui - do one of those before checking the app for the latest state.

This app reads directly from your local ESO SavedVariables files - no manual entry, no separate account linking. It finds every account and character on your PC automatically from the standard `Documents\Elder Scrolls Online` location - and if Windows/OneDrive has redirected your Documents folder elsewhere, Settings lets you point it at the right one.

As a whole this will track:
- Today's three Undaunted Pledges, resolved against real dungeon names, with a note if a dungeon can't yet be mapped
- Which of your characters still need to run each of today's pledge dungeons (per-character quest completion, not achievement-based, so it's accurate per character rather than per account)
- Which characters are ready for their daily riding (Capacity/Stamina/Speed) training, and which have already maxed out
- A full completion checklist of every base-game and DLC dungeon quest, per character, split into two tables so the long DLC list stays readable
- An Account and Server switcher, so multi-account and NA/EU players see only the characters relevant to what they've selected
- A Potion Crafting page: pick a solvent and 2-3 reagents and see exactly which effects the mix produces (and which land on the wrong side) - or work backwards, pick the effects you want and it lists the reagent combinations that make them, best (cleanest) first. Full reagent/effect data with official in-game icons bundled offline
- An Enchanting page: pick Potency + Essence + Aspect runes and see the exact glyph produced - item type, effect, level and quality - or pick the glyph you want and the runes you need light up. Full essence-rune reference table, again with bundled official icons

The sidebar can be collapsed down to icons when you don't need it. Settings (bottom-left) has two things: a folder picker for your ESO data (with live feedback on how many accounts/characters it found, in case Documents isn't where the app expects), and five themes - System, Dark, Light, Ember and Frost - which apply everywhere and are remembered next time you open the app.

![Home Page](./img/home.png)
![Dungeon Check List](./img/dungeon-checklist.png)
![Potion Crafting](./img/alchemy.png)
![Enchanting](./img/enchanting.png)

## Required Addons

Install and enable all three, then log into each character once with them active:

| Addon | Used for |
|---|---|
| [Urich's Skill Point Finder (USPF)](https://www.esoui.com/downloads/info1863-UrichsSkillPointFinder.html) | Per-character dungeon quest completion (Pledges + Dungeon Check List) |
| [Skill Lines](https://www.esoui.com/downloads/info4041-SkillLines.html) | Knowing which server (NA/EU) each character is on |
| [Daily Craft Status](https://esoui.com/downloads/info2510-DailyCraftStatus.html) | Riding training status |

## Running it

```
npm install
npm run dev
```

## Tests

```
npm run typecheck
npm test
```

Unit/integration tests cover the app's actual data logic - pledge name matching, the Lua SavedVariables parser (including its Unicode round-trip), and the USPF/SkillLines/DailyCraftStatus extractors and their multi-realm-bucket merging (the trickiest, least-obvious part of this app, per `accountBuilder.test.ts`'s fixture-based end-to-end case) - plus the Alchemy/Enchanting calculators. No UI/renderer tests yet. CI (`.github/workflows/ci.yml`) runs both on every push and PR.

## Building for a release

Installers are built for Windows (NSIS), macOS (dmg + zip) and Linux (AppImage + deb) from `electron-builder.yml`. Building an installer for a given OS has to actually run on that OS (a macOS `.dmg` needs `hdiutil`, a `.deb` needs `dpkg`/`fakeroot` - neither exists on Windows), so cross-platform releases go through CI rather than one machine building all three:

```
npm run typecheck
npm run build:win     # or build:mac / build:linux, run on that OS
```

`npm run build:win` (etc.) produces an installer under `dist/`. If you just want the unpacked app folder to poke at without building an installer, use `npm run build:unpack` instead - output lands in `dist/win-unpacked/` (or `mac`/`linux-unpacked`).

### Shipping a release (all three platforms)

`.github/workflows/release.yml` builds Windows, macOS and Linux in parallel and publishes all of them to the same [GitHub Release](https://github.com/Illyriat/WhatShouldIDo/releases), so everyone already running the app gets offered the update automatically (the app checks silently on launch, and there's a "Check for Updates" button in Settings too):

1. Bump `version` in `package.json`.
2. Commit, then tag and push:
   ```
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. The workflow picks up the tag push and does the rest. Progress: the repo's Actions tab.

To build+publish from your own machine instead (only reaches whichever platform you're running on), set a `GH_TOKEN` environment variable to a GitHub personal access token with `repo` access and run `npm run publish`.

**Note:** none of these builds are code-signed. Windows installers will show a SmartScreen "unrecognized app" warning, and unsigned macOS builds are blocked by Gatekeeper (right-click -> Open works around it) until this is set up with an Apple Developer account (for notarization) and a Windows code-signing certificate.

## License

All rights reserved - see [LICENSE](./LICENSE) for the full terms. Redistribution, reuploading, or rehosting this software anywhere other than the official [Releases page](https://github.com/Illyriat/WhatShouldIDo/releases) is not permitted.

#
> This Add-on is not created by, affiliated with or sponsored by ZeniMax Media Inc. or its affiliates.
> The Elder Scrolls® and related logos are registered trademarks or trademarks of ZeniMax Media Inc. in the United States and/or other countries.
> All rights reserved.
