import { Component, Mixins } from 'vue-property-decorator'
import { VueNode } from '../../extension/VueSlot'
import { TableHeader } from '../../types/Table'
import NBase from '../Base/NBase'
import _ from 'lodash'
import NTableProp from './NTableProp'
import NData from './../Base/NData'

@Component({})
export default class NTableHeader extends Mixins(NBase, NData, NTableProp) {
  private getHeaders(nodes: VueNode[] = this.vSlot.data) {
    if (_.isEmpty(nodes)) return []
    const itemNode = ['text-item', 'number-item', 'date-item', 'band-item']
    const items: VueNode = nodes.find(node => node.tag === 'items') || new VueNode()
    const children = (items.children || []).filter(node => itemNode.includes(node.tag))
    return children.map(child => {
      const header: TableHeader = { ...{ text: '', value: '', headerValign: 'center' }, ...child.attrs }
      header.type = child.tag.slice(0, -5)
      if (child.tag === 'band-item') {
        header.children = this.getHeaders(child.children)
      }
      return header
    })
  }

  private headerRows(value: any[] = this.headers, childrenField = 'children') {
    const hasChildren = value.filter(o => !_.isNil(o[childrenField]))
    if (hasChildren.length <= 0) return 1
    return Array.isArray(value) ? 1 + Math.max(...hasChildren.map(o => this.headerRows(o[childrenField], childrenField))) : 0
  }
  private headersLevel(level = 1, childrenField = 'children') {
    let ar: any = this.headers
    for (let i = 1; i < level; i++) ar = ar.filter((a: any) => !_.isNil(a[childrenField])).flatMap((a: any) => a[childrenField])
    return ar
  }
  private headerColumns(array: any[] = this.headers, childrenField = 'children') {
    let save: any[] = []
    array.forEach((item: any) => {
      if (_.isNil(item[childrenField])) save.push(item)
      if (Array.isArray(item[childrenField])) save = save.concat(this.headerColumns(item[childrenField], childrenField))
    })
    return save
  }
  private get headers() {
    //Headers from slot
    let headers: TableHeader[] = this.getHeaders()
    //Headers from items
    if (_.isEmpty(headers) && !_.isEmpty(this.vItems)) {
      headers = Object.keys(this.vItems[0]).map(key => {
        return { text: _.startCase(key), value: key }
      })
    }
    //expansion
    if (this.expandable)
      headers.unshift({
        text: '',
        value: '$expansion',
        width: '36px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })
    //selection
    if (this.selectable)
      headers.unshift({
        text: '',
        value: '$selection',
        width: '36px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })
    //action
    if (this.updatable || this.deletable)
      headers.push({
        text: 'Tác vụ',
        value: '$action',
        width: '96px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })
    return headers
  }
  private headerColspan(header: TableHeader) {
    return header.children ? this.headerColumns(header.children).length : 1
  }
  private headerRowspan(header: TableHeader) {
    return header.children ? 1 : this.headerRows()
  }
}
