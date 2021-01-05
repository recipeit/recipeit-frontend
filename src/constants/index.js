export const unitTranslations = {
  'Weight.Gram': 'g',
  'Weight.Kilogram': 'kg',
  'Volume.Liter': 'l',
  'Volume.Milliliter': 'ml',
  'Volume.Tablespoon': 'łyżka',
  'Volume.Teaspoon': 'łyżeczka',
  'Whole.Piece': 'szt.',
  'Whole.Grain': 'ziarna',
  'Whole.Handful': 'garść'
}

export const recipesSortingMethods = [
  'nameAscending',
  'nameDescending',
  'timeAscending',
  'timeDescending',
  'ingredientsCountAscending',
  'ingredientsCountDescending'
]
export const defaultRecipesSortingMethod = recipesSortingMethods[0]

export const recipesFilterOptions = {
  type: {
    name: 'Typ',
    type: 'checkbox',
    options: [
      {
        value: 'breakfast',
        name: 'Śniadanie'
      },
      {
        value: 'dinner',
        name: 'Obiad'
      },
      {
        value: 'supper',
        name: 'Kolacja'
      },
      {
        value: 'dessert',
        name: 'Deser'
      },
      {
        value: 'cake',
        name: 'Ciasto'
      },
      {
        value: 'snack',
        name: 'Przekąska'
      }
    ]
  },
  diet: {
    name: 'Dieta',
    type: 'checkbox',
    options: [
      {
        value: 'vegan',
        name: 'Wegańska'
      },
      {
        value: 'vegetarian',
        name: 'Wegetariańska'
      }
    ]
  },
  allergens: {
    name: 'Pomiń dania zawierające',
    type: 'checkbox',
    isExcluding: true,
    options: [
      {
        value: 'dairy',
        name: 'Nabiał'
      },
      {
        value: 'gluten',
        name: 'Gluten'
      },
      {
        value: 'eggs',
        name: 'Jaja'
      },
      {
        value: 'fishes',
        name: 'Ryby'
      },
      {
        value: 'nuts',
        name: 'Orzechy'
      }
    ]
  }
}
