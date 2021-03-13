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
      yes: 'Tak',
      no: 'Nie'
    },
    filterModal: {
      title: 'Dostępne filtry',
      submitButton: 'Filtruj',
      cancelButton: 'Anuluj'
    },
    sortModal: {
      title: 'Sortuj według',
      submitButton: 'Sortuj',
      cancelButton: 'Anuluj'
    },
    recipes: {
      title: 'Przepisy'
    },
    cookIt: {
      title: 'Ugotuj to!',
      buyMissingIngredient: 'Dokup brakujący składnik i nie marnuj tych, które już masz!'
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
      Other: ' ',
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
        Gram: 'gram | gram | gramy | gram',
        Kilogram: 'kilogramów | kilogram | kilogramy | kilogramów'
      },
      Volume: {
        Liter: 'litrów | litr | litry | litrów',
        Milliliter: 'mililitrów | mililitr | mililitry | mililitrów',
        Tablespoon: 'łyżek | łyżka | łyżki | łyżek',
        Teaspoon: 'łyżeczek | łyżeczka | łyżeczki | łyżeczek',
        Cup: 'szklanek | szklanka | szklanki | szklanek'
      },
      Whole: {
        Piece: 'sztuk | sztuka | sztuki | sztuk',
        Grain: 'ziaren | ziarno | ziarna | ziaren',
        Handful: 'garści | garść | garście | garści'
      }
    },
    theme: 'Motyw',
    themes: {
      dark: 'ciemny',
      light: 'jasny',
      system: 'systemowy'
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
