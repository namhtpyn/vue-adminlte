import _ from 'lodash'
export class TableHeader {
  text: string = ''
  value: string = ''
  kebabValue: Function = function() {
    return _.kebabCase(this.value)
  }
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'band' | 'image' | 'checkbox' = 'text'
  width?: string
  align?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit' = 'left'
  valign?:
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
  sortable?: boolean = false
  headerAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit' = 'left'
  headerValign?:
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
  headerBgcolor?: string = '#3c8dbc'
  headerColor?: string = '#ffffff'
  summary?: string | Function
  format?: Function = v => v
  children?: TableHeader[]
  encodeHtml?: boolean = true
  grouped?: boolean = false
  _colspan: number = 1
  _rowspan: number = 1
}

export class TableItem {
  index?: number
  data?: any[]
  type: 'item' | 'expand' | 'group' = 'item'
  visible: boolean = true
  group: { text: string; header: TableHeader; level: number }
  constructor(index: number, data: any[]) {
    this.index = index
    this.data = data
  }
}

export class TableSort {
  name?: string = ''
  desc?: boolean = false
  constructor(name: string, desc: boolean = false) {
    this.name = name
    this.desc = desc
  }
}
export class TableFilter {
  name?: string = ''
  value?: any[] = []
  constructor(name: string) {
    this.name = name
  }
}

declare global {
  interface Object {
    fromEntries(o: any): Object
  }
}
