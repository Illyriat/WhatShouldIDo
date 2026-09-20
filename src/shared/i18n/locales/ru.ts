import type { en } from './en'

/**
 * Russian translation - drafted by an AI assistant, needs review by a native Russian
 * speaker before shipping with the `languageSupport` flag on. Typed as `typeof en` so
 * a missing key fails the build instead of silently falling back to English.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) intentionally stays in English - see en.ts's header comment.
 *
 * Russian plurals have four CLDR categories (one/few/many/other), not just English's
 * one/other, so the four pluralized clusters below (showUpcoming, combinationsFound,
 * foundAccounts, foundCharacters) also define a `_few` form on top of en.ts's
 * `_one`/`_other`. Those extra keys aren't part of `typeof en`'s shape, so this file is
 * built as a plain object first (`ruTranslation`) and only *assigned* to the
 * `typeof en`-typed export below - TypeScript's excess-property check only runs against
 * an object literal typed directly at its declaration, not against a variable being
 * assigned to a wider-typed binding - so the extra `_few` keys survive at runtime for
 * i18next's plural resolver without weakening the "every en.ts key must exist" check
 * every other locale file still gets.
 */
const ruTranslation = {
  common: {
    account: 'Аккаунт',
    server: 'Сервер',
    refresh: 'Обновить',
    refreshTitle: 'Повторно считать SavedVariables с диска (ESO записывает их только при выходе из игры или /reloadui)',
    loadingCharacters: 'Загрузка ваших персонажей ESO…',
    loadingAccounts: 'Загрузка ваших аккаунтов ESO…',
    noCharactersFoundTitle: 'Персонажи не найдены',
    noCharactersFoundBody:
      'Установите и включите аддон <bold>WhatShouldIDoDataCollector</bold> в ESO, затем зайдите хотя бы одним персонажем, чтобы он мог записывать ваш прогресс.',
    clear: 'Очистить',
    character: 'Персонаж',
    recommended: 'Рекомендуется'
  },

  sidebar: {
    collapse: 'Свернуть боковую панель',
    expand: 'Развернуть боковую панель',
    home: 'Главная',
    dungeonChecklist: 'Список подземелий',
    allianceRank: 'Ранг Альянса',
    crafting: 'Крафт',
    alchemy: 'Алхимия',
    enchanting: 'Зачарование',
    collections: 'Коллекции',
    musicBoxes: 'Шкатулки',
    achievements: 'Достижения',
    settings: 'Настройки',
    supportProject: 'Поддержать проект'
  },

  home: {
    greeting: 'Добро пожаловать,',
    couldntLoadTitle: 'Не удалось загрузить данные обетов',
    couldntLoadHint: 'Убедитесь, что аддон WhatShouldIDoDataCollector установлен и включён в ESO, и что вы хотя бы раз входили в игру с активным аддоном.'
  },

  pledges: {
    title: 'Сегодняшние обеты',
    dlc: 'DLC',
    base: 'Базовая игра',
    unknownDungeon: 'Неизвестно',
    noDataMapped: 'Для этого подземелья ещё нет данных о завершении',
    noDataBadge: 'нет данных',
    noData: 'Нет данных.',
    everyoneDone: 'Все персонажи уже это выполнили.',
    showUpcoming_one: 'Показать предстоящие обеты ({{count}} день)',
    showUpcoming_few: 'Показать предстоящие обеты ({{count}} дня)',
    showUpcoming_many: 'Показать предстоящие обеты ({{count}} дней)',
    showUpcoming_other: 'Показать предстоящие обеты ({{count}} дней)',
    tomorrow: 'Завтра'
  },

  riding: {
    title: 'Тренировка верховой езды',
    stableMaster: 'Хозяин конюшни',
    daily: 'ЕЖЕДНЕВНО',
    trainingOptions: 'Вместимость, Выносливость или Скорость',
    noneReady: 'Сейчас ни один персонаж не готов к тренировке.'
  },

  wealth: {
    title: 'Богатство',
    totalInRealm: 'Всего в реалме {{server}}',
    showBreakdown: 'Показать детали',
    bank: 'Банк',
    byCharacter: 'По персонажам',
    noCharacters: 'На этом аккаунте/сервере нет персонажей.',
    bankTitle: '{{label}} - общий банк аккаунта',
    gold: 'Золото',
    alliancePoints: 'Очки Альянса',
    telVarStones: 'Камни Тель-Вар',
    writVouchers: 'Ваучеры за поручения',
    goldShort: 'Золото',
    apShort: 'ОА',
    telVarShort: 'Тель-Вар',
    writShort: 'Ваучеры'
  },

  dungeons: {
    couldntLoadTitle: 'Не удалось загрузить данные подземелий',
    baseGame: 'Базовая игра',
    dlc: 'DLC',
    noCharacters: 'Нет персонажей для отображения.'
  },

  allianceRank: {
    couldntLoadTitle: 'Не удалось загрузить данные персонажа',
    heading: 'Ранг Альянса:',
    atMaxRank: '{{count}} / {{total}} на максимальном ранге',
    rank: 'Ранг',
    maxRankReached: 'Достигнут максимальный ранг',
    circleAriaLabel: 'Ранг {{rank}}, {{outerPct}}% пути до 50 ранга, {{innerPct}}% текущего ранга',
    apOfTotal: '{{current}} / {{max}} ОА',
    apToRank50: '{{remaining}} ОА до 50 ранга',
    noDataYet: 'Данных пока нет - войдите в игру с активным аддоном <bold>WhatShouldIDoDataCollector</bold>.'
  },

  alchemy: {
    pageTitle: 'Алхимия',
    intro:
      'Выберите растворитель и 2-3 реагента. Любое свойство, общее для <bold>двух или более</bold> ваших реагентов, становится активным эффектом. Растворители на водной основе создают <bold>зелья</bold> (эффекты действуют на вас); масла создают <bold2>яды</bold2> (эффекты действуют на поражённого врага).',
    findRecipeByEffect: 'Найти рецепт по эффекту',
    pickUpToEffects: 'Выберите до {{count}} эффектов, которые хотите получить',
    combinationsFound_one: '{{count}} {{mode}} комбинация — лучшая сначала',
    combinationsFound_few: '{{count}} {{mode}} комбинации — лучшая сначала',
    combinationsFound_many: '{{count}} {{mode}} комбинаций — лучшая сначала',
    combinationsFound_other: '{{count}} {{mode}} комбинаций — лучшая сначала',
    potion: 'Зелье',
    poison: 'Яд',
    noRecipeFor: 'Ни одна комбинация из 2-3 реагентов не даёт вместе <bold>{{effects}}</bold>{{modeSuffix}}',
    inAPotion: ' в зелье',
    inAPoison: ' в яде',
    loaded: 'Загружено',
    use: 'Использовать',
    moreRecipes: '+{{count}} ещё — добавьте ещё один эффект, чтобы сузить список.',
    potionOrPoison: 'Зелье или яд',
    solvent: 'Растворитель',
    anyNotChosen: 'Любой / не выбрано',
    requires: 'Требуется <bold>{{requirement}}</bold>',
    removeReagent: 'Удалить {{name}}',
    remove: 'Удалить',
    emptySlot: 'Пустой слот — добавьте реагент ниже',
    noSharedTrait: 'Нет общего свойства: <bold>{{names}}</bold> — сейчас ничего не добавляет в смесь.',
    reagents: 'Реагенты',
    filterByNameOrEffect: 'Фильтр по названию или эффекту…',
    removeAReagentFirst: 'Сначала удалите реагент',
    noReagentMatches: 'Ни один реагент не соответствует «{{query}}».',
    resultingPotion: 'Итоговое зелье',
    resultingPoison: 'Итоговый яд',
    addTwoReagents: 'Добавьте минимум два реагента, чтобы увидеть результат.',
    noSharedTraits: 'У этих реагентов нет общих свойств — эта комбинация ничего не даёт. Попробуйте реагенты с пересекающимися эффектами.',
    harmsYou: 'вредит вам',
    helpsTarget: 'помогает цели',
    from: 'из {{names}}',
    negatives: ' негативных',
    wastedPositives: ' потраченных впустую позитивных',
    potionNegativesWarning:
      'Это зелье содержит негативные эффекты, которые подействуют на вас. Замените реагент, чтобы убрать их, или возьмите Змеиную кровь, чтобы сократить их длительность.',
    poisonPositivesWarning: 'Этот яд содержит позитивные эффекты, которые подействуют на цель. Замените реагент, чтобы убрать их.',
    effectReference: 'Справочник эффектов',
    clickEffectToSearch: 'Нажмите на эффект, чтобы найти рецепты, которые его создают.'
  },

  enchanting: {
    pageTitle: 'Зачарование',
    intro:
      'Соберите глиф с нуля или выберите <bold>нужный глиф</bold>, и необходимые руны подсветятся. Потенция определяет уровень глифа и то, является ли он <bold2>аддитивным</bold2> или <bold2>вычитающим</bold2>; Эссенция определяет эффект; Аспект определяет качество.',
    iWantToMake: 'Я хочу создать…',
    anyGlyph: '— любой глиф (собрать вручную) —',
    glyphsGroup: 'Глифы: {{itemType}}',
    clearTarget: 'Очистить цель',
    targetHint:
      'Используйте руну эссенции <bold>{{essence}}</bold> ({{translation}}) с любой руной потенции типа <bold>{{potencyType}}</bold> для нужного уровня (подсвечено ниже). Добавьте руну аспекта для качества.',
    weapon: 'Оружие',
    armor: 'Броня',
    jewelry: 'Украшения',
    additive: 'Аддитивный',
    subtractive: 'Вычитающий',
    needed: 'требуется',
    potencyRune: 'Руна потенции',
    essenceRune: 'Руна эссенции',
    aspectRune: 'Руна аспекта',
    resultingGlyph: 'Итоговый глиф',
    pickHighlightedPotency: 'Выберите подсвеченную руну потенции, чтобы завершить глиф.',
    chooseTwoRunes: 'Выберите руну потенции и эссенции, чтобы увидеть глиф.',
    glyph: 'Глиф: {{itemType}}',
    level: 'Уровень',
    quality: 'Качество',
    pickAnAspectRune: 'выберите руну аспекта',
    runes: 'Руны',
    essenceRuneReference: 'Справочник рун эссенции',
    clickGlyphToTarget: 'Нажмите на глиф, чтобы выбрать его целью выше.',
    essence: 'Эссенция',
    translation: 'Перевод',
    additivePotencyCol: '+ Аддитивная потенция',
    subtractivePotencyCol: '+ Вычитающая потенция'
  },

  musicBoxes: {
    pageTitle: 'Шкатулки',
    introTracked:
      'Все доступные сейчас предметы обстановки <bold>Шкатулка</bold>. Отмечайте, когда получите. Прогресс отслеживается отдельно для каждого аккаунта и сервера и сохраняется на этом устройстве.',
    introUntracked:
      'Все доступные сейчас предметы обстановки <bold>Шкатулка</bold>. Отмечайте, когда получите. Прогресс сохраняется на этом устройстве. Установите WhatShouldIDoDataCollector и войдите персонажем, чтобы отслеживать его отдельно для каждого аккаунта и сервера.',
    collected: 'Собрано {{count}} / {{total}}',
    filterPlaceholder: 'Фильтр по названию, источнику или описанию…',
    all: 'Все',
    missing: 'Отсутствующие',
    collectedFilter: 'Собранные',
    filterByCollected: 'Фильтр по статусу сбора',
    gotIt: 'Есть',
    name: 'Название',
    source: 'Источник',
    cost: 'Стоимость',
    noMatches: 'Ни одна шкатулка не соответствует «{{query}}».'
  },

  achievements: {
    pageTitle: 'Достижения',
    introTracked:
      'Собственные медали What Should I Do, получаемые по мере вашего прогресса в приложении. Отслеживаются отдельно для каждого аккаунта и сервера и сохраняются на этом устройстве.',
    introUntracked: 'Собственные медали What Should I Do, получаемые по мере вашего прогресса в приложении. Сохраняются на этом устройстве.',
    noneVisible:
      'Каждое достижение привязано к функции, отключённой в Настройках. Включите снова Шкатулки, Ранг Альянса или Учёт Богатства, чтобы увидеть здесь прогресс.',
    currentMedal: 'Текущая медаль: <bold>{{name}}</bold>',
    currentClass: 'Текущий класс: <bold>{{name}}</bold>',
    medalAltEarned: 'Медаль {{tier}}, получена',
    medalAltLocked: 'Медаль {{tier}}, заблокирована',
    classAltEarned: 'Класс {{tier}}, достигнут',
    classAltLocked: 'Класс {{tier}}, заблокирован',
    musicBox: {
      title: 'Коллекция шкатулок',
      description: 'Собирайте предметы обстановки «Шкатулка», отслеживается на странице Шкатулки.',
      progress: '{{count}} / {{total}} собрано',
      notStarted: 'Соберите свою первую шкатулку, чтобы получить медаль {{tier}}.',
      tiers: { tin: 'Владелец', bronze: 'Коллекционер', silver: 'Хранитель', gold: 'Маэстро' }
    },
    allianceRank: {
      title: 'Ветераны Войны Альянсов',
      description: 'Доведите персонажей до 50 ранга Альянса, отслеживается на странице Ранг Альянса.',
      progress: '{{count}} на 50 ранге',
      notStarted: 'Доведите одного персонажа до 50 ранга Альянса, чтобы получить медаль {{tier}}.',
      tiers: { tin: 'Ветеран', bronze: 'Чемпион', silver: 'Военачальник', gold: 'Великий Маршал', platinum: 'Великий Правитель' }
    },
    wealth: {
      title: 'Богатство',
      description:
        'Поднимите каждую валюту - Золото, Очки Альянса, Камни Тель-Вар и Ваучеры за поручения - общий банк плюс то, что несёт каждый персонаж.',
      amountsSummary: '{{gold}} золота · {{ap}} ОА · {{telVar}} Тель-Вар · {{writ}} ваучеров',
      notStarted: 'Достигните {{gold}} золота, чтобы получить класс {{tier}}.',
      tiers: { peasant: 'Крестьянин', commoner: 'Горожанин', merchant: 'Купец', noble: 'Дворянин', baron: 'Барон', magnate: 'Магнат' }
    }
  },

  settings: {
    pageTitle: 'Настройки',
    jumpToSection: 'Перейти к разделу настроек',
    dataFolderNav: 'Папка данных ESO',
    featuresNav: 'Функции',
    addonsNav: 'Аддоны',
    languageNav: 'Язык',
    themeNav: 'Тема',
    aboutNav: 'О программе',
    dataFolderTitle: 'Папка данных ESO',
    dataFolderBody:
      'Это приложение считывает ваши SavedVariables из папки Документы. Если Windows/OneDrive перенаправил папку Документы в другое место, укажите здесь правильную папку.',
    browse: 'Обзор…',
    resetToDefault: 'Сбросить по умолчанию',
    noAccountsFound: 'В этой папке не найдено аккаунтов - убедитесь, что она содержит папку «Elder Scrolls Online» с данными ваших аддонов.',
    foundAccounts_one: 'Найден {{count}} аккаунт,',
    foundAccounts_few: 'Найдено {{count}} аккаунта,',
    foundAccounts_many: 'Найдено {{count}} аккаунтов,',
    foundAccounts_other: 'Найдено {{count}} аккаунтов,',
    foundCharacters_one: '{{count}} персонаж.',
    foundCharacters_few: '{{count}} персонажа.',
    foundCharacters_many: '{{count}} персонажей.',
    foundCharacters_other: '{{count}} персонажей.',
    couldntReadFolder: 'Не удалось прочитать эту папку: {{message}}',
    featuresTitle: 'Функции',
    featuresBody:
      'Отключите всё, чем вы не пользуетесь, чтобы упростить боковую панель. Это только скрывает страницу - ваши данные не затрагиваются, и вы можете включить её снова в любой момент.',
    addonsTitle: 'Аддоны',
    addonsBody:
      'Это приложение считывает данные, которые аддоны ESO записывают на диск. Установите их с <esoui>ESOUI</esoui> (или Minion), включите их в игре, затем войдите каждым персонажем хотя бы раз с активными аддонами, чтобы они могли записать данные.',
    required: 'Обязательный',
    optional: 'Необязательный',
    checking: 'Проверка…',
    detected: 'Обнаружено (найден {{file}})',
    notDetected: 'Не обнаружено (нет {{file}} на диске)',
    detectedShort: '✓ обнаружено',
    notDetectedShort: 'не обнаружено',
    languageTitle: 'Язык',
    languageBody:
      'Изменяет язык отображения текста этого приложения. Собственные игровые данные ESO (названия подземелий, реагенты и т.д.) всегда остаются на английском.',
    themeTitle: 'Тема',
    themeSystemLabel: 'Системная',
    themeSystemDesc: 'Следует настройке светлой/тёмной темы вашей ОС',
    themeDarkLabel: 'Тёмная',
    themeDarkDesc: 'По умолчанию - оранжевый и бирюзовый',
    themeLightLabel: 'Светлая',
    themeLightDesc: 'Те же акценты, светлый фон',
    themeEmberLabel: 'Пламя',
    themeEmberDesc: 'Тёплая, контрастная тёмная тема',
    themeFrostLabel: 'Изморозь',
    themeFrostDesc: 'Холодная синяя тёмная тема',
    aboutTitle: 'О программе',
    version: 'Версия',
    build: 'Сборка',
    checkForUpdates: 'Проверить обновления',
    restartAndInstall: 'Перезапустить и установить',
    updateChecking: 'Проверка обновлений…',
    updateAvailable: 'Найдено обновление v{{version}} - загрузка…',
    updateNotAvailable: 'У вас последняя версия.',
    updateDownloading: 'Загрузка обновления… {{percent}}%',
    updateDownloaded: 'Версия {{version}} загружена - перезапустите для установки.',
    madeBy: 'Разработано Illyriat. Если это приложение полезно для вас, вы можете <support>поддержать проект</support>.',
    features: {
      welcomeBanner: {
        label: 'Приветственный баннер',
        description: 'Баннер «Добро пожаловать, <account>!» (и Очки Чемпиона) вверху страницы Главная.'
      },
      pledges: {
        label: 'Сегодняшние обеты',
        description: 'Сегодняшние подземелья Неустрашимого Обета и рекомендации на странице Главная.'
      },
      upcomingPledges: {
        label: 'Предпросмотр предстоящих обетов',
        description: 'Переключатель 5-дневного предпросмотра предстоящих обетов под Сегодняшними обетами.'
      },
      ridingTraining: {
        label: 'Тренировка верховой езды',
        description: 'Панель тренировки верховой езды на странице Главная.'
      },
      dungeonChecklist: {
        label: 'Список подземелий',
        description: 'Полный список завершения подземелий для каждого персонажа.'
      },
      allianceRank: {
        label: 'Ранг Альянса',
        description: 'Страница Ранг Альянса и медаль «Ветераны Войны Альянсов» на странице Достижения.'
      },
      alchemy: {
        label: 'Алхимия',
        description: 'Страница калькулятора Алхимии.'
      },
      enchanting: {
        label: 'Зачарование',
        description: 'Страница калькулятора Зачарования.'
      },
      musicBoxes: {
        label: 'Шкатулки',
        description: 'Список коллекции Шкатулок и медаль «Коллекция шкатулок» на странице Достижения.'
      },
      wealthTracker: {
        label: 'Учёт Богатства',
        description:
          'Панель Золота / Очков Альянса / Камней Тель-Вар / Ваучеров за поручения на странице Главная и медаль «Богатство» на странице Достижения.'
      },
      achievements: {
        label: 'Достижения',
        description:
          'Собственная страница достижений приложения: медали коллекции Шкатулок, Ветераны Войны Альянсов (персонажи на 50 ранге Альянса) и классы Богатства (Золото / Очки Альянса / Камни Тель-Вар / Ваучеры за поручения).'
      },
      languageSupport: {
        label: 'Язык',
        description: 'Выбор языка в Настройках для смены языка текста этого приложения.'
      }
    },
    addonsList: {
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description:
          'Специальный аддон-компаньон, который записывает имя и сервер каждого персонажа, какие задания подземелий выполнил каждый персонаж (обеспечивает ежедневные рекомендации Неустрашимых Обетов и Список подземелий - это основная функция WhatShouldIDo), время перезарядки тренировки верховой езды и уровни Вместимости / Выносливости / Скорости каждого персонажа (обеспечивает панель Тренировки верховой езды на странице Главная), ранг Войны Альянсов и прогресс Очков Альянса каждого персонажа (обеспечивает страницу Ранг Альянса), Очки Чемпиона каждого аккаунта по реалмам (отображается на баннере страницы Главная), а также Золото / Очки Альянса / Камни Тель-Вар / Ваучеры за поручения - как сумму, которую несёт каждый персонаж, так и общий банк аккаунта по реалмам (обеспечивает Учёт Богатства на странице Главная). Это единственный аддон, который нужен WhatShouldIDo - без него у приложения вообще нет данных.'
      }
    }
  },

  updateBanner: {
    readyToInstall: 'Версия {{version}} готова к установке.',
    restartAndInstall: 'Перезапустить и установить',
    dismiss: 'Отклонить'
  }
}

export const ru: typeof en = ruTranslation
