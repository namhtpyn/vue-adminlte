export class TableHeader {
  text: string = ''
  value: string = ''
  type: 'band' | 'number' | 'date' | 'time' | 'datetime' | 'image' | 'checkbox' | 'text' | string = 'text'
  width?: string
  align: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit' = 'left'
  valign:
    | 'baseline'
    | 'length'
    | 'sub'
    | 'super'
    | 'top'
    | 'text-top'
    | 'middle'
    | 'bottom'
    | 'text-bottom'
    | 'initial'
    | 'inherit' = 'middle'
  bgcolor?: string
  color?: string
  sortable: boolean = false
  headerAlign: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit' = 'center'
  headerValign:
    | 'baseline'
    | 'length'
    | 'sub'
    | 'super'
    | 'top'
    | 'text-top'
    | 'middle'
    | 'bottom'
    | 'text-bottom'
    | 'initial'
    | 'inherit' = 'middle'
  headerBgcolor: string = '#3c8dbc'
  headerColor: string = '#ffffff'
  summary?: string | Function
  format = v => v
  validate = [v => true]
  editable: boolean = false
  children?: TableHeader[]
  encodeHtml: boolean = true
  grouped: boolean = false
  merged: boolean = false
  visible: boolean = true
  _colspan: number = 1
  _rowspan: number = 1
}

export class TableItem {
  index: number = 0
  data: any = {}
  type: 'item' | 'expand' | 'group' = 'item'
  visible: boolean = true
  group?: { text: string; header: TableHeader; level: number }
  _rowspan: number = 1
  constructor(index: number, data: any[]) {
    this.index = index
    this.data = data
  }
}

export class TableSort {
  name: string = ''
  desc: boolean = false
  constructor(name: string, desc: boolean = false) {
    this.name = name
    this.desc = desc
  }
}
export class TableFilter {
  name: string = ''
  value: any[] = []
  constructor(name: string) {
    this.name = name
  }
}

export class ExportCellData {
  text: string = ''
  colspan?: number = undefined
  rowspan?: number = undefined
}

declare global {
  interface Object {
    fromEntries(o: any): Object
  }
}
