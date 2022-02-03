export type UnitGroupName = 'popular' | 'weight' | 'volume' | 'length' | 'unset'

export type UnitGroup = {
  groupLabel: UnitGroupName
  groupValue: Array<string>
}
