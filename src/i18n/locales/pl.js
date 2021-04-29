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
      Other: 'Ogólne',
      Category: 'Kategoria',
      Diet: 'Dieta',
      Allergens: 'Wyklucz alergeny'
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
      tablespoon: 'łyżek | łyżka | łyżki | łyżek',
      teaspoon: 'łyżeczek | łyżeczka | łyżeczki | łyżeczek',

      millimeter: 'mm',
      centimeter: 'cm',
      meter: 'm',

      clove: 'ząbków | ząbek | ząbki | ząbków',
      piece: 'szt.',
      grain: 'ziaren | ziarno | ziarna | ziaren',
      package: 'opak.',
      pinch: 'szczypt | szczypta | szczypty | szczypt',
      handful: 'garści | garść | garście | garści',
      slice: 'plastrów | plaster | plastry | plastrów',
      breadslice: 'kromek | kromka | kromki | kromek',
      bunch: 'pęczków | pęczek | pęczki | pęczków',
      stalk: 'łodyg | łodyga | łodygi | łodyg',
      cube: 'kostek | kostka | kostki | kostek',
      can: 'puszek | puszka | puszki | puszek',
      leaf: 'liści | liść | liście | liści',
      sachet: 'saszetek | saszetka | saszetki | saszetek'
    },
    units: {
      milligram: 'miligramów | miligram | miligramy | miligramów',
      gram: 'gram | gram | gramy | gram',
      kilogram: 'kilogramów | kilogram | kilogramy | kilogramów',
      dekagram: 'dekagramów | dekagram | dekagramy | dekagramów',

      milliliter: 'mililitrów | mililitr | mililitry | mililitrów',
      deciliter: 'decylitrów | decylitr | decylitry | decylitrów',
      liter: 'litrów | litr | litry | litrów',

      cup: 'szklanek | szklanka | szklanki | szklanek',
      tablespoon: 'łyżek | łyżka | łyżki | łyżek',
      teaspoon: 'łyżeczek | łyżeczka | łyżeczki | łyżeczek',

      millimeter: 'milimetrów | milimetr | milimetry | milimetrów',
      centimeter: 'centymetrów | centymetr | centymetry | centymetrów',
      meter: 'metrów | metr | metry | metrów',

      clove: 'ząbków | ząbek | ząbki | ząbków',
      piece: 'sztuk | sztuka | sztuki | sztuk',
      grain: 'ziaren | ziarno | ziarna | ziaren',
      package: 'opakowań | opakowanie | opakowania | opakowań',
      pinch: 'szczypt | szczypta | szczypty | szczypt',
      handful: 'garści | garść | garście | garści',
      slice: 'plastrów | plaster | plastry | plastrów',
      breadslice: 'kromek | kromka | kromki | kromek',
      bunch: 'pęczków | pęczek | pęczki | pęczków',
      stalk: 'łodyg | łodyga | łodygi | łodyg',
      cube: 'kostek | kostka | kostki | kostek',
      can: 'puszek | puszka | puszki | puszek',
      leaf: 'liści | liść | liście | liści',
      sachet: 'saszetek | saszetka | saszetki | saszetek'
    },
    unitGroups: {
      weight: 'waga',
      volume: 'objętość',
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
      Spices: 'Zioła i przyprawy',
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
    if (choice === 0) {
      return 0
    }

    if (choice === 1) {
      return 1
    }

    if (choicesLength < 4) {
      return 2
    }

    const teen = choice > 10 && choice < 20
    // at first, there was ... % 10 >= 2, but there was problem with float numbers, eg. 1.5
    if (!teen && choice % 10 > 1 && choice % 10 <= 4) {
      return 2
    }

    return 3
  }
}
