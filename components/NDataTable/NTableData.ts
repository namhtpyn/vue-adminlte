import { Component, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { TableItem, TableSort, TableHeader, TableFilter } from '../../types/Table'
import natsort from 'natsort'
import diacritics from 'remove-all-diacritics'
import NTableComputed from './NTableComputed'
@Component({})
export default class NTableData extends Mixins(NTableComputed) {
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
    if (index < 0) this.multipleSort ? this.vSort.push(new TableSort(header.value)) : (this.vSort = [new TableSort(header.value)])
    else if (!this.vSort[index].desc) this.vSort.splice(index, 1, new TableSort(header.value, true))
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
    const sortArray = this.groupBy
      .map(f => new TableSort(f.value))
      .concat(this.mergeBy.map(f => new TableSort(f.value)))
      .concat(this.vSort)
    items.sort((a, b) => {
      for (const sort of sortArray) {
        const sortOrder = sort.desc
          ? sortDesc(a.data[sort.name], b.data[sort.name])
          : sortAsc(a.data[sort.name], b.data[sort.name])
        if (sortOrder != 0) return sortOrder
      }
      return 0
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
    items = items.reduce(
      (ar, item) => ar.concat(item, { ...item, type: 'expand', visible: this.vExpansion.includes(item.index) }),
      [] as TableItem[]
    )
    return items
  }

  itemsGrouped(items: TableItem[]) {
    if (_.isEmpty(this.groupBy)) return items
    this.groupBy.forEach((group, index) => {
      items = items.reduce(
        (ar, item) => {
          if (item.type === 'item') {
            if (_.isEmpty(ar) || _.last(ar).data[group.value] !== item.data[group.value] || _.last(ar).type === 'group')
              ar = ar.concat({ ...item, type: 'group', group: { text: item.data[group.value], header: group, level: index } })
          }
          return ar.concat(item)
        },
        [] as TableItem[]
      )
    })
    return items
  }
  vMergedItems: { [key: string]: { index: number; value: any; rowspan: number }[] } = {}
  getMergedRowSpan(field, rowIndex) {
    try {
      return this.vMergedItems[field].find(o => o.index === rowIndex).rowspan
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return 1
  }
  getMergedShow(field, rowIndex) {
    try {
      if (Object.keys(this.vMergedItems).includes(field) && !this.vMergedItems[field].find(o => o.index === rowIndex))
        return false
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return true
  }
  itemsMerged(items: TableItem[]) {
    if (_.isEmpty(this.mergeBy)) return items
    this.vMergedItems = {}
    items.forEach((item, itemIndex) => {
      if (item.type === 'item')
        this.mergeBy.forEach(merge => {
          if (
            !_.isNil(item.data[merge.value]) &&
            !_.isEqual(
              item.data[merge.value],
              this.vMergedItems[merge.value] &&
                _.last(this.vMergedItems[merge.value]) &&
                _.last(this.vMergedItems[merge.value]).value
            )
          ) {
            const last = _.last(this.vMergedItems[merge.value])
            if (last) last.rowspan = itemIndex - last.index
            if (_.isEmpty(this.vMergedItems[merge.value])) this.vMergedItems[merge.value] = []
            this.vMergedItems[merge.value].push({ index: itemIndex, value: item.data[merge.value], rowspan: 1 })
          }
        })
      else {
        Object.keys(this.vMergedItems).forEach(k => {
          const m = this.vMergedItems[k]
          if (_.isEmpty(m)) return
          const last = _.last(m)
          if (last) last.rowspan = itemIndex - last.index
        })
      }
    })
    Object.keys(this.vMergedItems).forEach(k => {
      const m = this.vMergedItems[k]
      if (_.isEmpty(m)) return
      const last = _.last(m)
      if (last) last.rowspan = items.length - last.index
    })
    return items
  }
  get tableItems(): TableItem[] {
    let items: TableItem[] = this.vItems.map((data, index) => {
      return new TableItem(index, data)
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
    items = this.itemsMerged(items)
    items = items.filter(item => item.visible)
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
