import { Component, Mixins } from 'vue-property-decorator'
import NBase from '../Base/NBase'
import NTableProp from './NTableProp'
//import _ from 'lodash'

@Component({})
export default class NTableCssClass extends Mixins(NBase, NTableProp) {
  private get cssClass() {
    const cssClass: any = this.vSlot.data.find(e => e.tag === 'css-class') || {}
    cssClass.top = {
      stickyTop: this.stickyTop,
      ...(cssClass.top || {})
    }
    cssClass.table = {
      tableBordered: this.bordered,
      tableHover: this.hovered,
      tableCondensed: this.densed,
      tableStriped: this.striped,
      ...(cssClass.table || {})
    }
    return cssClass
  }
}
