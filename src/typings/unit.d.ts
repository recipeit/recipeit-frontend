export enum UnitGroupName {
  Popular = 'popular',
  Weight = 'weight',
  Volume = 'volume',
  Length = 'length',
  Unset = 'unset'
}

export type UnitGroup = {
  groupKey: UnitGroupName
  groupValue: Array<string>
}
