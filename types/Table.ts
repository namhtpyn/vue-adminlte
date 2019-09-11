export class TableHeader {
  text: string = ''
  value: string = ''
  type?: string = 'text'
  width?: string
  align?: string = 'left'
  valign?: string = 'center'
  bgcolor?: string
  color?: string
  sortable?: boolean = false
  headerAlign?: string = 'left'
  headerValign?: string = 'center'
  headerBgcolor?: string
  headerColor?: string
  summary?: string
  children?: TableHeader[]
}

declare global {
  interface Object {
    fromEntries(o: any): Object
  }
}
