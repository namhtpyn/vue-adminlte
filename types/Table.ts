import _ from 'lodash'
export class TableHeader {
  text: string = ''
  value: string = ''
  kebabValue: Function = function() {
    return _.kebabCase(this.value)
  }
  type?: string = 'text'
  width?: string
  align?: string = 'left'
  valign?: string = 'middle'
  bgcolor?: string
  color?: string
  sortable?: boolean = false
  headerAlign?: string = 'left'
  headerValign?: string = 'middle'
  headerBgcolor?: string
  headerColor?: string
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
