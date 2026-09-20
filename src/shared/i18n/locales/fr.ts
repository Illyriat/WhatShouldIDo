import type { en } from './en'

/**
 * French translation - drafted by an AI assistant, needs review by a native French
 * speaker before shipping with the `languageSupport` flag on. Typed as `typeof en` so
 * a missing or extra key fails the build instead of silently falling back to English.
 *
 * Game-data content (dungeon names, alchemy reagents/effects, enchanting runes, music
 * box names/descriptions) intentionally stays in English - see en.ts's header comment.
 */
export const fr: typeof en = {
  common: {
    account: 'Compte',
    server: 'Serveur',
    refresh: 'Actualiser',
    refreshTitle: "Relire les SavedVariables depuis le disque (ESO ne les écrit qu'à la déconnexion ou avec /reloadui)",
    loadingCharacters: 'Chargement de vos personnages ESO…',
    loadingAccounts: 'Chargement de vos comptes ESO…',
    noCharactersFoundTitle: 'Aucun personnage trouvé',
    noCharactersFoundBody:
      "Installez et activez l'addon <bold>WhatShouldIDoDataCollector</bold> dans ESO, puis connectez-vous avec au moins un personnage pour qu'il puisse enregistrer votre progression.",
    clear: 'Effacer',
    character: 'Personnage',
    recommended: 'Recommandé'
  },

  sidebar: {
    collapse: 'Réduire la barre latérale',
    expand: 'Développer la barre latérale',
    home: 'Accueil',
    dungeonChecklist: 'Liste des donjons',
    allianceRank: "Rang d'Alliance",
    crafting: 'Artisanat',
    alchemy: 'Alchimie',
    enchanting: 'Enchantement',
    collections: 'Collections',
    musicBoxes: 'Boîtes à musique',
    achievements: 'Succès',
    settings: 'Paramètres',
    supportProject: 'Soutenir le projet'
  },

  home: {
    greeting: 'Bienvenue,',
    couldntLoadTitle: 'Impossible de charger les données des vœux',
    couldntLoadHint:
      "Vérifiez que l'addon WhatShouldIDoDataCollector est installé et activé dans ESO, et que vous vous êtes connecté au jeu au moins une fois avec lui actif."
  },

  pledges: {
    title: 'Vœux du jour',
    cachedBadge: 'données en cache',
    cachedTitle: 'Dernière récupération : {{fetchedAt}}',
    dlc: 'DLC',
    base: 'Base',
    unknownDungeon: 'Inconnu',
    noDataMapped: 'Aucune donnée de complétion associée à ce donjon pour le moment',
    noDataBadge: 'aucune donnée',
    noData: 'Aucune donnée.',
    everyoneDone: "Tous les personnages l'ont déjà fait.",
    showUpcoming_one: 'Afficher les vœux à venir ({{count}} jour)',
    showUpcoming_other: 'Afficher les vœux à venir ({{count}} jours)',
    tomorrow: 'Demain'
  },

  riding: {
    title: 'Entraînement de monture',
    stableMaster: 'Maître des écuries',
    daily: 'QUOTIDIEN',
    trainingOptions: 'Capacité, Endurance ou Vitesse',
    noneReady: "Aucun personnage n'est prêt à s'entraîner pour le moment."
  },

  wealth: {
    title: 'Richesse',
    totalInRealm: 'Total sur le royaume {{server}}',
    showBreakdown: 'Afficher le détail',
    bank: 'Banque',
    byCharacter: 'Par personnage',
    noCharacters: 'Aucun personnage sur ce compte/serveur.',
    bankTitle: '{{label}} - total de la banque commune du compte',
    gold: 'Or',
    alliancePoints: "Points d'Alliance",
    telVarStones: 'Pierres de Tel Var',
    writVouchers: 'Bons de commande',
    goldShort: 'Or',
    apShort: 'PA',
    telVarShort: 'Tel Var',
    writShort: 'Bons'
  },

  dungeons: {
    couldntLoadTitle: 'Impossible de charger les données des donjons',
    baseGame: 'Jeu de base',
    dlc: 'DLC',
    noCharacters: 'Aucun personnage à afficher.'
  },

  allianceRank: {
    couldntLoadTitle: 'Impossible de charger les données du personnage',
    heading: "Rang d'Alliance :",
    atMaxRank: '{{count}} / {{total}} au rang maximum',
    rank: 'Rang',
    maxRankReached: 'Rang maximum atteint',
    circleAriaLabel: "Rang {{rank}}, {{outerPct}} % du chemin vers le rang 50, {{innerPct}} % du rang actuel",
    apOfTotal: '{{current}} / {{max}} PA',
    apToRank50: "{{remaining}} PA jusqu'au rang 50",
    noDataYet:
      "Aucune donnée pour le moment - connectez-vous avec l'addon <bold>WhatShouldIDoDataCollector</bold> actif."
  },

  alchemy: {
    pageTitle: 'Alchimie',
    intro:
      "Choisissez un solvant et 2 à 3 ingrédients. Tout trait partagé par <bold>deux ingrédients ou plus</bold> devient un effet actif. Les solvants à base d'eau créent des <bold>potions</bold> (les effets vous affectent) ; les huiles créent des <bold2>poisons</bold2> (les effets affectent l'ennemi touché).",
    findRecipeByEffect: 'Trouver une recette par effet',
    pickUpToEffects: "Choisissez jusqu'à {{count}} effets que vous voulez obtenir",
    combinationsFound_one: '{{count}} combinaison de {{mode}} — la meilleure en premier',
    combinationsFound_other: '{{count}} combinaisons de {{mode}} — la meilleure en premier',
    potion: 'Potion',
    poison: 'Poison',
    noRecipeFor: 'Aucune combinaison de 2 à 3 ingrédients ne produit <bold>{{effects}}</bold> ensemble{{modeSuffix}}',
    inAPotion: ' dans une potion',
    inAPoison: ' dans un poison',
    loaded: 'Chargé',
    use: 'Utiliser',
    moreRecipes: '+{{count}} de plus — ajoutez un autre effet pour affiner.',
    potionOrPoison: 'Potion ou poison',
    solvent: 'Solvant',
    anyNotChosen: 'Indifférent / non choisi',
    requires: 'Nécessite <bold>{{requirement}}</bold>',
    removeReagent: 'Retirer {{name}}',
    remove: 'Retirer',
    emptySlot: 'Emplacement vide — ajoutez un ingrédient ci-dessous',
    noSharedTrait: "Aucun trait commun : <bold>{{names}}</bold> — n'apporte actuellement rien au mélange.",
    reagents: 'Ingrédients',
    filterByNameOrEffect: 'Filtrer par nom ou effet…',
    removeAReagentFirst: "Retirez d'abord un ingrédient",
    noReagentMatches: 'Aucun ingrédient ne correspond à « {{query}} ».',
    resultingPotion: 'Potion obtenue',
    resultingPoison: 'Poison obtenu',
    addTwoReagents: "Ajoutez au moins deux ingrédients pour voir ce que vous allez créer.",
    noSharedTraits:
      'Ces ingrédients ne partagent aucun trait — cette combinaison ne produit rien. Essayez des ingrédients aux effets communs.',
    harmsYou: 'vous nuit',
    helpsTarget: 'aide la cible',
    from: 'provenant de {{names}}',
    negatives: ' négatifs',
    wastedPositives: ' positifs gâchés',
    potionNegativesWarning:
      'Cette potion comporte des effets négatifs qui vous affecteront. Changez un ingrédient pour les retirer, ou prenez Sang de Serpent pour les raccourcir.',
    poisonPositivesWarning:
      'Ce poison comporte des effets positifs qui affecteront votre cible. Changez un ingrédient pour les retirer.',
    effectReference: 'Référence des effets',
    clickEffectToSearch: 'Cliquez sur un effet pour rechercher les recettes qui le produisent.'
  },

  enchanting: {
    pageTitle: 'Enchantement',
    intro:
      "Composez un glyphe de A à Z, ou choisissez le <bold>glyphe voulu</bold> et les runes nécessaires s'illuminent. La Puissance définit le niveau du glyphe et s'il est <bold2>additif</bold2> ou <bold2>soustractif</bold2> ; l'Essence définit l'effet ; l'Aspect définit la qualité.",
    iWantToMake: 'Je veux créer…',
    anyGlyph: "— n'importe quel glyphe (composition manuelle) —",
    glyphsGroup: 'Glyphes de {{itemType}}',
    clearTarget: 'Effacer la cible',
    targetHint:
      "Utilisez la rune d'essence <bold>{{essence}}</bold> ({{translation}}) avec une rune de puissance <bold>{{potencyType}}</bold> pour le niveau voulu (mise en évidence ci-dessous). Ajoutez une rune d'Aspect pour la qualité.",
    weapon: 'Arme',
    armor: 'Armure',
    jewelry: 'Bijou',
    additive: 'Additif',
    subtractive: 'Soustractif',
    needed: 'nécessaire',
    potencyRune: 'Rune de puissance',
    essenceRune: "Rune d'essence",
    aspectRune: "Rune d'aspect",
    resultingGlyph: 'Glyphe obtenu',
    pickHighlightedPotency: 'Choisissez une rune de Puissance en surbrillance pour terminer le glyphe.',
    chooseTwoRunes: "Choisissez une rune de Puissance et une rune d'Essence pour voir le glyphe.",
    glyph: 'Glyphe de {{itemType}}',
    level: 'Niveau',
    quality: 'Qualité',
    pickAnAspectRune: "choisissez une rune d'Aspect",
    runes: 'Runes',
    essenceRuneReference: "Référence des runes d'essence",
    clickGlyphToTarget: 'Cliquez sur un glyphe pour le cibler ci-dessus.',
    essence: 'Essence',
    translation: 'Traduction',
    additivePotencyCol: '+ Puissance additive',
    subtractivePotencyCol: '+ Puissance soustractive'
  },

  musicBoxes: {
    pageTitle: 'Boîtes à musique',
    introTracked:
      'Tous les meublants « <bold>Boîte à musique</bold> » actuellement disponibles. Cochez-les au fur et à mesure que vous les obtenez. La progression est suivie séparément par compte et par serveur, et enregistrée sur cet appareil.',
    introUntracked:
      "Tous les meublants « <bold>Boîte à musique</bold> » actuellement disponibles. Cochez-les au fur et à mesure que vous les obtenez. La progression est enregistrée sur cet appareil. Installez WhatShouldIDoDataCollector et connectez-vous avec un personnage pour la suivre séparément par compte et par serveur.",
    collected: 'Obtenues {{count}} / {{total}}',
    filterPlaceholder: 'Filtrer par nom, source ou description…',
    all: 'Toutes',
    missing: 'Manquantes',
    collectedFilter: 'Obtenues',
    filterByCollected: 'Filtrer par statut',
    gotIt: 'Obtenue',
    name: 'Nom',
    source: 'Source',
    cost: 'Coût',
    noMatches: 'Aucune boîte à musique ne correspond à « {{query}} ».'
  },

  achievements: {
    pageTitle: 'Succès',
    introTracked:
      "Les propres médailles de What Should I Do, obtenues en progressant dans l'application. Suivies séparément par compte et par serveur, et enregistrées sur cet appareil.",
    introUntracked:
      "Les propres médailles de What Should I Do, obtenues en progressant dans l'application. Enregistrées sur cet appareil.",
    noneVisible:
      "Chaque succès est lié à une fonctionnalité que vous avez désactivée dans les Paramètres. Réactivez Boîtes à musique, Rang d'Alliance ou Suivi de richesse pour voir votre progression ici.",
    currentMedal: 'Médaille actuelle : <bold>{{name}}</bold>',
    currentClass: 'Classe actuelle : <bold>{{name}}</bold>',
    medalAltEarned: 'Médaille {{tier}}, obtenue',
    medalAltLocked: 'Médaille {{tier}}, verrouillée',
    classAltEarned: 'Classe {{tier}}, obtenue',
    classAltLocked: 'Classe {{tier}}, verrouillée',
    musicBox: {
      title: 'Collection de boîtes à musique',
      description: 'Collectionnez les meublants « Boîte à musique », suivi sur la page Boîtes à musique.',
      progress: '{{count}} / {{total}} obtenues',
      notStarted: 'Obtenez votre première boîte à musique pour gagner la médaille {{tier}}.',
      tiers: { tin: 'Propriétaire', bronze: 'Collectionneur', silver: 'Conservateur', gold: 'Maestro' }
    },
    allianceRank: {
      title: "Vétérans de la guerre d'Alliance",
      description: "Amenez des personnages au rang d'Alliance 50, suivi sur la page Rang d'Alliance.",
      progress: '{{count}} au rang 50',
      notStarted: "Amenez un personnage au rang d'Alliance 50 pour gagner la médaille {{tier}}.",
      tiers: { tin: 'Vétéran', bronze: 'Champion', silver: 'Chef de guerre', gold: 'Maréchal', platinum: 'Suzerain' }
    },
    wealth: {
      title: 'Richesse',
      description:
        "Augmentez chaque monnaie - Or, Points d'Alliance, Pierres de Tel Var et Bons de commande - la banque commune plus tout ce que chaque personnage transporte.",
      amountsSummary: '{{gold}} Or · {{ap}} PA · {{telVar}} Tel Var · {{writ}} Bons',
      notStarted: 'Atteignez {{gold}} Or pour obtenir la classe {{tier}}.',
      tiers: { peasant: 'Paysan', commoner: 'Roturier', merchant: 'Marchand', noble: 'Noble', baron: 'Baron', magnate: 'Magnat' }
    }
  },

  settings: {
    pageTitle: 'Paramètres',
    jumpToSection: 'Aller à une section des paramètres',
    dataFolderNav: 'Dossier de données ESO',
    featuresNav: 'Fonctionnalités',
    addonsNav: 'Addons',
    languageNav: 'Langue',
    themeNav: 'Thème',
    aboutNav: 'À propos',
    dataFolderTitle: 'Dossier de données ESO',
    dataFolderBody:
      "Cette application lit vos SavedVariables ESO depuis votre dossier Documents. Si Windows/OneDrive a redirigé Documents ailleurs, indiquez ici le bon dossier.",
    browse: 'Parcourir…',
    resetToDefault: 'Réinitialiser par défaut',
    noAccountsFound:
      'Aucun compte trouvé dans ce dossier - vérifiez qu\'il contient un dossier "Elder Scrolls Online" avec vos données d\'addons.',
    foundAccounts_one: '{{count}} compte trouvé,',
    foundAccounts_other: '{{count}} comptes trouvés,',
    foundCharacters_one: '{{count}} personnage.',
    foundCharacters_other: '{{count}} personnages.',
    couldntReadFolder: 'Impossible de lire ce dossier : {{message}}',
    featuresTitle: 'Fonctionnalités',
    featuresBody:
      "Désactivez ce que vous n'utilisez pas pour désencombrer la barre latérale. Cela masque uniquement la page - vos données ne sont pas touchées, et vous pouvez la réactiver à tout moment.",
    addonsTitle: 'Addons',
    addonsBody:
      "Cette application lit les données que les addons ESO écrivent sur le disque. Installez-les depuis <esoui>ESOUI</esoui> (ou Minion), activez-les en jeu, puis connectez-vous avec chaque personnage une fois avec eux actifs pour qu'ils aient des données à écrire.",
    required: 'Requis',
    optional: 'Optionnel',
    checking: 'Vérification…',
    detected: 'Détecté ({{file}} trouvé)',
    notDetected: 'Non détecté (pas de {{file}} sur le disque)',
    detectedShort: '✓ détecté',
    notDetectedShort: 'non détecté',
    languageTitle: 'Langue',
    languageBody:
      "Modifie la langue dans laquelle le texte de l'application s'affiche. Les données propres au jeu ESO (noms de donjons, ingrédients, etc.) restent toujours en anglais.",
    themeTitle: 'Thème',
    themeSystemLabel: 'Système',
    themeSystemDesc: 'Suit le réglage clair/sombre de votre système',
    themeDarkLabel: 'Sombre',
    themeDarkDesc: 'Le thème par défaut - orange et sarcelle',
    themeLightLabel: 'Clair',
    themeLightDesc: 'Mêmes couleurs, fond clair',
    themeEmberLabel: 'Braise',
    themeEmberDesc: 'Sombre et chaleureux, à fort contraste',
    themeFrostLabel: 'Givre',
    themeFrostDesc: 'Thème sombre aux tons bleus',
    aboutTitle: 'À propos',
    version: 'Version',
    build: 'Build',
    checkForUpdates: 'Vérifier les mises à jour',
    restartAndInstall: 'Redémarrer et installer',
    updateChecking: 'Recherche de mises à jour…',
    updateAvailable: 'Mise à jour v{{version}} trouvée - téléchargement…',
    updateNotAvailable: 'Vous êtes à jour.',
    updateDownloading: 'Téléchargement de la mise à jour… {{percent}} %',
    updateDownloaded: 'Version {{version}} téléchargée - redémarrez pour installer.',
    madeBy: 'Créé par Illyriat. Si cette application vous est utile, vous pouvez <support>soutenir le projet</support>.',
    features: {
      welcomeBanner: {
        label: 'Bannière de bienvenue',
        description: 'La bannière « Bienvenue, <account> ! » (et les Points de Championnat) en haut de la page Accueil.'
      },
      pledges: {
        label: 'Vœux du jour',
        description: 'Les donjons des Vœux Intrépides du jour et leurs recommandations sur la page Accueil.'
      },
      upcomingPledges: {
        label: 'Aperçu des vœux à venir',
        description: "L'option d'aperçu des vœux sur 5 jours sous Vœux du jour."
      },
      ridingTraining: {
        label: 'Entraînement de monture',
        description: "Le tableau d'entraînement de monture sur la page Accueil."
      },
      dungeonChecklist: {
        label: 'Liste des donjons',
        description: 'La liste complète de complétion des donjons par personnage.'
      },
      allianceRank: {
        label: "Rang d'Alliance",
        description: "La page Rang d'Alliance, et sa médaille Vétérans de la guerre d'Alliance sur la page Succès."
      },
      alchemy: {
        label: 'Alchimie',
        description: "La page de calcul d'alchimie."
      },
      enchanting: {
        label: 'Enchantement',
        description: "La page de calcul d'enchantement."
      },
      musicBoxes: {
        label: 'Boîtes à musique',
        description: 'La liste de collection des boîtes à musique, et sa médaille Collection de boîtes à musique sur la page Succès.'
      },
      wealthTracker: {
        label: 'Suivi de richesse',
        description:
          "Le tableau Or / Points d'Alliance / Pierres de Tel Var / Bons de commande sur la page Accueil, et sa médaille Richesse sur la page Succès."
      },
      achievements: {
        label: 'Succès',
        description:
          "La page Succès de l'application : médailles de collection de boîtes à musique, Vétérans de la guerre d'Alliance (personnages au rang d'Alliance 50) et classes de Richesse (Or / Points d'Alliance / Pierres de Tel Var / Bons de commande)."
      },
      languageSupport: {
        label: 'Langue',
        description: "Le sélecteur de langue dans les Paramètres, pour changer la langue d'affichage de l'application."
      }
    },
    addonsList: {
      dataCollector: {
        name: 'What Should I Do - Data Collector',
        description:
          "Un addon compagnon dédié qui enregistre le nom et le serveur de chaque personnage, les quêtes de donjon terminées par chaque personnage (alimente les recommandations quotidiennes de Vœux Intrépides et la Liste des donjons - c'est la fonctionnalité principale de WhatShouldIDo), le temps de recharge d'entraînement de monture et les niveaux de Capacité / Endurance / Vitesse de chaque personnage (alimente le tableau d'entraînement de monture sur la page Accueil), le rang de guerre d'Alliance et la progression en Points d'Alliance de chaque personnage (alimente la page Rang d'Alliance), les Points de Championnat par royaume de chaque compte (affichés sur la bannière de la page Accueil), et l'Or / les Points d'Alliance / les Pierres de Tel Var / les Bons de commande - à la fois le montant transporté par chaque personnage et le total de la banque commune du compte par royaume (alimente le Suivi de richesse sur la page Accueil). C'est le seul addon dont WhatShouldIDo a besoin - sans lui, l'application n'a aucune donnée."
      }
    }
  },

  updateBanner: {
    readyToInstall: 'La version {{version}} est prête à être installée.',
    restartAndInstall: 'Redémarrer et installer',
    dismiss: 'Ignorer'
  }
}
