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
      filter: 'Filtruj',
      sort: 'Sortuj',
      seeAll: 'zobacz wszystkie',
      addProduct: 'Dodaj produkt'
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
      title: 'Lista zakupów'
    },
    recipesSortingMethods: {
      name: 'nazwy: od A do Z',
      nameDescending: 'nazwy: od Z do A',
      time: 'czasu przygotowania: rosnąco',
      timeDescending: 'czasu przygotowania: malejąco',
      ingredients: 'liczby składników: rosnąco',
      ingredientsDescending: 'liczby składników: malejąco'
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
    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
      return 2
    }

    return 3
  }
}
