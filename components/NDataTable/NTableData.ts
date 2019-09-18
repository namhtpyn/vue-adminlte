import { Component, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import NData from '../Base/NData'
import NTableProp from './NTableProp'
import { TableItem, TableSort, TableHeader, TableFilter } from '../../types/Table'
import natsort from 'natsort'
import diacritics from 'remove-all-diacritics'
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
          : diacritics.remove(field.toString().toUpperCase()).includes(diacritics.remove(this.vSearch.toUpperCase()))
      )
    )
  }
  itemsSorted(items: TableItem[]) {
    if (_.isEmpty(this.vSort) && _.isEmpty(this.groupBy)) return items
    const sortAsc = natsort({ insensitive: true })
    const sortDesc = natsort({ desc: true, insensitive: true })
    const sortArray = this.groupBy.map(f => new TableSort(f)).concat(this.vSort)
    items.sort((a, b) => {
      for (const sort of sortArray) {
        const sortOrder = sort.desc
          ? sortDesc(a.data[sort.name], b.data[sort.name])
          : sortAsc(a.data[sort.name], b.data[sort.name])
        return sortOrder
      }
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

  itemsGrouped(items: TableItem[]) {
    if (_.isEmpty(this.groupBy)) return items
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
    items = this.itemsGrouped(items)
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

  validGroupBy() {
    if (!_.isEmpty(this.groupBy)) return []
    //let groupBy = this.headerColumns().map(this.groupBy
  }
}
