/**
 * English strings - the source of truth for every other language's key shape. Every
 * other locale file is typed as `typeof en`, so TypeScript fails the build if a
 * translation is missing a key (or has an extra one) rather than silently falling back.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) is intentionally NOT covered here - it stays in English for
 * every language. This file only covers this app's own UI chrome.
 */
export const en = {
  common: {
    account: 'Account',
    server: 'Server',
    refresh: 'Refresh',
    refreshTitle: "Re-read SavedVariables from disk (ESO only writes them on logout / /reloadui)",
    loadingCharacters: 'Loading your ESO characters…',
    loadingAccounts: 'Loading your ESO accounts…',
    noCharactersFoundTitle: 'No characters found',
    noCharactersFoundBody: 'Install and enable the <bold>USPF</bold> addon in ESO, then log into at least one character so it can record your progress.',
    clear: 'Clear',
    character: 'Character',
    recommended: 'Recommended'
  },

  sidebar: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    home: 'Home',
    dungeonChecklist: 'Dungeon Check List',
    allianceRank: 'Alliance Rank',
    crafting: 'Crafting',
    alchemy: 'Alchemy',
    enchanting: 'Enchanting',
    collections: 'Collections',
    musicBoxes: 'Music Boxes',
    achievements: 'Achievements',
    settings: 'Settings',
    supportProject: 'Support the project'
  },

  home: {
    greeting: 'Welcome,',
    couldntLoadTitle: "Couldn't load pledge data",
    couldntLoadHint: "Make sure the USPF addon is installed and enabled in ESO, and that you've logged into the game at least once with it active."
  },

  pledges: {
    title: "Today's Pledges",
    cachedBadge: 'showing cached data',
    cachedTitle: 'Last fetched {{fetchedAt}}',
    dlc: 'DLC',
    base: 'Base',
    unknownDungeon: 'Unknown',
    noDataMapped: 'No completion data mapped for this dungeon yet',
    noDataBadge: 'no data',
    noData: 'No data.',
    everyoneDone: 'Every character has done this one.',
    showUpcoming_one: 'Show upcoming pledges ({{count}} day)',
    showUpcoming_other: 'Show upcoming pledges ({{count}} days)',
    tomorrow: 'Tomorrow'
  },

  riding: {
    title: 'Riding Training',
    stableMaster: 'Stable Master',
    daily: 'DAILY',
    trainingOptions: 'Capacity, Stamina or Speed',
    noneReady: 'No characters ready to train right now.'
  },

  wealth: {
    title: 'Wealth',
    totalInRealm: 'Total in {{server}} Realm',
    showBreakdown: 'Show breakdown',
    bank: 'Bank',
    byCharacter: 'By Character',
    noCharacters: 'No characters on this account/server.',
    bankTitle: '{{label}} - shared account-wide bank total',
    gold: 'Gold',
    alliancePoints: 'Alliance Points',
    telVarStones: 'Tel Var Stones',
    writVouchers: 'Writ Vouchers',
    goldShort: 'Gold',
    apShort: 'AP',
    telVarShort: 'Tel Var',
    writShort: 'Writ'
  },

  dungeons: {
    couldntLoadTitle: "Couldn't load dungeon data",
    baseGame: 'Base Game',
    dlc: 'DLC',
    noCharacters: 'No characters to show.'
  },

  allianceRank: {
    couldntLoadTitle: "Couldn't load character data",
    heading: 'Alliance Rank:',
    atMaxRank: '{{count}} / {{total}} at max rank',
    rank: 'Rank',
    maxRankReached: 'Max rank reached',
    circleAriaLabel: 'Rank {{rank}}, {{outerPct}}% of the way to rank 50, {{innerPct}}% through the current rank',
    apOfTotal: '{{current}} / {{max}} AP',
    apToRank50: '{{remaining}} AP to Rank 50',
    noDataYet: 'No data yet - log in with the <bold>WhatShouldIDoDataCollector</bold> addon active.'
  },

  alchemy: {
    pageTitle: 'Alchemy',
    intro: 'Pick a solvent and 2–3 reagents. Any trait shared by <bold>two or more</bold> of your reagents becomes an active effect. Water solvents make <bold>potions</bold> (effects land on you); oils make <bold2>poisons</bold2> (effects land on the enemy you hit).',
    findRecipeByEffect: 'Find a recipe by effect',
    pickUpToEffects: 'Pick up to {{count}} effects you want in the result',
    combinationsFound_one: '{{count}} {{mode}} combination — best first',
    combinationsFound_other: '{{count}} {{mode}} combinations — best first',
    potion: 'Potion',
    poison: 'Poison',
    noRecipeFor: 'No 2–3 reagent combination produces <bold>{{effects}}</bold> together{{modeSuffix}}',
    inAPotion: ' in a potion',
    inAPoison: ' in a poison',
    loaded: 'Loaded',
    use: 'Use',
    moreRecipes: '+{{count}} more — add another effect to narrow it down.',
    potionOrPoison: 'Potion or poison',
    solvent: 'Solvent',
    anyNotChosen: 'Any / not chosen',
    requires: 'Requires <bold>{{requirement}}</bold>',
    removeReagent: 'Remove {{name}}',
    remove: 'Remove',
    emptySlot: 'Empty slot — add a reagent below',
    noSharedTrait: 'No shared trait: <bold>{{names}}</bold> — currently adds nothing to the mix.',
    reagents: 'Reagents',
    filterByNameOrEffect: 'Filter by name or effect…',
    removeAReagentFirst: 'Remove a reagent first',
    noReagentMatches: 'No reagent matches "{{query}}".',
    resultingPotion: 'Resulting Potion',
    resultingPoison: 'Resulting Poison',
    addTwoReagents: "Add at least two reagents to see what you'll make.",
    noSharedTraits: 'These reagents share no traits — this combination produces nothing. Try reagents with overlapping effects.',
    harmsYou: 'harms you',
    helpsTarget: 'helps target',
    from: 'from {{names}}',
    negatives: ' negatives',
    wastedPositives: ' wasted positives',
    potionNegativesWarning: 'This potion carries negative effects that will land on you. Swap a reagent to drop them, or take Snakeblood to shorten them.',
    poisonPositivesWarning: 'This poison carries positive effects that will land on your target. Swap a reagent to drop them.',
    effectReference: 'Effect reference',
    clickEffectToSearch: 'Click an effect to search for recipes that make it.'
  },

  enchanting: {
    pageTitle: 'Enchanting',
    intro: "Build a glyph from the bottom up, or pick the <bold>glyph you want</bold> and the runes you need light up. Potency sets the glyph's level and whether it's <bold2>additive</bold2> or <bold2>subtractive</bold2>; Essence sets the effect; Aspect sets the quality.",
    iWantToMake: 'I want to make…',
    anyGlyph: '— any glyph (build manually) —',
    glyphsGroup: '{{itemType}} glyphs',
    clearTarget: 'Clear target',
    targetHint: 'Use essence rune <bold>{{essence}}</bold> ({{translation}}) with any <bold>{{potencyType}}</bold> potency rune for the level you want (highlighted below). Add an Aspect rune for quality.',
    weapon: 'Weapon',
    armor: 'Armor',
    jewelry: 'Jewelry',
    additive: 'Additive',
    subtractive: 'Subtractive',
    needed: 'needed',
    potencyRune: 'Potency rune',
    essenceRune: 'Essence rune',
    aspectRune: 'Aspect rune',
    resultingGlyph: 'Resulting Glyph',
    pickHighlightedPotency: 'Pick a highlighted Potency rune to finish the glyph.',
    chooseTwoRunes: 'Choose a Potency and an Essence rune to see the glyph.',
    glyph: '{{itemType}} glyph',
    level: 'Level',
    quality: 'Quality',
    pickAnAspectRune: 'pick an Aspect rune',
    runes: 'Runes',
    essenceRuneReference: 'Essence rune reference',
    clickGlyphToTarget: 'Click a glyph to target it above.',
    essence: 'Essence',
    translation: 'Translation',
    additivePotencyCol: '+ Additive potency',
    subtractivePotencyCol: '+ Subtractive potency'
  },

  musicBoxes: {
    pageTitle: 'Music Boxes',
    introTracked: 'Every currently obtainable <bold>Music Box</bold> furnishing. Tick one off once you own it. Progress is tracked separately per account and server, and saved on this device.',
    introUntracked: 'Every currently obtainable <bold>Music Box</bold> furnishing. Tick one off once you own it. Progress is saved on this device. Install USPF and SkillLines and log in with a character to track it separately per account and server.',
    collected: 'Collected {{count}} / {{total}}',
    filterPlaceholder: 'Filter by name, source, or description…',
    all: 'All',
    missing: 'Missing',
    collectedFilter: 'Collected',
    filterByCollected: 'Filter by collected status',
    gotIt: 'Got it',
    name: 'Name',
    source: 'Source',
    cost: 'Cost',
    noMatches: 'No music box matches "{{query}}".'
  },

  achievements: {
    pageTitle: 'Achievements',
    introTracked: "What Should I Do's own medals, earned as you make progress in the app. Tracked separately per account and server, and saved on this device.",
    introUntracked: "What Should I Do's own medals, earned as you make progress in the app. Saved on this device.",
    noneVisible: "Every achievement is tied to a feature you've turned off in Settings. Re-enable Music Boxes, Alliance Rank, or Wealth Tracker to see progress here.",
    currentMedal: 'Current medal: <bold>{{name}}</bold>',
    currentClass: 'Current class: <bold>{{name}}</bold>',
    medalAltEarned: '{{tier}} medal, earned',
    medalAltLocked: '{{tier}} medal, locked',
    classAltEarned: '{{tier}} class, earned',
    classAltLocked: '{{tier}} class, locked',
    musicBox: {
      title: 'Music Box Collection',
      description: 'Collect Music Box furnishings, tracked on the Music Boxes page.',
      progress: '{{count}} / {{total}} collected',
      notStarted: 'Collect your first Music Box to earn the {{tier}} medal.',
      tiers: { tin: 'Owner', bronze: 'Collector', silver: 'Curator', gold: 'Maestro' }
    },
    allianceRank: {
      title: 'Alliance War Veterans',
      description: 'Get characters to Alliance Rank 50, tracked on the Alliance Rank page.',
      progress: '{{count}} at Rank 50',
      notStarted: 'Get one character to Alliance Rank 50 to earn the {{tier}} medal.',
      tiers: { tin: 'Veteran', bronze: 'Champion', silver: 'Warlord', gold: 'Grand Marshal', platinum: 'Grand Overlord' }
    },
    wealth: {
      title: 'Wealth',
      description: 'Get every currency up - Gold, Alliance Points, Tel Var Stones and Writ Vouchers - the shared bank plus every character carrying them.',
      amountsSummary: '{{gold}} Gold · {{ap}} AP · {{telVar}} Tel Var · {{writ}} Writ',
      notStarted: 'Reach {{gold}} Gold to earn the {{tier}} class.',
      tiers: { peasant: 'Peasant', commoner: 'Commoner', merchant: 'Merchant', noble: 'Noble', baron: 'Baron', magnate: 'Magnate' }
    }
  },

  settings: {
    pageTitle: 'Settings',
    jumpToSection: 'Jump to settings section',
    dataFolderNav: 'ESO Data Folder',
    featuresNav: 'Features',
    addonsNav: 'Addons',
    languageNav: 'Language',
    themeNav: 'Theme',
    aboutNav: 'About',
    dataFolderTitle: 'ESO Data Folder',
    dataFolderBody: "This app reads your ESO SavedVariables from your Documents folder. If Windows/OneDrive has redirected Documents elsewhere, point it at the right one here.",
    browse: 'Browse…',
    resetToDefault: 'Reset to default',
    noAccountsFound: 'No accounts found in this folder - double check it contains an "Elder Scrolls Online" folder with your addon data.',
    foundAccounts_one: 'Found {{count}} account,',
    foundAccounts_other: 'Found {{count}} accounts,',
    foundCharacters_one: '{{count}} character.',
    foundCharacters_other: '{{count}} characters.',
    couldntReadFolder: "Couldn't read this folder: {{message}}",
    featuresTitle: 'Features',
    featuresBody: "Turn off anything you don't use to declutter the sidebar. This only hides the page - your data isn't touched, and you can turn it back on anytime.",
    addonsTitle: 'Addons',
    addonsBody: 'This app reads data that ESO addons write to disk. Install them from <esoui>ESOUI</esoui> (or Minion), enable them in-game, then log into each character once with them active so they have data to write.',
    required: 'Required',
    optional: 'Optional',
    checking: 'Checking…',
    detected: 'Detected ({{file}} found)',
    notDetected: 'Not detected (no {{file}} on disk)',
    detectedShort: '✓ detected',
    notDetectedShort: 'not detected',
    languageTitle: 'Language',
    languageBody: "Changes what this app's own text is shown in. ESO's own game data (dungeon names, reagents, etc.) always stays in English.",
    themeTitle: 'Theme',
    themeSystemLabel: 'System',
    themeSystemDesc: 'Follows your OS light/dark setting',
    themeDarkLabel: 'Dark',
    themeDarkDesc: 'The default - orange & teal',
    themeLightLabel: 'Light',
    themeLightDesc: 'Same accents, light background',
    themeEmberLabel: 'Ember',
    themeEmberDesc: 'Warm, high-contrast dark',
    themeFrostLabel: 'Frost',
    themeFrostDesc: 'Cool blue dark theme',
    aboutTitle: 'About',
    version: 'Version',
    build: 'Build',
    checkForUpdates: 'Check for Updates',
    restartAndInstall: 'Restart & Install',
    updateChecking: 'Checking for updates…',
    updateAvailable: 'Update v{{version}} found - downloading…',
    updateNotAvailable: "You're up to date.",
    updateDownloading: 'Downloading update… {{percent}}%',
    updateDownloaded: 'Version {{version}} downloaded - restart to install.',
    madeBy: 'Made by Illyriat. If this app is useful to you, you can <support>support the project</support>.',
    features: {
      welcomeBanner: {
        label: 'Welcome banner',
        description: 'The "Welcome, <account>!" banner (and Champion Points) at the top of the Home page.'
      },
      pledges: {
        label: "Today's Pledges",
        description: "Today's Undaunted Pledge dungeons and recommendations on the Home page."
      },
      upcomingPledges: {
        label: 'Upcoming pledges preview',
        description: "The 5-day upcoming-pledges toggle under Today's Pledges."
      },
      ridingTraining: {
        label: 'Riding Training',
        description: 'The Riding Training board on the Home page.'
      },
      dungeonChecklist: {
        label: 'Dungeon Check List',
        description: 'The full per-character dungeon completion checklist page.'
      },
      allianceRank: {
        label: 'Alliance Rank',
        description: 'The Alliance Rank page, and its Alliance War Veterans medal on the Achievements page.'
      },
      alchemy: {
        label: 'Alchemy',
        description: 'The Alchemy calculator page.'
      },
      enchanting: {
        label: 'Enchanting',
        description: 'The Enchanting calculator page.'
      },
      musicBoxes: {
        label: 'Music Boxes',
        description: 'The Music Boxes collection checklist, and its Music Box Collection medal on the Achievements page.'
      },
      wealthTracker: {
        label: 'Wealth Tracker',
        description: 'The Gold / Alliance Points / Tel Var Stones / Writ Vouchers board on the Home page, and its Wealth medal on the Achievements page.'
      },
      achievements: {
        label: 'Achievements',
        description: "This app's own achievements page: Music Box collection medals, Alliance War Veterans (characters at Alliance Rank 50), and Wealth classes (Gold / Alliance Points / Tel Var Stones / Writ Vouchers)."
      },
      languageSupport: {
        label: 'Language',
        description: 'The language picker in Settings for switching this app\'s own text to another language.'
      }
    },
    addonsList: {
      skillLines: {
        name: 'Skill Lines',
        description: 'Tags each character with the megaserver it lives on (NA / EU). The app relies on this to tell your characters apart and to make the Account and Server switchers work.'
      },
      uspf: {
        name: "Urich's Skill Point Finder (USPF)",
        description: 'Records which dungeon quests each character has finished. Powers the daily Undaunted Pledge recommendations and the Dungeon Check List. Without it those pages have no data. This is the core feature of WhatShouldIDo.'
      },
      dailyCraftStatus: {
        name: 'Daily Craft Status',
        description: "Tracks each character's riding-training cooldown and Capacity / Stamina / Speed levels. Powers the Riding Training board on the Home page."
      },
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description: "A purpose-built companion addon that records each character's Alliance War rank and Alliance Points progress (powers the Alliance Rank page), each account's Champion Points per realm (shown on the Home page banner), and Gold / Alliance Points / Tel Var Stones / Writ Vouchers - both each character's carried amount and the shared account-wide bank total per realm (powers the Wealth Tracker on the Home page)."
      }
    }
  },

  updateBanner: {
    readyToInstall: 'Version {{version}} is ready to install.',
    restartAndInstall: 'Restart & Install',
    dismiss: 'Dismiss'
  }
}
