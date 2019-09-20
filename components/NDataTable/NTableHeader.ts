import { Component, Mixins } from 'vue-property-decorator'
import { VueNode } from '../../extension/VueSlot'
import NBase from '../Base/NBase'
import _ from 'lodash'
import NTableProp from './NTableProp'
import NData from './../Base/NData'
import { TableHeader } from './../../types/Table'
import numeral from 'numeral'
import moment from 'moment'
@Component({})
export default class NTableHeader extends Mixins(NBase, NData, NTableProp) {
  private getHeaders(nodes: VueNode[] = this.vSlot.data) {
    if (_.isEmpty(nodes)) return []
    const itemNode = ['text', 'number', 'date', 'time', 'datetime', 'band', 'image', 'checkbox']
    const items: VueNode = nodes.find(node => node.tag === 'items') || new VueNode()
    const children = (items.children || []).filter(node => itemNode.includes(node.tag.slice(0, -5)))
    return children.map(child => {
      let header = new TableHeader()
      header.type = child.tag.slice(0, -5) as any
      header = this.setDefaultHeaderProps(header)
      header = { ...header, ...child.attrs }
      if (header.type === 'band') header.children = this.getHeaders(child.children)
      return header
    })
  }
  private setDefaultHeaderProps(header: TableHeader) {
    switch (header.type) {
      case 'band':
        header.headerAlign = 'center'
        break
      case 'number':
        header.headerAlign = 'right'
        header.align = 'right'
        header.format = v => numeral(v).format('0,0[.]00')
        break
      case 'date':
        header.format = v => (moment(v).isValid() ? moment(v).format('DD/MM/YYYY') : '')
        break
      case 'time':
        header.format = v => (moment(v).isValid() ? moment(v).format('HH:mm:ss') : '')
        break
      case 'datetime':
        header.format = v => (moment(v).isValid() ? moment(v).format('DD/MM/YYYY HH:mm:ss') : '')
        break
      case 'image':
        header.format = v => `<img src="${v}" />`
        header.headerAlign = 'center'
        header.align = 'center'
        header.encodeHtml = false
        break
      case 'checkbox':
        header.format = v => `<input type="checkbox" class="n-checkbox" disabled ${v ? 'checked' : ''} /><label></label>`
        header.headerAlign = 'center'
        header.align = 'center'
        header.encodeHtml = false
        break
    }
    return header
  }

  private get headers() {
    //Headers from slot
    let headers: TableHeader[] = this.getHeaders()
    //Headers from items
    if (_.isEmpty(headers) && !_.isEmpty(this.vItems)) {
      headers = Object.keys(this.vItems[0]).map(key => {
        return { ...new TableHeader(), ...{ text: _.startCase(key), value: key } }
      })
    }
    //expansion
    if (this.expandable)
      headers.unshift({
        ...new TableHeader(),
        ...{
          text: '',
          value: '__expansion',
          width: '36px',
          headerAlign: 'center',
          align: 'center'
        }
      })
    //selection
    if (this.selectable)
      headers.unshift({
        ...new TableHeader(),
        ...{
          text: '',
          value: '__selection',
          width: '36px',
          headerAlign: 'center',
          align: 'center'
        }
      })
    //action
    if (this.updatable || this.deletable)
      headers.push({
        ...new TableHeader(),
        ...{
          text: 'Tác vụ',
          value: '__action',
          width: '96px',
          headerAlign: 'center',
          align: 'center'
        }
      })
    headers = this.appendGroupHeaders(headers)
    return headers
  }
  private appendGroupHeaders(headers: TableHeader[]) {
    if (_.isEmpty(headers) || _.isEmpty(this.groupBy)) return headers

    const groupHeaders = this.groupBy.map(g => {
      const found = headers.find(header => header.value === g) || new TableHeader()
      return { ...found, ...{ value: g }, children: undefined } as TableHeader
    })
    const result = headers.filter(header => !this.groupBy.includes(header.value))
    return groupHeaders.concat(result)
  }
  get tableColumns() {
    return this.getHeadersChildren()
  }
  get tableColumnsLength() {
    return this.tableColumns.length
  }
  get headersCollection() {
    const collection = this.convertHeaders(this.headers)
    return collection
  }
  private convertHeaders(headers: TableHeader[]) {
    const rows = this.getHeadersLevel(headers)
    const result = _.range(rows).map(index => {
      const level = index + 1
      return this.getheadersAtLevel(level).map(h => ({
        ...h,
        _rowspan: h.children ? this.getHeadersLevel(h.children).length : rows,
        _colspan: h.children ? this.getHeadersChildren(h.children).length : 1
      }))
    })
    return result
  }
  //Helper
  private getHeadersLevel(value: any[] = this.headers, childrenField = 'children') {
    const hasChildren = value.filter(o => !_.isNil(o[childrenField]))
    if (hasChildren.length <= 0) return 1
    return Array.isArray(value) ? 1 + Math.max(...hasChildren.map(o => this.getHeadersLevel(o[childrenField], childrenField))) : 0
  }
  private getheadersAtLevel(level = 1, childrenField = 'children'): TableHeader[] {
    let ar: any = this.headers
    for (let i = 1; i < level; i++) ar = ar.filter((a: any) => !_.isNil(a[childrenField])).flatMap((a: any) => a[childrenField])
    return ar
  }
  private getHeadersChildren(array: any[] = this.headers, childrenField = 'children'): TableHeader[] {
    let save: any[] = []
    array.forEach((item: any) => {
      if (_.isNil(item[childrenField])) save.push(item)
      if (Array.isArray(item[childrenField])) save = save.concat(this.getHeadersChildren(item[childrenField], childrenField))
    })
    return save
  }
}
