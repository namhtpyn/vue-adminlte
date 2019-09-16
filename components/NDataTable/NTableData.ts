import { Component, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import NData from '../Base/NData'
import NTableProp from './NTableProp'
import { TableItem, TableSort, TableHeader, TableFilter } from '../../types/Table'
import natsort from 'natsort'
@Component({})
export default class NTableData extends Mixins(NBase, NData, NTableProp) {
  vSearch: string = ''
  vItemPerPage: number = 10
  vPage: number = 1
  vExpansion: number[] = []
  vSort: TableSort[] = []
  vFilter: TableFilter[] = []

  isExpanded(itemIndex: number) {
    return this.vExpansion.includes(itemIndex)
  }
  private toggleSort(header: TableHeader) {
    if (!header.sortable) return
    const index = this.vSort.findIndex(sort => sort.name === header.value)
    if (index < 0) this.vSort.push(new TableSort(header.value))
    else if (!this.vSort[index].desc) this.vSort.splice(index, 1, { name: header.value, desc: true })
    else this.vSort.splice(index, 1)
  }
  getSort(header: TableHeader) {
    return this.vSort.find(sort => sort.name === header.value)
  }

  getFilterValue(header: TableHeader) {
    return (this.vFilter.find(f => f.name === header.value) || {}).value
  }
  isFiltered(header: TableHeader) {
    return this.vFilter.find(f => f.name === header.value) ? true : false
  }

  itemsFiltered(items: TableItem[]) {
    if (_.isEmpty(this.vFilter)) return items
    items = items.filter(item => {
      return !this.vFilter.map(filter => filter.value.includes(item.data[filter.name])).some(o => !o)
    })
    return items
  }
  itemsSearched(items: TableItem[]) {
    if (_.isEmpty(this.vSearch)) return items
    return items.filter(item =>
      Object.values(item.data).some(field =>
        _.isNil(field)
          ? false
          : field
              .toString()
              .toUpperCase()
              .includes(this.vSearch.toUpperCase())
      )
    )
  }
  itemsSorted(items: TableItem[]) {
    if (_.isEmpty(this.vSort)) return items
    const asc = natsort({ insensitive: true })
    const desc = natsort({ desc: true, insensitive: true })
    items.sort((a, b) => {
      const sort = this.vSort
        .map(sort => {
          return sort.desc ? desc(a.data[sort.name], b.data[sort.name]) : asc(a.data[sort.name], b.data[sort.name])
        })
        .filter(sort => _.isEmpty(sort))
      if (!_.isEmpty(sort)) return sort[0]
    })
    return items
  }
  itemsPaginated(items: TableItem[]) {
    if (this.vItemPerPage <= 0 || this.hideBottom) return items
    return items.slice(
      (this.vPage - 1) * this.vItemPerPage,
      this.vPage * this.vItemPerPage < this.itemsLength ? this.vPage * this.vItemPerPage : this.itemsLength
    )
  }
  itemsExpanded(items: TableItem[]) {
    if (!this.expandable || _.isEmpty(this.vExpansion)) return items
    const itemsIndex = items.map(item => item.index)
    this.vExpansion
      .filter(itemIndex => itemsIndex.includes(itemIndex))
      .forEach(itemIndex => {
        const idx = items.findIndex(item => item.index === itemIndex)
        if (idx >= 0) items.splice(idx + 1, 0, { ...items[idx], isExpansion: true })
      })
    return items
  }
  get tableItems(): TableItem[] {
    let items: TableItem[] = this.vItems.map((data, index) => {
      return { index, data }
    })
    items = this.itemsFiltered(items)
    items = this.itemsSearched(items)
    items = this.itemsSorted(items)
    return items
  }
  get pageItems() {
    let items = _.cloneDeep(this.tableItems)
    items = this.itemsPaginated(items)
    items = this.itemsExpanded(items)
    return items
  }

  get pageLength() {
    return this.vItemPerPage < 0 ? 1 : Math.ceil(this.tableItems.length / this.vItemPerPage)
  }

  @Watch('pageLength')
  onPageLengthChanged(n, o) {
    if (this.vPage === 0 && n > 0) this.vPage = 1
    else if (this.vPage > n) this.vPage = n
  }
}
