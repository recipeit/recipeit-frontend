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
      purchaseAllButton: 'przenieś wszystko do Twojej kuchni',
      purchaseAllDialogTitle: 'Czy na pewno chcesz przenieść {products} do Twojej kuchni?'
    },
    recipesSortingMethods: {
      nameAscending: 'nazwy: od A do Z',
      nameDescending: 'nazwy: od Z do A',
      timeAscending: 'czasu przygotowania: rosnąco',
      timeDescending: 'czasu przygotowania: malejąco',
      ingredientsCountAscending: 'liczby składników: rosnąco',
      ingredientsCountDescending: 'liczby składników: malejąco'
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
