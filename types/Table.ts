import _ from 'lodash'
export class TableHeader {
  text: string = ''
  value: string = ''
  kebabValue: Function = function() {
    return _.kebabCase(this.value)
  }
  type?: string = 'text'
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
}

export class TableItem {
  index?: number
  data?: any
  isExpansion?: boolean
}

export class TableSort {
  name?: string = ''
  desc?: boolean = false
  constructor(name: string) {
    this.name = name
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
