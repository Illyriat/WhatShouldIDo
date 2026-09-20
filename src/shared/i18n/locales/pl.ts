import type { en } from './en'

/**
 * Polish translation - drafted by an AI assistant, needs review by a native Polish
 * speaker before shipping with the `languageSupport` flag on. Typed as `typeof en` so
 * a missing key fails the build instead of silently falling back to English.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) intentionally stays in English - see en.ts's header comment.
 *
 * Polish plurals have four CLDR categories (one/few/many/other), not just English's
 * one/other, so the four pluralized clusters below (showUpcoming, combinationsFound,
 * foundAccounts, foundCharacters) also define a `_few` form on top of en.ts's
 * `_one`/`_other`. Those extra keys aren't part of `typeof en`'s shape, so this file is
 * built as a plain object first (`plTranslation`) and only *assigned* to the
 * `typeof en`-typed export below - TypeScript's excess-property check only runs against
 * an object literal typed directly at its declaration, not against a variable being
 * assigned to a wider-typed binding - so the extra `_few` keys survive at runtime for
 * i18next's plural resolver without weakening the "every en.ts key must exist" check
 * every other locale file still gets.
 */
const plTranslation = {
  common: {
    account: 'Konto',
    server: 'Serwer',
    refresh: 'Odśwież',
    refreshTitle: 'Wczytaj dane SavedVariables ponownie z dysku (ESO zapisuje je tylko przy wylogowaniu lub /reloadui)',
    loadingCharacters: 'Wczytywanie Twoich postaci ESO…',
    loadingAccounts: 'Wczytywanie Twoich kont ESO…',
    noCharactersFoundTitle: 'Nie znaleziono postaci',
    noCharactersFoundBody:
      'Zainstaluj i włącz dodatek <bold>USPF</bold> w ESO, a następnie zaloguj się na co najmniej jedną postać, aby dodatek mógł zapisywać Twoje postępy.',
    clear: 'Wyczyść',
    character: 'Postać',
    recommended: 'Polecane'
  },

  sidebar: {
    collapse: 'Zwiń pasek boczny',
    expand: 'Rozwiń pasek boczny',
    home: 'Start',
    dungeonChecklist: 'Lista lochów',
    allianceRank: 'Ranga Sojuszu',
    crafting: 'Rzemiosło',
    alchemy: 'Alchemia',
    enchanting: 'Zaklinanie',
    collections: 'Kolekcje',
    musicBoxes: 'Pozytywki',
    achievements: 'Osiągnięcia',
    settings: 'Ustawienia',
    supportProject: 'Wesprzyj projekt'
  },

  home: {
    greeting: 'Witaj,',
    couldntLoadTitle: 'Nie udało się wczytać danych zobowiązań',
    couldntLoadHint:
      'Upewnij się, że dodatek USPF jest zainstalowany i włączony w ESO oraz że zalogowałeś się do gry przynajmniej raz z aktywnym dodatkiem.'
  },

  pledges: {
    title: 'Dzisiejsze zobowiązania',
    cachedBadge: 'wyświetlane dane z pamięci podręcznej',
    cachedTitle: 'Ostatnio pobrano {{fetchedAt}}',
    dlc: 'DLC',
    base: 'Podstawowa gra',
    unknownDungeon: 'Nieznany',
    noDataMapped: 'Brak przypisanych danych ukończenia dla tego lochu',
    noDataBadge: 'brak danych',
    noData: 'Brak danych.',
    everyoneDone: 'Każda postać już to ukończyła.',
    showUpcoming_one: 'Pokaż nadchodzące zobowiązania ({{count}} dzień)',
    showUpcoming_few: 'Pokaż nadchodzące zobowiązania ({{count}} dni)',
    showUpcoming_many: 'Pokaż nadchodzące zobowiązania ({{count}} dni)',
    showUpcoming_other: 'Pokaż nadchodzące zobowiązania ({{count}} dni)',
    tomorrow: 'Jutro'
  },

  riding: {
    title: 'Trening jeździecki',
    stableMaster: 'Stajenny',
    daily: 'CODZIENNIE',
    trainingOptions: 'Pojemność, Wytrzymałość lub Szybkość',
    noneReady: 'Żadna postać nie jest teraz gotowa do treningu.'
  },

  wealth: {
    title: 'Majątek',
    totalInRealm: 'Suma w Realmie {{server}}',
    showBreakdown: 'Pokaż szczegóły',
    bank: 'Bank',
    byCharacter: 'Według postaci',
    noCharacters: 'Brak postaci na tym koncie/serwerze.',
    bankTitle: '{{label}} - wspólne saldo banku dla całego konta',
    gold: 'Złoto',
    alliancePoints: 'Punkty Sojuszu',
    telVarStones: 'Kamienie Tel Var',
    writVouchers: 'Bony za nakazy',
    goldShort: 'Złoto',
    apShort: 'PS',
    telVarShort: 'Tel Var',
    writShort: 'Bony'
  },

  dungeons: {
    couldntLoadTitle: 'Nie udało się wczytać danych lochów',
    baseGame: 'Podstawowa gra',
    dlc: 'DLC',
    noCharacters: 'Brak postaci do wyświetlenia.'
  },

  allianceRank: {
    couldntLoadTitle: 'Nie udało się wczytać danych postaci',
    heading: 'Ranga Sojuszu:',
    atMaxRank: '{{count}} / {{total}} na maksymalnej randze',
    rank: 'Ranga',
    maxRankReached: 'Osiągnięto maksymalną rangę',
    circleAriaLabel: 'Ranga {{rank}}, {{outerPct}}% drogi do rangi 50, {{innerPct}}% obecnej rangi',
    apOfTotal: '{{current}} / {{max}} PS',
    apToRank50: '{{remaining}} PS do Rangi 50',
    noDataYet: 'Brak danych - zaloguj się z aktywnym dodatkiem <bold>WhatShouldIDoDataCollector</bold>.'
  },

  alchemy: {
    pageTitle: 'Alchemia',
    intro:
      'Wybierz rozpuszczalnik i 2-3 składniki. Każda cecha wspólna dla <bold>dwóch lub więcej</bold> Twoich składników staje się aktywnym efektem. Rozpuszczalniki wodne tworzą <bold>mikstury</bold> (efekty działają na Ciebie); oleje tworzą <bold2>trucizny</bold2> (efekty działają na trafionego wroga).',
    findRecipeByEffect: 'Znajdź recepturę po efekcie',
    pickUpToEffects: 'Wybierz do {{count}} efektów, które chcesz uzyskać',
    combinationsFound_one: '{{count}} {{mode}} kombinacja — najlepsza pierwsza',
    combinationsFound_few: '{{count}} {{mode}} kombinacje — najlepsza pierwsza',
    combinationsFound_many: '{{count}} {{mode}} kombinacji — najlepsza pierwsza',
    combinationsFound_other: '{{count}} {{mode}} kombinacji — najlepsza pierwsza',
    potion: 'Mikstura',
    poison: 'Trucizna',
    noRecipeFor: 'Żadna kombinacja 2-3 składników nie daje razem <bold>{{effects}}</bold>{{modeSuffix}}',
    inAPotion: ' w miksturze',
    inAPoison: ' w truciźnie',
    loaded: 'Wczytano',
    use: 'Użyj',
    moreRecipes: '+{{count}} więcej — dodaj kolejny efekt, aby zawęzić wyniki.',
    potionOrPoison: 'Mikstura lub trucizna',
    solvent: 'Rozpuszczalnik',
    anyNotChosen: 'Dowolny / niewybrany',
    requires: 'Wymaga <bold>{{requirement}}</bold>',
    removeReagent: 'Usuń {{name}}',
    remove: 'Usuń',
    emptySlot: 'Puste miejsce — dodaj składnik poniżej',
    noSharedTrait: 'Brak wspólnej cechy: <bold>{{names}}</bold> — obecnie nic nie wnosi do mieszanki.',
    reagents: 'Składniki',
    filterByNameOrEffect: 'Filtruj według nazwy lub efektu…',
    removeAReagentFirst: 'Najpierw usuń składnik',
    noReagentMatches: 'Żaden składnik nie pasuje do „{{query}}”.',
    resultingPotion: 'Powstała mikstura',
    resultingPoison: 'Powstała trucizna',
    addTwoReagents: 'Dodaj co najmniej dwa składniki, aby zobaczyć, co powstanie.',
    noSharedTraits:
      'Te składniki nie mają wspólnych cech — ta kombinacja nic nie daje. Spróbuj składników o pokrywających się efektach.',
    harmsYou: 'szkodzi Tobie',
    helpsTarget: 'pomaga celowi',
    from: 'z {{names}}',
    negatives: ' negatywnych',
    wastedPositives: ' zmarnowanych pozytywnych',
    potionNegativesWarning:
      'Ta mikstura ma negatywne efekty, które dotkną Ciebie. Zamień składnik, aby je usunąć, lub weź Wężową Krew, aby je skrócić.',
    poisonPositivesWarning: 'Ta trucizna ma pozytywne efekty, które dotkną celu. Zamień składnik, aby je usunąć.',
    effectReference: 'Spis efektów',
    clickEffectToSearch: 'Kliknij efekt, aby wyszukać receptury, które go tworzą.'
  },

  enchanting: {
    pageTitle: 'Zaklinanie',
    intro:
      'Zbuduj glif od podstaw lub wybierz <bold>glif, który chcesz uzyskać</bold>, a potrzebne runy się podświetlą. Moc określa poziom glifu oraz to, czy jest <bold2>addytywny</bold2>, czy <bold2>subtraktywny</bold2>; Esencja określa efekt; Aspekt określa jakość.',
    iWantToMake: 'Chcę stworzyć…',
    anyGlyph: '— dowolny glif (buduj ręcznie) —',
    glyphsGroup: 'Glify: {{itemType}}',
    clearTarget: 'Wyczyść cel',
    targetHint:
      'Użyj runy esencji <bold>{{essence}}</bold> ({{translation}}) z dowolną runą mocy typu <bold>{{potencyType}}</bold> dla wybranego poziomu (podświetlone poniżej). Dodaj runę aspektu dla jakości.',
    weapon: 'Broń',
    armor: 'Zbroja',
    jewelry: 'Biżuteria',
    additive: 'Addytywny',
    subtractive: 'Subtraktywny',
    needed: 'potrzebne',
    potencyRune: 'Runa mocy',
    essenceRune: 'Runa esencji',
    aspectRune: 'Runa aspektu',
    resultingGlyph: 'Powstały glif',
    pickHighlightedPotency: 'Wybierz podświetloną runę mocy, aby ukończyć glif.',
    chooseTwoRunes: 'Wybierz runę mocy i esencji, aby zobaczyć glif.',
    glyph: 'Glif: {{itemType}}',
    level: 'Poziom',
    quality: 'Jakość',
    pickAnAspectRune: 'wybierz runę aspektu',
    runes: 'Runy',
    essenceRuneReference: 'Spis run esencji',
    clickGlyphToTarget: 'Kliknij glif, aby ustawić go powyżej jako cel.',
    essence: 'Esencja',
    translation: 'Tłumaczenie',
    additivePotencyCol: '+ Moc addytywna',
    subtractivePotencyCol: '+ Moc subtraktywna'
  },

  musicBoxes: {
    pageTitle: 'Pozytywki',
    introTracked:
      'Wszystkie obecnie dostępne meble typu <bold>Pozytywka</bold>. Odhacz, gdy już je posiadasz. Postęp jest śledzony osobno dla każdego konta i serwera oraz zapisywany na tym urządzeniu.',
    introUntracked:
      'Wszystkie obecnie dostępne meble typu <bold>Pozytywka</bold>. Odhacz, gdy już je posiadasz. Postęp jest zapisywany na tym urządzeniu. Zainstaluj USPF i SkillLines oraz zaloguj się na postać, aby śledzić go osobno dla każdego konta i serwera.',
    collected: 'Zebrano {{count}} / {{total}}',
    filterPlaceholder: 'Filtruj według nazwy, źródła lub opisu…',
    all: 'Wszystkie',
    missing: 'Brakujące',
    collectedFilter: 'Zebrane',
    filterByCollected: 'Filtruj według statusu zebrania',
    gotIt: 'Posiadam',
    name: 'Nazwa',
    source: 'Źródło',
    cost: 'Koszt',
    noMatches: 'Żadna pozytywka nie pasuje do „{{query}}”.'
  },

  achievements: {
    pageTitle: 'Osiągnięcia',
    introTracked:
      'Własne medale What Should I Do, zdobywane wraz z postępami w aplikacji. Śledzone osobno dla każdego konta i serwera oraz zapisywane na tym urządzeniu.',
    introUntracked: 'Własne medale What Should I Do, zdobywane wraz z postępami w aplikacji. Zapisywane na tym urządzeniu.',
    noneVisible:
      'Każde osiągnięcie jest powiązane z funkcją wyłączoną w Ustawieniach. Włącz ponownie Pozytywki, Rangę Sojuszu lub Śledzenie Majątku, aby zobaczyć tu postępy.',
    currentMedal: 'Obecny medal: <bold>{{name}}</bold>',
    currentClass: 'Obecna klasa: <bold>{{name}}</bold>',
    medalAltEarned: 'Medal {{tier}}, zdobyty',
    medalAltLocked: 'Medal {{tier}}, zablokowany',
    classAltEarned: 'Klasa {{tier}}, osiągnięta',
    classAltLocked: 'Klasa {{tier}}, zablokowana',
    musicBox: {
      title: 'Kolekcja Pozytywek',
      description: 'Zbieraj meble typu Pozytywka, śledzone na stronie Pozytywki.',
      progress: '{{count}} / {{total}} zebrano',
      notStarted: 'Zbierz swoją pierwszą Pozytywkę, aby zdobyć medal {{tier}}.',
      tiers: { tin: 'Właściciel', bronze: 'Kolekcjoner', silver: 'Kustosz', gold: 'Maestro' }
    },
    allianceRank: {
      title: 'Weterani Wojny Sojuszy',
      description: 'Doprowadź postacie do Rangi Sojuszu 50, śledzone na stronie Ranga Sojuszu.',
      progress: '{{count}} na Randze 50',
      notStarted: 'Doprowadź jedną postać do Rangi Sojuszu 50, aby zdobyć medal {{tier}}.',
      tiers: { tin: 'Weteran', bronze: 'Czempion', silver: 'Wódz Wojenny', gold: 'Wielki Marszałek', platinum: 'Wielki Zwierzchnik' }
    },
    wealth: {
      title: 'Majątek',
      description:
        'Podnieś każdą walutę - Złoto, Punkty Sojuszu, Kamienie Tel Var i Bony za nakazy - wspólny bank plus to, co niesie każda postać.',
      amountsSummary: '{{gold}} Złota · {{ap}} PS · {{telVar}} Tel Var · {{writ}} Bonów',
      notStarted: 'Osiągnij {{gold}} Złota, aby zdobyć klasę {{tier}}.',
      tiers: { peasant: 'Chłop', commoner: 'Mieszczanin', merchant: 'Kupiec', noble: 'Szlachcic', baron: 'Baron', magnate: 'Magnat' }
    }
  },

  settings: {
    pageTitle: 'Ustawienia',
    jumpToSection: 'Przejdź do sekcji ustawień',
    dataFolderNav: 'Folder danych ESO',
    featuresNav: 'Funkcje',
    addonsNav: 'Dodatki',
    languageNav: 'Język',
    themeNav: 'Motyw',
    aboutNav: 'O aplikacji',
    dataFolderTitle: 'Folder danych ESO',
    dataFolderBody:
      'Ta aplikacja odczytuje Twoje dane SavedVariables z folderu Dokumenty. Jeśli Windows/OneDrive przekierował Dokumenty gdzie indziej, wskaż tutaj właściwy folder.',
    browse: 'Przeglądaj…',
    resetToDefault: 'Przywróć domyślny',
    noAccountsFound:
      'Nie znaleziono kont w tym folderze - upewnij się, że zawiera folder „Elder Scrolls Online” z danymi Twoich dodatków.',
    foundAccounts_one: 'Znaleziono {{count}} konto,',
    foundAccounts_few: 'Znaleziono {{count}} konta,',
    foundAccounts_many: 'Znaleziono {{count}} kont,',
    foundAccounts_other: 'Znaleziono {{count}} kont,',
    foundCharacters_one: '{{count}} postać.',
    foundCharacters_few: '{{count}} postacie.',
    foundCharacters_many: '{{count}} postaci.',
    foundCharacters_other: '{{count}} postaci.',
    couldntReadFolder: 'Nie udało się odczytać tego folderu: {{message}}',
    featuresTitle: 'Funkcje',
    featuresBody:
      'Wyłącz wszystko, czego nie używasz, aby uporządkować pasek boczny. To tylko ukrywa stronę - Twoje dane pozostają nietknięte i możesz włączyć ją ponownie w dowolnym momencie.',
    addonsTitle: 'Dodatki',
    addonsBody:
      'Ta aplikacja odczytuje dane zapisywane na dysku przez dodatki ESO. Zainstaluj je z <esoui>ESOUI</esoui> (lub Minion), włącz je w grze, a następnie zaloguj się na każdą postać przynajmniej raz z aktywnymi dodatkami, aby mogły zapisać dane.',
    required: 'Wymagane',
    optional: 'Opcjonalne',
    checking: 'Sprawdzanie…',
    detected: 'Wykryto (znaleziono {{file}})',
    notDetected: 'Nie wykryto (brak {{file}} na dysku)',
    detectedShort: '✓ wykryto',
    notDetectedShort: 'nie wykryto',
    languageTitle: 'Język',
    languageBody:
      'Zmienia język, w którym wyświetlany jest tekst tej aplikacji. Własne dane gry ESO (nazwy lochów, składniki itd.) zawsze pozostają w języku angielskim.',
    themeTitle: 'Motyw',
    themeSystemLabel: 'Systemowy',
    themeSystemDesc: 'Podąża za ustawieniem jasny/ciemny Twojego systemu',
    themeDarkLabel: 'Ciemny',
    themeDarkDesc: 'Domyślny - pomarańcz i turkus',
    themeLightLabel: 'Jasny',
    themeLightDesc: 'Te same akcenty, jasne tło',
    themeEmberLabel: 'Żar',
    themeEmberDesc: 'Ciepły, kontrastowy ciemny motyw',
    themeFrostLabel: 'Szron',
    themeFrostDesc: 'Chłodny, niebieski ciemny motyw',
    aboutTitle: 'O aplikacji',
    version: 'Wersja',
    build: 'Kompilacja',
    checkForUpdates: 'Sprawdź aktualizacje',
    restartAndInstall: 'Uruchom ponownie i zainstaluj',
    updateChecking: 'Sprawdzanie aktualizacji…',
    updateAvailable: 'Znaleziono aktualizację v{{version}} - pobieranie…',
    updateNotAvailable: 'Masz najnowszą wersję.',
    updateDownloading: 'Pobieranie aktualizacji… {{percent}}%',
    updateDownloaded: 'Pobrano wersję {{version}} - uruchom ponownie, aby zainstalować.',
    madeBy: 'Stworzone przez Illyriat. Jeśli ta aplikacja jest dla Ciebie przydatna, możesz <support>wesprzeć projekt</support>.',
    features: {
      welcomeBanner: {
        label: 'Baner powitalny',
        description: 'Baner „Witaj, <account>!” (oraz Punkty Championa) na górze strony Start.'
      },
      pledges: {
        label: 'Dzisiejsze zobowiązania',
        description: 'Dzisiejsze lochy Nieustraszonego Zobowiązania i rekomendacje na stronie Start.'
      },
      upcomingPledges: {
        label: 'Podgląd nadchodzących zobowiązań',
        description: 'Przełącznik 5-dniowego podglądu nadchodzących zobowiązań pod Dzisiejszymi zobowiązaniami.'
      },
      ridingTraining: {
        label: 'Trening jeździecki',
        description: 'Panel treningu jeździeckiego na stronie Start.'
      },
      dungeonChecklist: {
        label: 'Lista lochów',
        description: 'Pełna lista ukończenia lochów dla każdej postaci.'
      },
      allianceRank: {
        label: 'Ranga Sojuszu',
        description: 'Strona Ranga Sojuszu oraz medal „Weterani Wojny Sojuszy” na stronie Osiągnięcia.'
      },
      alchemy: {
        label: 'Alchemia',
        description: 'Strona kalkulatora Alchemii.'
      },
      enchanting: {
        label: 'Zaklinanie',
        description: 'Strona kalkulatora Zaklinania.'
      },
      musicBoxes: {
        label: 'Pozytywki',
        description: 'Lista kolekcji Pozytywek oraz medal „Kolekcja Pozytywek” na stronie Osiągnięcia.'
      },
      wealthTracker: {
        label: 'Śledzenie Majątku',
        description:
          'Panel Złota / Punktów Sojuszu / Kamieni Tel Var / Bonów za nakazy na stronie Start oraz medal „Majątek” na stronie Osiągnięcia.'
      },
      achievements: {
        label: 'Osiągnięcia',
        description:
          'Własna strona osiągnięć aplikacji: medale kolekcji Pozytywek, Weterani Wojny Sojuszy (postacie na Randze Sojuszu 50) oraz klasy Majątku (Złoto / Punkty Sojuszu / Kamienie Tel Var / Bony za nakazy).'
      },
      languageSupport: {
        label: 'Język',
        description: 'Wybór języka w Ustawieniach do zmiany języka tekstu tej aplikacji.'
      }
    },
    addonsList: {
      skillLines: {
        name: 'Skill Lines',
        description:
          'Oznacza każdą postać megaserwerem, na którym się znajduje (NA / EU). Aplikacja wykorzystuje to do rozróżniania Twoich postaci oraz do działania przełączników Konta i Serwera.'
      },
      uspf: {
        name: "Urich's Skill Point Finder (USPF)",
        description:
          'Zapisuje, które zadania lochów ukończyła każda postać. Napędza codzienne rekomendacje Nieustraszonych Zobowiązań oraz Listę lochów. Bez niego te strony nie mają danych. To podstawowa funkcja WhatShouldIDo.'
      },
      dailyCraftStatus: {
        name: 'Daily Craft Status',
        description:
          'Śledzi czas odnowienia treningu jeździeckiego oraz poziomy Pojemności / Wytrzymałości / Szybkości każdej postaci. Napędza panel Treningu jeździeckiego na stronie Start.'
      },
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description:
          'Dedykowany dodatek towarzyszący, który zapisuje rangę Wojny Sojuszy i postęp Punktów Sojuszu każdej postaci (napędza stronę Ranga Sojuszu), Punkty Championa każdego konta na realm (widoczne na banerze strony Start) oraz Złoto / Punkty Sojuszu / Kamienie Tel Var / Bony za nakazy - zarówno kwotę niesioną przez każdą postać, jak i wspólne saldo banku dla całego konta na realm (napędza Śledzenie Majątku na stronie Start).'
      }
    }
  },

  updateBanner: {
    readyToInstall: 'Wersja {{version}} jest gotowa do instalacji.',
    restartAndInstall: 'Uruchom ponownie i zainstaluj',
    dismiss: 'Odrzuć'
  }
}

export const pl: typeof en = plTranslation
