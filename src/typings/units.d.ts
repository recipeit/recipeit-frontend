export type UnitGroupName = 'popular' | 'weight' | 'volume' | 'length' | 'unset'

export type UnitGroup = {
  groupKey: UnitGroupName
  groupValue: Array<string>
}
