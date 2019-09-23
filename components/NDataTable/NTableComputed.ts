import { Component, Mixins } from 'vue-property-decorator'
import { VueNode } from '../../extension/VueSlot'
import { TableHeader } from '../../types/Table'
import moment from 'moment'
import numeral from 'numeral'
import _ from 'lodash'
import NDataSource from './../Base/NDataSource'
import NTableProp from './NTableProp'

@Component({})
export default class NTableComputed extends Mixins(NDataSource, NTableProp) {
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
  private appendGroupHeaders(headers: TableHeader[]) {
    if (_.isEmpty(headers) || _.isEmpty(this.groupBy)) return headers

    const groupHeaders = this.groupBy.map(g => {
      const found = headers.find(header => header.value === g) || new TableHeader()
      return { ...found, ...{ value: g }, children: undefined } as TableHeader
    })
    const result = headers.filter(header => !this.groupBy.includes(header.value))
    return groupHeaders.concat(result)
  }
  get headersFromTag(): TableHeader[] {
    return this.getHeaders()
  }
  get headersFromItem(): TableHeader[] {
    if (_.isEmpty(this.vItems)) return []
    return Object.keys(this.vItems[0]).map(key => {
      return { ...new TableHeader(), ...{ text: _.startCase(key), value: key } }
    })
  }

  get headers() {
    //Headers from slot
    let headers: TableHeader[] = this.headersFromTag
    //Headers from items
    if (_.isEmpty(headers)) headers = this.headersFromItem

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
  get groupBy() {
    return this.headersFromTag.filter(h => h.grouped).map(h => h.value) || []
  }
}
