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
      title: 'Filtry',
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
      buyMissingIngredient: 'Możesz też coś dokupić!'
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
      Weight: {
        Gram: 'g',
        Kilogram: 'kg'
      },
      Volume: {
        Liter: 'l',
        Milliliter: 'ml',
        Tablespoon: 'łyżek | łyżka | łyżki | łyżek',
        Teaspoon: 'łyżeczek | łyżeczka | łyżeczki | łyżeczek',
        Cup: 'szklanek | szklanka | szklanki | szklanek'
      },
      Whole: {
        Piece: 'szt.',
        Grain: 'ziaren | ziarno | ziarna | ziaren',
        Handful: 'garści | garść | garście | garści'
      }
    },
    units: {
      Weight: {
        Milligram: 'miligramów | miligram | miligramy | miligramów',
        Gram: 'gram | gram | gramy | gram',
        Kilogram: 'kilogramów | kilogram | kilogramy | kilogramów',
        Dekagram: 'dekagramów | dekagram | dekagramy | dekagramów'
      },
      Volume: {
        Cup: 'szklanek | szklanka | szklanki | szklanek',
        Milliliter: 'mililitrów | mililitr | mililitry | mililitrów',
        Deciliter: 'decylitrów | decylitr | decylitry | decylitrów',
        Liter: 'litrów | litr | litry | litrów',
        Tablespoon: 'łyżek | łyżka | łyżki | łyżek',
        Teaspoon: 'łyżeczek | łyżeczka | łyżeczki | łyżeczek'
      },
      Whole: {
        Piece: 'sztuk | sztuka | sztuki | sztuk',
        Grain: 'ziaren | ziarno | ziarna | ziaren',
        Package: 'opakowań | opakowanie | opakowania | opakowań',
        Pinch: 'szczypt | szczypta | szczypty | szczypt',
        Handful: 'garści | garść | garście | garści'
      }
    },
    unitGroups: {
      weight: 'waga',
      volume: 'objętość',
      other: 'inne'
    },
    theme: 'Motyw',
    themes: {
      dark: 'ciemny',
      light: 'jasny',
      system: 'systemowy'
    },
    errorCode: {
      [errorCodes.ERROR]: 'coś poszło nie tak',
      [errorCodes.WEAK_PASSWORD]: 'użyj silniejszego hasła',
      [errorCodes.WRONG_USER_PASSWORD_COMBINATION]: 'nieprawidłowy adres email lub hasło',
      [errorCodes.EMAIL_ALREADY_USED]: 'ten email jest już w użyciu',
      [errorCodes.REQUIRED]: 'to pole jest wymagane',
      [errorCodes.INVALID_EMAIL]: 'niepoprawny adres email',
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
