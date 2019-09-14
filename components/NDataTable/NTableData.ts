import { Component, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import NData from '../Base/NData'
import NTableProp from './NTableProp'
import { TableItem, TableSort } from '../../types/Table'
@Component({})
export default class NTableData extends Mixins(NBase, NData, NTableProp) {
  vSearch: string = ''
  vItemPerPage: number = 10
  vPage: number = 1
  vExpansion: number[] = []
  vSort: TableSort[] = []

  isExpanded(itemIndex: number) {
    return this.vExpansion.includes(itemIndex)
  }

  get computedItems(): TableItem[] {
    return this.vItems.map((data, index) => {
      return { index, data }
    })
  }

  itemsFiltered(items: TableItem[]) {
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
    items.sort((a, b) => {
      const sort = this.vSort
        .map(sort => {
          if (a.data[sort.name] > b.data[sort.name]) return sort.desc ? -1 : 1
          else if (a.data[sort.name] < b.data[sort.name]) return sort.desc ? 1 : -1
          else return 0
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
  get pageItems() {
    let items = _.cloneDeep(this.computedItems)
    items = this.itemsFiltered(items)
    items = this.itemsSearched(items)
    items = this.itemsSorted(items)
    items = this.itemsPaginated(items)
    items = this.itemsExpanded(items)

    return items
  }

  get pageLength() {
    return Math.ceil(this.itemsLength / this.vItemPerPage)
  }
}
