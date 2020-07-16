import { Component, Mixins } from '@namhoang/vue-property-decorator'
import { TableHeader } from '../../types/Table'
import moment from 'moment'
import numeral from 'numeral'
import _ from 'lodash'
import NTableProp from './NTableProp'
import { VNode } from 'vue'
import NItems from '../Base/NItems'
import camelcaseKeys from '../Base/camelcaseKeys'

@Component({})
export default class NTableComputed extends Mixins(NItems, NTableProp) {
  private getHeaders(nodes: VNode[] | undefined = this.$slots && this.$slots.default) {
    if (_.isEmpty(nodes)) return []

    const items = nodes && nodes.find(node => node.tag === 'items')

    const children = ((items && items.children) || []).filter(node => node.tag && node.tag.endsWith('-item'))
    return children.map(child => {
      let header = new TableHeader()
      header.type = (child.tag && child.tag.slice(0, -5)) || 'text'
      header = this.setDefaultHeaderProps(header)
      header = { ...header, ...((child.data && camelcaseKeys(child.data.attrs)) || {}) }
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
        header.headerAlign = 'center'
        header.align = 'right'
        header.format = v => numeral(v).format('0,0[.]00')
        break
      case 'date':
        header.format = v => (v && moment(v).isValid() ? moment(v).format('DD/MM/YYYY') : v)
        break
      case 'time':
        header.format = v => (v && moment(v).isValid() ? moment(v).format('HH:mm:ss') : v)
        break
      case 'datetime':
        header.format = v => (v && moment(v).isValid() ? moment(v).format('DD/MM/YYYY HH:mm:ss') : v)
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

    const groupHeaders = this.groupBy.map(group => ({ ...group, children: undefined } as TableHeader))
    const result = headers.filter(h => !this.groupBy.some(g => _.isEqual(h, g)))
    return groupHeaders.concat(result)
  }
  get headersFromNode(): TableHeader[] {
    return this.getHeaders()
  }
  get headersFromItem(): TableHeader[] {
    if (_.isEmpty(this.vItems)) return []
    return Object.keys(this.vItems[0]).map(key => {
      return { ...new TableHeader(), ...{ text: key, value: key } }
    })
  }

  get headers() {
    //Headers from slot
    let headers: TableHeader[] = this.headersFromNode
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
  get groupBy(): TableHeader[] {
    return this.headersFromNode.filter(h => h.grouped) || []
  }
  get groupByLength() {
    return this.groupBy.length
  }
  isGrouped(name: string) {
    return this.groupBy.some(g => g.value === name)
  }
}
