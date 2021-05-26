import errorCodes from '@/constants/errorCodes'
import timesOfDay from '@/constants/timesOfDay'

export default {
  messages: {
    welcome: {
      morning: 'Miłego poranka',
      afternoon: 'Dzień dobry',
      evening: 'Dobry wieczór'
    },
    shared: {
      recipesBook: 'Przepisy',
      recipes: 'brak przepisów | {n} przepis | {n} przepisy | {n} przepisów',
      products: 'brak produktów | {n} produkt | {n} produkty | {n} produktów',
      servings: 'brak porcji | {n} porcja | {n} porcje | {n} porcji',
      filter: 'Filtruj',
      sort: 'Sortuj',
      seeAll: 'zobacz wszystkie',
      addProduct: 'Dodaj produkt',
      addExpirationDate: 'Dodaj datę ważności',
      planRecipe: 'Zaplanuj przepis',
      yes: 'Tak',
      no: 'Nie'
    },
    filterModal: {
      title: 'Sortowanie i filtry',
      submitButton: 'Filtruj',
      cancelButton: 'Anuluj'
    },
    sortModal: {
      title: 'Sortuj według',
      submitButton: 'Sortuj',
      cancelButton: 'Anuluj'
    },
    recipes: {
      title: 'Baza przepisów'
    },
    cookIt: {
      title: 'Ugotuj to!',
      buyMissingIngredient: 'Planujesz drobne zakupy?'
    },
    myKitchen: {
      title: 'Moja kuchnia'
    },
    shoppingList: {
      title: 'Lista zakupów',
      purchaseAllButton: 'przenieś wszystko do swojej kuchni',
      purchaseAllDialogTitle: 'Czy na pewno chcesz przenieść {products} do swojej kuchni?'
    },
    recipesSortingMethods: {
      NameAscending: 'nazwy: od A do Z',
      NameDescending: 'nazwy: od Z do A',
      TimePreparingAscending: 'czasu przygotowania: rosnąco',
      TimePreparingDescending: 'czasu przygotowania: malejąco',
      IngredientsCountAscending: 'liczby składników: rosnąco',
      IngredientsCountDescending: 'liczby składników: malejąco',
      MissingIngredientsAscending: 'liczby brakujących składników: rosnąco',
      MissingIngredientsDescending: 'liczby brakujących składników: malejąco'
    },
    recipeFilterGroups: {
      Other: 'Twoje',
      Category: 'Kategoria',
      Diet: 'Dieta',
      Allergens: 'Wyklucz alergeny',
      BaseProducts: 'Wymagane składniki'
    },
    recipeFilterOptions: {
      Other: {
        Favourite: 'Ulubione',
        Planned: 'Zaplanowane'
      },
      Category: {
        Breakfast: 'Śniadanie',
        Dinner: 'Obiad',
        Supper: 'Kolacja',
        Dessert: 'Deser',
        Cake: 'Ciasto',
        Snack: 'Przekąska'
      },
      Diet: {
        Vegan: 'Wegańska',
        Vegetarian: 'Wegetariańska'
      },
      Allergens: {
        Dairy: 'Nabiał',
        Gluten: 'Gluten',
        Eggs: 'Jajka',
        Fishes: 'Ryby',
        Nuts: 'Orzechy'
      }
    },
    recipeCategory: {
      Breakfast: 'Śniadanie',
      Dinner: 'Obiad',
      Supper: 'Kolacja',
      Dessert: 'Deser',
      Cake: 'Ciasto',
      Snack: 'Przekąska'
    },
    unitsShort: {
      milligram: 'mg',
      gram: 'g',
      kilogram: 'kg',
      dekagram: 'dg',

      milliliter: 'ml',
      deciliter: 'dl',
      liter: 'l',

      cup: 'szkl.',
      tablespoon: 'łyżki | łyżka | łyżki | łyżek',
      teaspoon: 'łyżeczki | łyżeczka | łyżeczki | łyżeczek',

      millimeter: 'mm',
      centimeter: 'cm',
      meter: 'm',

      clove: 'ząbka | ząbek | ząbki | ząbków',
      piece: 'szt.',
      grain: 'ziarna | ziarno | ziarna | ziaren',
      package: 'opak.',
      pinch: 'szczypy | szczypta | szczypty | szczypt',
      handful: 'garści | garść | garście | garści',
      slice: 'plastra | plaster | plastry | plastrów',
      breadslice: 'kromki | kromka | kromki | kromek',
      bunch: 'pęczka | pęczek | pęczki | pęczków',
      stalk: 'łodygi | łodyga | łodygi | łodyg',
      cube: 'kostki | kostka | kostki | kostek',
      can: 'puszki | puszka | puszki | puszek',
      leaf: 'liścia | liść | liście | liści',
      sachet: 'saszetki | saszetka | saszetki | saszetek',
      jar: 'słoika | słoik | słoiki | słoików',
      bucket: 'wiaderka | wiaderko | wiaderka | wiaderek'
    },
    units: {
      milligram: 'miligrama | miligram | miligramy | miligramów',
      gram: 'grama | gram | gramy | gram',
      kilogram: 'kilograma | kilogram | kilogramy | kilogramów',
      dekagram: 'dekagrama | dekagram | dekagramy | dekagramów',

      milliliter: 'mililitra | mililitr | mililitry | mililitrów',
      deciliter: 'decylitra | decylitr | decylitry | decylitrów',
      liter: 'litra | litr | litry | litrów',

      cup: 'szklanki | szklanka | szklanki | szklanek',
      tablespoon: 'łyżki | łyżka | łyżki | łyżek',
      teaspoon: 'łyżeczki | łyżeczka | łyżeczki | łyżeczek',

      millimeter: 'milimetra | milimetr | milimetry | milimetrów',
      centimeter: 'centymetra | centymetr | centymetry | centymetrów',
      meter: 'metra | metr | metry | metrów',

      clove: 'ząbka | ząbek | ząbki | ząbków',
      piece: 'sztuki | sztuka | sztuki | sztuk',
      grain: 'ziarna | ziarno | ziarna | ziaren',
      package: 'opakowania | opakowanie | opakowania | opakowań',
      pinch: 'szczypty | szczypta | szczypty | szczypt',
      handful: 'garści | garść | garście | garści',
      slice: 'plastra | plaster | plastry | plastrów',
      breadslice: 'kromki | kromka | kromki | kromek',
      bunch: 'pęczka | pęczek | pęczki | pęczków',
      stalk: 'łodygi | łodyga | łodygi | łodyg',
      cube: 'kostki | kostka | kostki | kostek',
      can: 'puszki | puszka | puszki | puszek',
      leaf: 'liśca | liść | liście | liści',
      sachet: 'saszetki | saszetka | saszetki | saszetek',
      jar: 'słoika | słoik | słoiki | słoików',
      bucket: 'wiaderka | wiaderko | wiaderka | wiaderek'
    },
    unitGroups: {
      weight: 'waga',
      volume: 'objętość',
      length: 'długość',
      unset: 'inne'
    },
    theme: 'Motyw',
    themes: {
      dark: 'ciemny',
      light: 'jasny',
      system: 'systemowy'
    },
    errorCode: {
      [errorCodes.ERROR]: 'coś poszło nie tak',
      [errorCodes.TOO_FREQUENT]: 'poczekaj kilka minut aby wysłać wiadomość jeszcze raz',
      [errorCodes.WRONG_PASSWORD]: 'nieprawidłowe hasło',
      [errorCodes.WEAK_PASSWORD]: 'użyj silniejszego hasła',
      [errorCodes.WRONG_USER_PASSWORD_COMBINATION]: 'nieprawidłowy adres e-mail lub hasło',
      [errorCodes.EMAIL_ALREADY_USED]: 'ten e-mail jest już w użyciu',
      [errorCodes.REQUIRED]: 'to pole jest wymagane',
      [errorCodes.INVALID_EMAIL]: 'niepoprawny adres e-mail',
      [errorCodes.REQUIRED_AT_LEAST_6_CHAR]: 'wymagane co najmniej 6 znaków',
      [errorCodes.REQUIRED_AT_LEAST_ONE_LOWER]: 'wymagana co najmniej jedna mała litera',
      [errorCodes.REQUIRED_AT_LEAST_ONE_UPPER]: 'wymagana co najmniej jedna duża litera',
      [errorCodes.REQUIRED_AT_LEAST_ONE_DIGIT]: 'wymagana co najmniej jedna cyfra',
      [errorCodes.REQUIRED_AT_LEAST_ONE_NON_ALPHANUM]: 'wymagany co najmniej jeden znak specjalny',
      [errorCodes.WRONG_PASSWORD_COMBINATION]: 'wprowadzone hasła nie są takie same'
    },
    timeOfDay: {
      [timesOfDay.BREAKFAST]: 'śniadanie',
      // [timesOfDay.ELEVENSES]: 'drugie śniadanie',
      [timesOfDay.LUNCH]: 'lunch',
      [timesOfDay.DINNER]: 'obiad',
      [timesOfDay.SUPPER]: 'kolacja',
      [timesOfDay.SNACK]: 'przekąska'
    },
    productCategory: {
      Others: 'Inne',
      Dairy: 'Nabiał',
      Vegetables: 'Warzywa',
      Fruits: 'Owoce',
      BakingAndGrains: 'Zboża i pieczywo',
      Sweeteners: 'Słodziki',
      Spices: 'Zioła i przyprawy', // i dodatki
      Meats: 'Mięso',
      Fishes: 'Ryby',
      Seafoods: 'Owoce morza',
      Oils: 'Oleje',
      Sauces: 'Sosy',
      Legumes: 'Rośliny strączkowe',
      Alcohol: 'Alkohol',
      Soup: 'Zupy',
      Nuts: 'Orzechy',
      DairyAlternatives: 'Zamienniki nabiału',
      DessertsAndSnacks: 'Desery i przekąski',
      Beverages: 'Napoje'
    }
  },
  pluralizationRules(choice, choicesLength) {
    const absChoice = Math.abs(choice) // Change to positive
    const decimal = absChoice - Math.floor(absChoice)

    if (decimal) {
      return 0
    }

    if (absChoice === 1) {
      return 1
    }

    if (choicesLength < 4) {
      return 2
    }

    const teen = absChoice > 10 && absChoice < 20
    // at first, there was ... % 10 >= 2, but there was problem with float numbers, eg. 1.5
    if (!teen && absChoice % 10 > 1 && absChoice % 10 <= 4) {
      return 2
    }

    return 3
  }
}
