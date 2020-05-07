import { Component, Mixins } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import { TableHeader } from './../../types/Table'
import NTableComputed from './NTableComputed'
@Component({})
export default class NTableHeader extends Mixins(NTableComputed) {
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
        rowspan: h.rowspan ? h.rowspan : h.children ? 1 : rows - index,
        colspan: h.colspan ? h.colspan : h.children ? this.getHeadersChildren(h.children).length : 1
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
