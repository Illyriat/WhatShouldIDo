import type { en } from './en'

/**
 * German translation - drafted by an AI assistant, needs review by a native German
 * speaker before shipping with the `languageSupport` flag on. Typed as `typeof en` so
 * a missing or extra key fails the build instead of silently falling back to English.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) intentionally stays in English - see en.ts's header comment.
 */
export const de: typeof en = {
  common: {
    account: 'Konto',
    server: 'Server',
    refresh: 'Aktualisieren',
    refreshTitle: 'SavedVariables erneut von der Festplatte lesen (ESO schreibt sie nur beim Abmelden oder mit /reloadui)',
    loadingCharacters: 'Deine ESO-Charaktere werden geladen…',
    loadingAccounts: 'Deine ESO-Konten werden geladen…',
    noCharactersFoundTitle: 'Keine Charaktere gefunden',
    noCharactersFoundBody:
      'Installiere und aktiviere das Addon <bold>USPF</bold> in ESO und melde dich dann mit mindestens einem Charakter an, damit er deinen Fortschritt aufzeichnen kann.',
    clear: 'Leeren',
    character: 'Charakter',
    recommended: 'Empfohlen'
  },

  sidebar: {
    collapse: 'Seitenleiste einklappen',
    expand: 'Seitenleiste ausklappen',
    home: 'Start',
    dungeonChecklist: 'Dungeon-Checkliste',
    allianceRank: 'Allianzrang',
    crafting: 'Handwerk',
    alchemy: 'Alchemie',
    enchanting: 'Verzauberung',
    collections: 'Sammlungen',
    musicBoxes: 'Spieluhren',
    achievements: 'Erfolge',
    settings: 'Einstellungen',
    supportProject: 'Projekt unterstützen'
  },

  home: {
    greeting: 'Willkommen,',
    couldntLoadTitle: 'Gelöbnisdaten konnten nicht geladen werden',
    couldntLoadHint:
      'Stelle sicher, dass das Addon USPF in ESO installiert und aktiviert ist und dass du dich mindestens einmal mit aktivem Addon ins Spiel eingeloggt hast.'
  },

  pledges: {
    title: 'Heutige Gelöbnisse',
    cachedBadge: 'zeigt zwischengespeicherte Daten',
    cachedTitle: 'Zuletzt abgerufen: {{fetchedAt}}',
    dlc: 'DLC',
    base: 'Basis',
    unknownDungeon: 'Unbekannt',
    noDataMapped: 'Für diesen Dungeon sind noch keine Abschlussdaten zugeordnet',
    noDataBadge: 'keine Daten',
    noData: 'Keine Daten.',
    everyoneDone: 'Jeder Charakter hat diesen bereits abgeschlossen.',
    showUpcoming_one: 'Kommende Gelöbnisse anzeigen ({{count}} Tag)',
    showUpcoming_other: 'Kommende Gelöbnisse anzeigen ({{count}} Tage)',
    tomorrow: 'Morgen'
  },

  riding: {
    title: 'Reittraining',
    stableMaster: 'Stallmeister',
    daily: 'TÄGLICH',
    trainingOptions: 'Kapazität, Ausdauer oder Geschwindigkeit',
    noneReady: 'Aktuell ist kein Charakter bereit fürs Training.'
  },

  wealth: {
    title: 'Vermögen',
    totalInRealm: 'Gesamt im Realm {{server}}',
    showBreakdown: 'Aufschlüsselung anzeigen',
    bank: 'Bank',
    byCharacter: 'Nach Charakter',
    noCharacters: 'Keine Charaktere auf diesem Konto/Server.',
    bankTitle: '{{label}} - gemeinsames kontoweites Bankguthaben',
    gold: 'Gold',
    alliancePoints: 'Allianzpunkte',
    telVarStones: 'Tel-Var-Steine',
    writVouchers: 'Auftragsgutscheine',
    goldShort: 'Gold',
    apShort: 'AP',
    telVarShort: 'Tel Var',
    writShort: 'Gutsch.'
  },

  dungeons: {
    couldntLoadTitle: 'Dungeon-Daten konnten nicht geladen werden',
    baseGame: 'Basisspiel',
    dlc: 'DLC',
    noCharacters: 'Keine Charaktere zum Anzeigen.'
  },

  allianceRank: {
    couldntLoadTitle: 'Charakterdaten konnten nicht geladen werden',
    heading: 'Allianzrang:',
    atMaxRank: '{{count}} / {{total}} im Höchstrang',
    rank: 'Rang',
    maxRankReached: 'Höchstrang erreicht',
    circleAriaLabel: 'Rang {{rank}}, {{outerPct}}% des Weges zu Rang 50, {{innerPct}}% des aktuellen Rangs',
    apOfTotal: '{{current}} / {{max}} AP',
    apToRank50: '{{remaining}} AP bis Rang 50',
    noDataYet: 'Noch keine Daten - melde dich mit aktivem Addon <bold>WhatShouldIDoDataCollector</bold> an.'
  },

  alchemy: {
    pageTitle: 'Alchemie',
    intro:
      'Wähle ein Lösungsmittel und 2 bis 3 Zutaten. Jede Eigenschaft, die von <bold>zwei oder mehr</bold> deiner Zutaten geteilt wird, wird zu einem aktiven Effekt. Lösungsmittel auf Wasserbasis ergeben <bold>Tränke</bold> (Effekte wirken auf dich); Öle ergeben <bold2>Gifte</bold2> (Effekte wirken auf den getroffenen Gegner).',
    findRecipeByEffect: 'Rezept nach Effekt finden',
    pickUpToEffects: 'Wähle bis zu {{count}} Effekte, die du im Ergebnis haben möchtest',
    combinationsFound_one: '{{count}} {{mode}}-Kombination — beste zuerst',
    combinationsFound_other: '{{count}} {{mode}}-Kombinationen — beste zuerst',
    potion: 'Trank',
    poison: 'Gift',
    noRecipeFor: 'Keine Kombination aus 2-3 Zutaten ergibt <bold>{{effects}}</bold> zusammen{{modeSuffix}}',
    inAPotion: ' in einem Trank',
    inAPoison: ' in einem Gift',
    loaded: 'Geladen',
    use: 'Verwenden',
    moreRecipes: '+{{count}} weitere — füge einen weiteren Effekt hinzu, um einzugrenzen.',
    potionOrPoison: 'Trank oder Gift',
    solvent: 'Lösungsmittel',
    anyNotChosen: 'Beliebig / nicht gewählt',
    requires: 'Erfordert <bold>{{requirement}}</bold>',
    removeReagent: '{{name}} entfernen',
    remove: 'Entfernen',
    emptySlot: 'Leerer Slot — füge unten eine Zutat hinzu',
    noSharedTrait: 'Keine gemeinsame Eigenschaft: <bold>{{names}}</bold> — trägt derzeit nichts zur Mischung bei.',
    reagents: 'Zutaten',
    filterByNameOrEffect: 'Nach Name oder Effekt filtern…',
    removeAReagentFirst: 'Entferne zuerst eine Zutat',
    noReagentMatches: 'Keine Zutat entspricht „{{query}}“.',
    resultingPotion: 'Ergebnistrank',
    resultingPoison: 'Ergebnisgift',
    addTwoReagents: 'Füge mindestens zwei Zutaten hinzu, um zu sehen, was du herstellst.',
    noSharedTraits:
      'Diese Zutaten teilen keine Eigenschaften — diese Kombination ergibt nichts. Versuche Zutaten mit überlappenden Effekten.',
    harmsYou: 'schadet dir',
    helpsTarget: 'hilft dem Ziel',
    from: 'aus {{names}}',
    negatives: ' Negative',
    wastedPositives: ' verschwendete Positive',
    potionNegativesWarning:
      'Dieser Trank hat negative Effekte, die dich treffen. Tausche eine Zutat aus, um sie zu entfernen, oder nimm Schlangenblut, um sie zu verkürzen.',
    poisonPositivesWarning:
      'Dieses Gift hat positive Effekte, die dein Ziel treffen. Tausche eine Zutat aus, um sie zu entfernen.',
    effectReference: 'Effektübersicht',
    clickEffectToSearch: 'Klicke auf einen Effekt, um nach Rezepten zu suchen, die ihn erzeugen.'
  },

  enchanting: {
    pageTitle: 'Verzauberung',
    intro:
      'Baue eine Glyphe von Grund auf, oder wähle die <bold>gewünschte Glyphe</bold> und die benötigten Runen leuchten auf. Die Wertigkeit bestimmt die Stufe der Glyphe und ob sie <bold2>additiv</bold2> oder <bold2>subtraktiv</bold2> ist; die Essenz bestimmt den Effekt; der Aspekt bestimmt die Qualität.',
    iWantToMake: 'Ich möchte herstellen…',
    anyGlyph: '— beliebige Glyphe (manuell erstellen) —',
    glyphsGroup: '{{itemType}}-Glyphen',
    clearTarget: 'Ziel zurücksetzen',
    targetHint:
      'Verwende die Essenzrune <bold>{{essence}}</bold> ({{translation}}) mit einer beliebigen <bold>{{potencyType}}</bold>-Wertigkeitsrune für die gewünschte Stufe (unten hervorgehoben). Füge eine Aspektrune für die Qualität hinzu.',
    weapon: 'Waffe',
    armor: 'Rüstung',
    jewelry: 'Schmuck',
    additive: 'Additiv',
    subtractive: 'Subtraktiv',
    needed: 'benötigt',
    potencyRune: 'Wertigkeitsrune',
    essenceRune: 'Essenzrune',
    aspectRune: 'Aspektrune',
    resultingGlyph: 'Ergebnisglyphe',
    pickHighlightedPotency: 'Wähle eine hervorgehobene Wertigkeitsrune, um die Glyphe fertigzustellen.',
    chooseTwoRunes: 'Wähle eine Wertigkeits- und eine Essenzrune, um die Glyphe zu sehen.',
    glyph: '{{itemType}}-Glyphe',
    level: 'Stufe',
    quality: 'Qualität',
    pickAnAspectRune: 'wähle eine Aspektrune',
    runes: 'Runen',
    essenceRuneReference: 'Essenzrunen-Übersicht',
    clickGlyphToTarget: 'Klicke auf eine Glyphe, um sie oben als Ziel zu setzen.',
    essence: 'Essenz',
    translation: 'Übersetzung',
    additivePotencyCol: '+ Additive Wertigkeit',
    subtractivePotencyCol: '+ Subtraktive Wertigkeit'
  },

  musicBoxes: {
    pageTitle: 'Spieluhren',
    introTracked:
      'Alle aktuell erhältlichen Einrichtungsgegenstände „<bold>Spieluhr</bold>“. Hake sie ab, sobald du sie besitzt. Der Fortschritt wird getrennt nach Konto und Server verfolgt und auf diesem Gerät gespeichert.',
    introUntracked:
      'Alle aktuell erhältlichen Einrichtungsgegenstände „<bold>Spieluhr</bold>“. Hake sie ab, sobald du sie besitzt. Der Fortschritt wird auf diesem Gerät gespeichert. Installiere USPF und SkillLines und melde dich mit einem Charakter an, um ihn getrennt nach Konto und Server zu verfolgen.',
    collected: '{{count}} / {{total}} gesammelt',
    filterPlaceholder: 'Nach Name, Quelle oder Beschreibung filtern…',
    all: 'Alle',
    missing: 'Fehlend',
    collectedFilter: 'Gesammelt',
    filterByCollected: 'Nach Sammelstatus filtern',
    gotIt: 'Besessen',
    name: 'Name',
    source: 'Quelle',
    cost: 'Kosten',
    noMatches: 'Keine Spieluhr entspricht „{{query}}“.'
  },

  achievements: {
    pageTitle: 'Erfolge',
    introTracked:
      'Die eigenen Medaillen von What Should I Do, die du durch deinen Fortschritt in der App verdienst. Getrennt nach Konto und Server verfolgt und auf diesem Gerät gespeichert.',
    introUntracked:
      'Die eigenen Medaillen von What Should I Do, die du durch deinen Fortschritt in der App verdienst. Auf diesem Gerät gespeichert.',
    noneVisible:
      'Jeder Erfolg ist an eine Funktion gebunden, die du in den Einstellungen deaktiviert hast. Aktiviere Spieluhren, Allianzrang oder Vermögensübersicht erneut, um hier deinen Fortschritt zu sehen.',
    currentMedal: 'Aktuelle Medaille: <bold>{{name}}</bold>',
    currentClass: 'Aktuelle Klasse: <bold>{{name}}</bold>',
    medalAltEarned: '{{tier}}-Medaille, verdient',
    medalAltLocked: '{{tier}}-Medaille, gesperrt',
    classAltEarned: '{{tier}}-Klasse, erreicht',
    classAltLocked: '{{tier}}-Klasse, gesperrt',
    musicBox: {
      title: 'Spieluhren-Sammlung',
      description: 'Sammle Spieluhren-Einrichtungsgegenstände, verfolgt auf der Seite Spieluhren.',
      progress: '{{count}} / {{total}} gesammelt',
      notStarted: 'Sammle deine erste Spieluhr, um die Medaille {{tier}} zu verdienen.',
      tiers: { tin: 'Besitzer', bronze: 'Sammler', silver: 'Kurator', gold: 'Maestro' }
    },
    allianceRank: {
      title: 'Veteranen des Allianzkriegs',
      description: 'Bringe Charaktere auf Allianzrang 50, verfolgt auf der Seite Allianzrang.',
      progress: '{{count}} auf Rang 50',
      notStarted: 'Bringe einen Charakter auf Allianzrang 50, um die Medaille {{tier}} zu verdienen.',
      tiers: { tin: 'Veteran', bronze: 'Champion', silver: 'Kriegsherr', gold: 'Großmarschall', platinum: 'Großherrscher' }
    },
    wealth: {
      title: 'Vermögen',
      description:
        'Steigere jede Währung - Gold, Allianzpunkte, Tel-Var-Steine und Auftragsgutscheine - die gemeinsame Bank plus alles, was jeder Charakter bei sich trägt.',
      amountsSummary: '{{gold}} Gold · {{ap}} AP · {{telVar}} Tel Var · {{writ}} Gutsch.',
      notStarted: 'Erreiche {{gold}} Gold, um die Klasse {{tier}} zu erhalten.',
      tiers: { peasant: 'Bauer', commoner: 'Bürger', merchant: 'Kaufmann', noble: 'Adliger', baron: 'Baron', magnate: 'Magnat' }
    }
  },

  settings: {
    pageTitle: 'Einstellungen',
    jumpToSection: 'Zu einem Einstellungsbereich springen',
    dataFolderNav: 'ESO-Datenordner',
    featuresNav: 'Funktionen',
    addonsNav: 'Addons',
    languageNav: 'Sprache',
    themeNav: 'Design',
    aboutNav: 'Über',
    dataFolderTitle: 'ESO-Datenordner',
    dataFolderBody:
      'Diese App liest deine ESO-SavedVariables aus deinem Dokumente-Ordner. Falls Windows/OneDrive Dokumente an einen anderen Ort umgeleitet hat, gib hier den richtigen Ordner an.',
    browse: 'Durchsuchen…',
    resetToDefault: 'Auf Standard zurücksetzen',
    noAccountsFound:
      'In diesem Ordner wurden keine Konten gefunden - stelle sicher, dass er einen Ordner „Elder Scrolls Online“ mit deinen Addon-Daten enthält.',
    foundAccounts_one: '{{count}} Konto gefunden,',
    foundAccounts_other: '{{count}} Konten gefunden,',
    foundCharacters_one: '{{count}} Charakter.',
    foundCharacters_other: '{{count}} Charaktere.',
    couldntReadFolder: 'Dieser Ordner konnte nicht gelesen werden: {{message}}',
    featuresTitle: 'Funktionen',
    featuresBody:
      'Deaktiviere alles, was du nicht nutzt, um die Seitenleiste aufzuräumen. Dies blendet nur die Seite aus - deine Daten bleiben unberührt, und du kannst sie jederzeit wieder aktivieren.',
    addonsTitle: 'Addons',
    addonsBody:
      'Diese App liest Daten, die ESO-Addons auf die Festplatte schreiben. Installiere sie über <esoui>ESOUI</esoui> (oder Minion), aktiviere sie im Spiel und melde dich dann einmal mit jedem Charakter an, während sie aktiv sind, damit sie Daten schreiben können.',
    required: 'Erforderlich',
    optional: 'Optional',
    checking: 'Wird geprüft…',
    detected: 'Erkannt ({{file}} gefunden)',
    notDetected: 'Nicht erkannt (keine {{file}} auf der Festplatte)',
    detectedShort: '✓ erkannt',
    notDetectedShort: 'nicht erkannt',
    languageTitle: 'Sprache',
    languageBody:
      'Ändert, in welcher Sprache der Text dieser App angezeigt wird. Die eigenen Spieldaten von ESO (Dungeon-Namen, Zutaten usw.) bleiben immer auf Englisch.',
    themeTitle: 'Design',
    themeSystemLabel: 'System',
    themeSystemDesc: 'Folgt der Hell/Dunkel-Einstellung deines Betriebssystems',
    themeDarkLabel: 'Dunkel',
    themeDarkDesc: 'Der Standard - Orange & Türkis',
    themeLightLabel: 'Hell',
    themeLightDesc: 'Gleiche Akzente, heller Hintergrund',
    themeEmberLabel: 'Glut',
    themeEmberDesc: 'Warm, kontrastreich und dunkel',
    themeFrostLabel: 'Frost',
    themeFrostDesc: 'Kühles blaues dunkles Design',
    aboutTitle: 'Über',
    version: 'Version',
    build: 'Build',
    checkForUpdates: 'Nach Updates suchen',
    restartAndInstall: 'Neu starten & installieren',
    updateChecking: 'Suche nach Updates…',
    updateAvailable: 'Update v{{version}} gefunden - wird heruntergeladen…',
    updateNotAvailable: 'Du bist auf dem neuesten Stand.',
    updateDownloading: 'Update wird heruntergeladen… {{percent}}%',
    updateDownloaded: 'Version {{version}} heruntergeladen - zum Installieren neu starten.',
    madeBy: 'Erstellt von Illyriat. Wenn dir diese App nützlich ist, kannst du <support>das Projekt unterstützen</support>.',
    features: {
      welcomeBanner: {
        label: 'Willkommensbanner',
        description: 'Das Banner „Willkommen, <account>!“ (und die Champion-Punkte) oben auf der Startseite.'
      },
      pledges: {
        label: 'Heutige Gelöbnisse',
        description: 'Die heutigen Unbeugsamen-Gelöbnis-Dungeons und Empfehlungen auf der Startseite.'
      },
      upcomingPledges: {
        label: 'Vorschau kommender Gelöbnisse',
        description: 'Die 5-Tage-Vorschau kommender Gelöbnisse unter Heutige Gelöbnisse.'
      },
      ridingTraining: {
        label: 'Reittraining',
        description: 'Das Reittraining-Board auf der Startseite.'
      },
      dungeonChecklist: {
        label: 'Dungeon-Checkliste',
        description: 'Die vollständige Dungeon-Abschluss-Checkliste pro Charakter.'
      },
      allianceRank: {
        label: 'Allianzrang',
        description: 'Die Seite Allianzrang und ihre Medaille „Veteranen des Allianzkriegs“ auf der Seite Erfolge.'
      },
      alchemy: {
        label: 'Alchemie',
        description: 'Die Alchemie-Rechner-Seite.'
      },
      enchanting: {
        label: 'Verzauberung',
        description: 'Die Verzauberungs-Rechner-Seite.'
      },
      musicBoxes: {
        label: 'Spieluhren',
        description: 'Die Spieluhren-Sammel-Checkliste und ihre Medaille „Spieluhren-Sammlung“ auf der Seite Erfolge.'
      },
      wealthTracker: {
        label: 'Vermögensübersicht',
        description:
          'Das Board Gold / Allianzpunkte / Tel-Var-Steine / Auftragsgutscheine auf der Startseite und seine Medaille „Vermögen“ auf der Seite Erfolge.'
      },
      achievements: {
        label: 'Erfolge',
        description:
          'Die eigene Erfolge-Seite der App: Spieluhren-Sammelmedaillen, Veteranen des Allianzkriegs (Charaktere auf Allianzrang 50) und Vermögensklassen (Gold / Allianzpunkte / Tel-Var-Steine / Auftragsgutscheine).'
      },
      languageSupport: {
        label: 'Sprache',
        description: 'Der Sprachwähler in den Einstellungen, um die Anzeigesprache der App zu ändern.'
      }
    },
    addonsList: {
      skillLines: {
        name: 'Skill Lines',
        description:
          'Kennzeichnet jeden Charakter mit dem Megaserver, auf dem er lebt (NA / EU). Die App nutzt dies, um deine Charaktere zu unterscheiden und die Konto- und Server-Auswahl funktionsfähig zu machen.'
      },
      uspf: {
        name: "Urich's Skill Point Finder (USPF)",
        description:
          'Zeichnet auf, welche Dungeon-Quests jeder Charakter abgeschlossen hat. Treibt die täglichen Empfehlungen für Unbeugsame Gelöbnisse und die Dungeon-Checkliste an. Ohne dieses Addon haben diese Seiten keine Daten. Dies ist die Kernfunktion von WhatShouldIDo.'
      },
      dailyCraftStatus: {
        name: 'Daily Craft Status',
        description:
          'Verfolgt die Abklingzeit des Reittrainings sowie die Kapazitäts-, Ausdauer- und Geschwindigkeitsstufen jedes Charakters. Treibt das Reittraining-Board auf der Startseite an.'
      },
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description:
          'Ein eigens entwickeltes Begleit-Addon, das den Allianzkriegsrang und den Allianzpunkte-Fortschritt jedes Charakters aufzeichnet (treibt die Seite Allianzrang an), die Champion-Punkte jedes Kontos pro Realm (angezeigt auf dem Banner der Startseite) sowie Gold / Allianzpunkte / Tel-Var-Steine / Auftragsgutscheine - sowohl den von jedem Charakter getragenen Betrag als auch das gemeinsame kontoweite Bankguthaben pro Realm (treibt die Vermögensübersicht auf der Startseite an).'
      }
    }
  },

  updateBanner: {
    readyToInstall: 'Version {{version}} ist bereit zur Installation.',
    restartAndInstall: 'Neu starten & installieren',
    dismiss: 'Verwerfen'
  }
}
