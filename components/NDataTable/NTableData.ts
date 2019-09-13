import { Component, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import NData from '../Base/NData'
import NTableProp from './NTableProp'
import { TableItem } from '../../types/Table'
@Component({})
export default class NTableData extends Mixins(NBase, NData, NTableProp) {
  vSearch: string = ''
  vItemPerPage: number = 10
  vPage: number = 1
  vExpansion: number[] = []

  get computedItems(): TableItem[] {
    return this.vItems.map((data, index) => {
      return { index, data }
    })
  }

  itemsExpanded(items: TableItem[]) {
    const itemsIndex = items.map(item => item.index)
    this.vExpansion
      .filter(itemIndex => itemsIndex.includes(itemIndex))
      .sort()
      .forEach((itemIndex, index) => {
        const idx = items.findIndex(item => item.index === itemIndex)
        if (idx >= 0) items.splice(idx + 1, 0, { ...items[itemIndex], isExpansion: true })
      })
    return items
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
    return items
  }
  itemsPaginated(items: TableItem[]) {
    if (this.vItemPerPage <= 0 || this.hideBottom) return items
    return items.slice(
      (this.vPage - 1) * this.vItemPerPage,
      this.vPage * this.vItemPerPage < this.itemsLength ? this.vPage * this.vItemPerPage : this.itemsLength
    )
  }
  get pageItems() {
    let items = this.computedItems
    items = this.itemsFiltered(items)
    items = this.itemsSearched(items)
    items = this.itemsSorted(items)
    items = this.itemsPaginated(items)
    console.log(items)

    items = this.itemsExpanded(items)
    console.log(items)

    return items
  }

  get pageLength() {
    return Math.ceil(this.itemsLength / this.vItemPerPage)
  }
}
