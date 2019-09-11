import { Component, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from '../Base/NBase'
import NData from '../Base/NData'
import NTableProp from './NTableProp'
@Component({})
export default class NTableData extends Mixins(NBase, NData, NTableProp) {
  vSearch: string = ''
  vItemPerPage: number = 10
  vPage: number = 1

  itemsFiltered(items: any) {
    return items
  }
  itemsSearched(items: any) {
    if (_.isEmpty(this.vSearch)) return items
    return items.filter(item =>
      Object.values(item).some(field =>
        _.isNil(field)
          ? false
          : field
              .toString()
              .toUpperCase()
              .includes(this.vSearch.toUpperCase())
      )
    )
  }
  itemsSorted(items: any) {
    return items
  }
  itemsPaginated(items: any) {
    if (this.vItemPerPage <= 0 || this.hideBottom) return items
    return items.slice(
      (this.vPage - 1) * this.vItemPerPage,
      this.vPage * this.vItemPerPage < this.itemsLength ? this.vPage * this.vItemPerPage : this.itemsLength
    )
  }
  get pageItems() {
    let items = this.vItems
    items = this.itemsFiltered(items)
    items = this.itemsSearched(items)
    items = this.itemsSorted(items)
    items = this.itemsPaginated(items)

    return items
  }

  get pageLength() {
    console.log(this.itemsLength, this.vItemPerPage, this.vPage)
    return Math.ceil(this.itemsLength / this.vItemPerPage)
  }
}
