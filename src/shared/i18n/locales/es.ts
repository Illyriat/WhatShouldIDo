import type { en } from './en'

/**
 * Spanish translation - drafted by an AI assistant, needs review by a native Spanish
 * speaker before shipping with the `languageSupport` flag on. Typed as `typeof en` so
 * a missing or extra key fails the build instead of silently falling back to English.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) intentionally stays in English - see en.ts's header comment.
 */
export const es: typeof en = {
  common: {
    account: 'Cuenta',
    server: 'Servidor',
    refresh: 'Actualizar',
    refreshTitle: 'Volver a leer las SavedVariables desde el disco (ESO solo las escribe al cerrar sesión o con /reloadui)',
    loadingCharacters: 'Cargando tus personajes de ESO…',
    loadingAccounts: 'Cargando tus cuentas de ESO…',
    noCharactersFoundTitle: 'No se encontraron personajes',
    noCharactersFoundBody:
      'Instala y activa el addon <bold>WhatShouldIDoDataCollector</bold> en ESO, luego inicia sesión con al menos un personaje para que pueda registrar tu progreso.',
    clear: 'Borrar',
    character: 'Personaje',
    recommended: 'Recomendado'
  },

  sidebar: {
    collapse: 'Contraer barra lateral',
    expand: 'Expandir barra lateral',
    home: 'Inicio',
    dungeonChecklist: 'Lista de mazmorras',
    allianceRank: 'Rango de Alianza',
    crafting: 'Artesanía',
    alchemy: 'Alquimia',
    enchanting: 'Encantamiento',
    collections: 'Colecciones',
    musicBoxes: 'Cajas de música',
    achievements: 'Logros',
    settings: 'Ajustes',
    supportProject: 'Apoyar el proyecto'
  },

  home: {
    greeting: 'Bienvenido,',
    couldntLoadTitle: 'No se pudieron cargar los datos de juramentos',
    couldntLoadHint:
      'Asegúrate de que el addon WhatShouldIDoDataCollector esté instalado y activado en ESO, y de haber iniciado sesión en el juego al menos una vez con él activo.'
  },

  pledges: {
    title: 'Juramentos de hoy',
    dlc: 'DLC',
    base: 'Base',
    unknownDungeon: 'Desconocida',
    noDataMapped: 'Aún no hay datos de finalización asociados a esta mazmorra',
    noDataBadge: 'sin datos',
    noData: 'Sin datos.',
    everyoneDone: 'Todos los personajes ya la han completado.',
    showUpcoming_one: 'Mostrar juramentos próximos ({{count}} día)',
    showUpcoming_other: 'Mostrar juramentos próximos ({{count}} días)',
    tomorrow: 'Mañana'
  },

  riding: {
    title: 'Entrenamiento de montura',
    stableMaster: 'Maestro de establos',
    daily: 'DIARIO',
    trainingOptions: 'Capacidad, Aguante o Velocidad',
    noneReady: 'Ningún personaje está listo para entrenar en este momento.'
  },

  wealth: {
    title: 'Riqueza',
    totalInRealm: 'Total en el reino {{server}}',
    showBreakdown: 'Mostrar desglose',
    bank: 'Banco',
    byCharacter: 'Por personaje',
    noCharacters: 'No hay personajes en esta cuenta/servidor.',
    bankTitle: '{{label}} - total compartido del banco de la cuenta',
    gold: 'Oro',
    alliancePoints: 'Puntos de Alianza',
    telVarStones: 'Piedras de Tel Var',
    writVouchers: 'Vales de encargo',
    goldShort: 'Oro',
    apShort: 'PA',
    telVarShort: 'Tel Var',
    writShort: 'Vales'
  },

  dungeons: {
    couldntLoadTitle: 'No se pudieron cargar los datos de mazmorras',
    baseGame: 'Juego base',
    dlc: 'DLC',
    noCharacters: 'No hay personajes que mostrar.'
  },

  allianceRank: {
    couldntLoadTitle: 'No se pudieron cargar los datos del personaje',
    heading: 'Rango de Alianza:',
    atMaxRank: '{{count}} / {{total}} al rango máximo',
    rank: 'Rango',
    maxRankReached: 'Rango máximo alcanzado',
    circleAriaLabel: 'Rango {{rank}}, {{outerPct}}% del camino al rango 50, {{innerPct}}% del rango actual',
    apOfTotal: '{{current}} / {{max}} PA',
    apToRank50: '{{remaining}} PA para el rango 50',
    noDataYet: 'Aún no hay datos - inicia sesión con el addon <bold>WhatShouldIDoDataCollector</bold> activo.'
  },

  alchemy: {
    pageTitle: 'Alquimia',
    intro:
      'Elige un disolvente y de 2 a 3 ingredientes. Cualquier rasgo compartido por <bold>dos o más</bold> de tus ingredientes se convierte en un efecto activo. Los disolventes a base de agua crean <bold>pociones</bold> (los efectos te afectan a ti); los aceites crean <bold2>venenos</bold2> (los efectos afectan al enemigo golpeado).',
    findRecipeByEffect: 'Buscar una receta por efecto',
    pickUpToEffects: 'Elige hasta {{count}} efectos que quieras en el resultado',
    combinationsFound_one: '{{count}} combinación de {{mode}} — la mejor primero',
    combinationsFound_other: '{{count}} combinaciones de {{mode}} — la mejor primero',
    potion: 'Poción',
    poison: 'Veneno',
    noRecipeFor: 'Ninguna combinación de 2-3 ingredientes produce <bold>{{effects}}</bold> juntos{{modeSuffix}}',
    inAPotion: ' en una poción',
    inAPoison: ' en un veneno',
    loaded: 'Cargada',
    use: 'Usar',
    moreRecipes: '+{{count}} más — añade otro efecto para acotar.',
    potionOrPoison: 'Poción o veneno',
    solvent: 'Disolvente',
    anyNotChosen: 'Cualquiera / sin elegir',
    requires: 'Requiere <bold>{{requirement}}</bold>',
    removeReagent: 'Quitar {{name}}',
    remove: 'Quitar',
    emptySlot: 'Ranura vacía — añade un ingrediente abajo',
    noSharedTrait: 'Sin rasgo compartido: <bold>{{names}}</bold> — actualmente no aporta nada a la mezcla.',
    reagents: 'Ingredientes',
    filterByNameOrEffect: 'Filtrar por nombre o efecto…',
    removeAReagentFirst: 'Quita primero un ingrediente',
    noReagentMatches: 'Ningún ingrediente coincide con «{{query}}».',
    resultingPotion: 'Poción resultante',
    resultingPoison: 'Veneno resultante',
    addTwoReagents: 'Añade al menos dos ingredientes para ver qué vas a crear.',
    noSharedTraits:
      'Estos ingredientes no comparten rasgos — esta combinación no produce nada. Prueba ingredientes con efectos superpuestos.',
    harmsYou: 'te perjudica',
    helpsTarget: 'ayuda al objetivo',
    from: 'de {{names}}',
    negatives: ' negativos',
    wastedPositives: ' positivos desperdiciados',
    potionNegativesWarning:
      'Esta poción tiene efectos negativos que te afectarán. Cambia un ingrediente para eliminarlos, o toma Sangre de Serpiente para acortarlos.',
    poisonPositivesWarning:
      'Este veneno tiene efectos positivos que afectarán a tu objetivo. Cambia un ingrediente para eliminarlos.',
    effectReference: 'Referencia de efectos',
    clickEffectToSearch: 'Haz clic en un efecto para buscar recetas que lo produzcan.'
  },

  enchanting: {
    pageTitle: 'Encantamiento',
    intro:
      'Crea un glifo desde cero, o elige el <bold>glifo que quieres</bold> y las runas necesarias se iluminarán. La Potencia determina el nivel del glifo y si es <bold2>aditivo</bold2> o <bold2>sustractivo</bold2>; la Esencia determina el efecto; el Aspecto determina la calidad.',
    iWantToMake: 'Quiero crear…',
    anyGlyph: '— cualquier glifo (crear manualmente) —',
    glyphsGroup: 'Glifos de {{itemType}}',
    clearTarget: 'Borrar objetivo',
    targetHint:
      'Usa la runa de esencia <bold>{{essence}}</bold> ({{translation}}) con cualquier runa de potencia <bold>{{potencyType}}</bold> para el nivel que quieras (resaltado abajo). Añade una runa de Aspecto para la calidad.',
    weapon: 'Arma',
    armor: 'Armadura',
    jewelry: 'Joyería',
    additive: 'Aditiva',
    subtractive: 'Sustractiva',
    needed: 'necesaria',
    potencyRune: 'Runa de potencia',
    essenceRune: 'Runa de esencia',
    aspectRune: 'Runa de aspecto',
    resultingGlyph: 'Glifo resultante',
    pickHighlightedPotency: 'Elige una runa de Potencia resaltada para terminar el glifo.',
    chooseTwoRunes: 'Elige una runa de Potencia y una de Esencia para ver el glifo.',
    glyph: 'Glifo de {{itemType}}',
    level: 'Nivel',
    quality: 'Calidad',
    pickAnAspectRune: 'elige una runa de Aspecto',
    runes: 'Runas',
    essenceRuneReference: 'Referencia de runas de esencia',
    clickGlyphToTarget: 'Haz clic en un glifo para marcarlo como objetivo arriba.',
    essence: 'Esencia',
    translation: 'Traducción',
    additivePotencyCol: '+ Potencia aditiva',
    subtractivePotencyCol: '+ Potencia sustractiva'
  },

  musicBoxes: {
    pageTitle: 'Cajas de música',
    introTracked:
      'Todos los muebles «<bold>Caja de música</bold>» actualmente disponibles. Marca cada una al obtenerla. El progreso se sigue por separado según cuenta y servidor, y se guarda en este dispositivo.',
    introUntracked:
      'Todos los muebles «<bold>Caja de música</bold>» actualmente disponibles. Marca cada una al obtenerla. El progreso se guarda en este dispositivo. Instala WhatShouldIDoDataCollector e inicia sesión con un personaje para seguirlo por separado según cuenta y servidor.',
    collected: '{{count}} / {{total}} obtenidas',
    filterPlaceholder: 'Filtrar por nombre, fuente o descripción…',
    all: 'Todas',
    missing: 'Faltantes',
    collectedFilter: 'Obtenidas',
    filterByCollected: 'Filtrar por estado de obtención',
    gotIt: 'Obtenida',
    name: 'Nombre',
    source: 'Fuente',
    cost: 'Coste',
    noMatches: 'Ninguna caja de música coincide con «{{query}}».'
  },

  achievements: {
    pageTitle: 'Logros',
    introTracked:
      'Las medallas propias de What Should I Do, obtenidas al progresar en la aplicación. Seguidas por separado según cuenta y servidor, y guardadas en este dispositivo.',
    introUntracked:
      'Las medallas propias de What Should I Do, obtenidas al progresar en la aplicación. Guardadas en este dispositivo.',
    noneVisible:
      'Cada logro está vinculado a una función que has desactivado en Ajustes. Reactiva Cajas de música, Rango de Alianza o Seguimiento de riqueza para ver tu progreso aquí.',
    currentMedal: 'Medalla actual: <bold>{{name}}</bold>',
    currentClass: 'Clase actual: <bold>{{name}}</bold>',
    medalAltEarned: 'Medalla {{tier}}, obtenida',
    medalAltLocked: 'Medalla {{tier}}, bloqueada',
    classAltEarned: 'Clase {{tier}}, obtenida',
    classAltLocked: 'Clase {{tier}}, bloqueada',
    musicBox: {
      title: 'Colección de cajas de música',
      description: 'Colecciona muebles de Caja de música, seguido en la página Cajas de música.',
      progress: '{{count}} / {{total}} obtenidas',
      notStarted: 'Obtén tu primera caja de música para ganar la medalla {{tier}}.',
      tiers: { tin: 'Propietario', bronze: 'Coleccionista', silver: 'Conservador', gold: 'Maestro' }
    },
    allianceRank: {
      title: 'Veteranos de la Guerra de Alianza',
      description: 'Lleva personajes al rango de Alianza 50, seguido en la página Rango de Alianza.',
      progress: '{{count}} en el rango 50',
      notStarted: 'Lleva un personaje al rango de Alianza 50 para ganar la medalla {{tier}}.',
      tiers: { tin: 'Veterano', bronze: 'Campeón', silver: 'Señor de la guerra', gold: 'Gran Mariscal', platinum: 'Gran Señor' }
    },
    wealth: {
      title: 'Riqueza',
      description:
        'Aumenta cada divisa - Oro, Puntos de Alianza, Piedras de Tel Var y Vales de encargo - el banco compartido más lo que lleva cada personaje.',
      amountsSummary: '{{gold}} Oro · {{ap}} PA · {{telVar}} Tel Var · {{writ}} Vales',
      notStarted: 'Alcanza {{gold}} de Oro para obtener la clase {{tier}}.',
      tiers: { peasant: 'Campesino', commoner: 'Plebeyo', merchant: 'Mercader', noble: 'Noble', baron: 'Barón', magnate: 'Magnate' }
    }
  },

  settings: {
    pageTitle: 'Ajustes',
    jumpToSection: 'Ir a una sección de ajustes',
    dataFolderNav: 'Carpeta de datos de ESO',
    featuresNav: 'Funciones',
    addonsNav: 'Addons',
    languageNav: 'Idioma',
    themeNav: 'Tema',
    aboutNav: 'Acerca de',
    dataFolderTitle: 'Carpeta de datos de ESO',
    dataFolderBody:
      'Esta aplicación lee tus SavedVariables de ESO desde tu carpeta Documentos. Si Windows/OneDrive ha redirigido Documentos a otro lugar, indica aquí la carpeta correcta.',
    browse: 'Examinar…',
    resetToDefault: 'Restablecer valor predeterminado',
    noAccountsFound:
      'No se encontraron cuentas en esta carpeta - comprueba que contenga una carpeta "Elder Scrolls Online" con los datos de tus addons.',
    foundAccounts_one: '{{count}} cuenta encontrada,',
    foundAccounts_other: '{{count}} cuentas encontradas,',
    foundCharacters_one: '{{count}} personaje.',
    foundCharacters_other: '{{count}} personajes.',
    couldntReadFolder: 'No se pudo leer esta carpeta: {{message}}',
    featuresTitle: 'Funciones',
    featuresBody:
      'Desactiva lo que no uses para simplificar la barra lateral. Esto solo oculta la página - tus datos no se ven afectados, y puedes reactivarla en cualquier momento.',
    addonsTitle: 'Addons',
    addonsBody:
      'Esta aplicación lee datos que los addons de ESO escriben en el disco. El Data Collector viene incluido con esta aplicación: instálalo más abajo. Cualquier otro addon es una descarga aparte desde <esoui>ESOUI</esoui> (o Minion). Actívalos en el juego y luego inicia sesión con cada personaje una vez con ellos activos para que tengan datos que escribir.',
    required: 'Obligatorio',
    optional: 'Opcional',
    checking: 'Comprobando…',
    notInstalledShort: 'no instalado',
    installedShort: '✓ v{{version}} instalado',
    updateAvailableShort: 'v{{installed}} instalado · v{{bundled}} disponible',
    outdatedShort: 'v{{version}} · demasiado antiguo',
    addonInstall: 'Instalar',
    addonUpdate: 'Actualizar',
    addonInstalling: 'Instalando…',
    addonInstallFailed: 'No se pudo instalar el addon: {{message}}',
    addonNoGameFolder:
      'Todavía no se ha encontrado ninguna carpeta de ESO. Revisa la carpeta de datos de arriba o abre el juego una vez para que cree sus carpetas.',
    addonBundleMissing: 'Esta versión de la aplicación no incluye el addon.',
    addonRestartNote:
      'Reinicia ESO (o escribe /reloadui en el juego) para que cargue el addon y luego inicia sesión con cada personaje una vez.',
    addonNoDataNote:
      'Instalado, pero todavía no ha registrado nada. Actívalo en el menú de addons del juego e inicia sesión con cada personaje una vez.',
    libMissingNote:
      'El Data Collector no se cargará sin esta biblioteca. Es una descarga aparte: consíguela en ESOUI con el enlace de arriba.',
    libOutdatedNote:
      'Esta versión es más antigua de lo que necesita el Data Collector. Actualízala desde ESOUI con el enlace de arriba.',
    languageTitle: 'Idioma',
    languageBody:
      'Cambia el idioma en el que se muestra el texto de esta aplicación. Los datos propios del juego ESO (nombres de mazmorras, ingredientes, etc.) siempre permanecen en inglés.',
    themeTitle: 'Tema',
    themeSystemLabel: 'Sistema',
    themeSystemDesc: 'Sigue el ajuste claro/oscuro de tu sistema',
    themeDarkLabel: 'Oscuro',
    themeDarkDesc: 'El predeterminado - naranja y verde azulado',
    themeLightLabel: 'Claro',
    themeLightDesc: 'Mismos acentos, fondo claro',
    themeEmberLabel: 'Brasa',
    themeEmberDesc: 'Oscuro cálido y de alto contraste',
    themeFrostLabel: 'Escarcha',
    themeFrostDesc: 'Tema oscuro de tonos azules',
    aboutTitle: 'Acerca de',
    version: 'Versión',
    build: 'Compilación',
    checkForUpdates: 'Buscar actualizaciones',
    restartAndInstall: 'Reiniciar e instalar',
    updateChecking: 'Buscando actualizaciones…',
    updateAvailable: 'Actualización v{{version}} encontrada - descargando…',
    updateNotAvailable: 'Estás al día.',
    updateDownloading: 'Descargando actualización… {{percent}}%',
    updateDownloaded: 'Versión {{version}} descargada - reinicia para instalar.',
    madeBy: 'Creado por Illyriat. Si esta aplicación te resulta útil, puedes <support>apoyar el proyecto</support>.',
    features: {
      welcomeBanner: {
        label: 'Banner de bienvenida',
        description: 'El banner «¡Bienvenido, <account>!» (y los Puntos de Campeón) en la parte superior de la página de Inicio.'
      },
      pledges: {
        label: 'Juramentos de hoy',
        description: 'Las mazmorras de Juramentos de los Intrépidos de hoy y sus recomendaciones en la página de Inicio.'
      },
      upcomingPledges: {
        label: 'Vista previa de juramentos próximos',
        description: 'La vista previa de 5 días de juramentos próximos bajo Juramentos de hoy.'
      },
      ridingTraining: {
        label: 'Entrenamiento de montura',
        description: 'El panel de entrenamiento de montura en la página de Inicio.'
      },
      dungeonChecklist: {
        label: 'Lista de mazmorras',
        description: 'La lista completa de finalización de mazmorras por personaje.'
      },
      allianceRank: {
        label: 'Rango de Alianza',
        description: 'La página Rango de Alianza y su medalla Veteranos de la Guerra de Alianza en la página Logros.'
      },
      alchemy: {
        label: 'Alquimia',
        description: 'La página de la calculadora de alquimia.'
      },
      enchanting: {
        label: 'Encantamiento',
        description: 'La página de la calculadora de encantamiento.'
      },
      musicBoxes: {
        label: 'Cajas de música',
        description: 'La lista de colección de cajas de música y su medalla Colección de cajas de música en la página Logros.'
      },
      wealthTracker: {
        label: 'Seguimiento de riqueza',
        description:
          'El panel de Oro / Puntos de Alianza / Piedras de Tel Var / Vales de encargo en la página de Inicio, y su medalla Riqueza en la página Logros.'
      },
      achievements: {
        label: 'Logros',
        description:
          'La página de logros propia de la aplicación: medallas de colección de cajas de música, Veteranos de la Guerra de Alianza (personajes en el rango de Alianza 50) y clases de Riqueza (Oro / Puntos de Alianza / Piedras de Tel Var / Vales de encargo).'
      },
      languageSupport: {
        label: 'Idioma',
        description: 'El selector de idioma en Ajustes para cambiar el idioma de visualización de la aplicación.'
      }
    },
    addonsList: {
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description:
          'Un addon complementario diseñado a medida que registra el nombre y el servidor de cada personaje, qué misiones de mazmorra ha completado cada personaje (alimenta las recomendaciones diarias de Juramentos de los Intrépidos y la Lista de mazmorras - esta es la función principal de WhatShouldIDo), el tiempo de reutilización del entrenamiento de montura y los niveles de Capacidad / Aguante / Velocidad de cada personaje (alimenta el panel de entrenamiento de montura en la página de Inicio), el rango de Guerra de Alianza y el progreso de Puntos de Alianza de cada personaje (alimenta la página Rango de Alianza), los Puntos de Campeón por reino de cada cuenta (mostrados en el banner de la página de Inicio), y el Oro / Puntos de Alianza / Piedras de Tel Var / Vales de encargo - tanto la cantidad que lleva cada personaje como el total compartido del banco de la cuenta por reino (alimenta el Seguimiento de riqueza en la página de Inicio). Este es el único addon que WhatShouldIDo necesita - sin él, la aplicación no tiene ningún dato.'
      },
      libUndauntedPledges: {
        name: 'LibUndauntedPledges',
        description:
          'Una pequeña biblioteca de terceros muy utilizada (no forma parte de esta aplicación) que el Data Collector usa para calcular la rotación de Juramentos de los Intrépidos de hoy y de los próximos días. ESO no cargará el Data Collector a menos que esta biblioteca también esté instalada.'
      }
    }
  },

  updateBanner: {
    readyToInstall: 'La versión {{version}} está lista para instalarse.',
    restartAndInstall: 'Reiniciar e instalar',
    dismiss: 'Descartar'
  }
}
