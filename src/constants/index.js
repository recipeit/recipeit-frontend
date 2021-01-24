export const units = [
  'Weight.Gram',
  'Weight.Kilogram',
  'Volume.Liter',
  'Volume.Milliliter',
  'Volume.Tablespoon',
  'Volume.Teaspoon',
  'Whole.Piece',
  'Whole.Grain',
  'Whole.Handful'
]

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
  other: {
    type: 'any',
    inputType: 'checkbox',
    options: [
      {
        key: 0,
        value: 'favourite',
        name: 'Ulubione'
      },
      {
        key: 1,
        value: 'planned',
        name: 'Zaplanowane'
      }
    ]
  },
  type: {
    name: 'Typ',
    type: 'any',
    inputType: 'checkbox',
    options: [
      {
        key: 2,
        value: 'breakfast',
        name: 'Śniadanie'
      },
      {
        key: 3,
        value: 'dinner',
        name: 'Obiad'
      },
      {
        key: 4,
        value: 'supper',
        name: 'Kolacja'
      },
      {
        key: 5,
        value: 'dessert',
        name: 'Deser'
      },
      {
        key: 6,
        value: 'cake',
        name: 'Ciasto'
      },
      {
        key: 7,
        value: 'snack',
        name: 'Przekąska'
      }
    ]
  },
  diet: {
    name: 'Dieta',
    type: 'any',
    inputType: 'checkbox',
    options: [
      {
        key: 8,
        value: 'vegan',
        name: 'Wegańska'
      },
      {
        key: 9,
        value: 'vegetarian',
        name: 'Wegetariańska'
      }
    ]
  },
  allergens: {
    name: 'Pomiń dania zawierające',
    inputType: 'checkbox',
    type: 'none',
    options: [
      {
        key: 10,
        value: 'dairy',
        name: 'Nabiał'
      },
      {
        key: 11,
        value: 'gluten',
        name: 'Gluten'
      },
      {
        key: 12,
        value: 'eggs',
        name: 'Jaja'
      },
      {
        key: 13,
        value: 'fishes',
        name: 'Ryby'
      },
      {
        key: 14,
        value: 'nuts',
        name: 'Orzechy'
      }
    ]
  }
}
