import { Component, Mixins } from 'vue-property-decorator'
import NBase from '../Base/NBase'
import NTableProp from './NTableProp'
//import _ from 'lodash'

@Component({})
export default class NTableCssClass extends Mixins(NBase, NTableProp) {
  private get cssClass() {
    const cssClass: any = this.vSlot.data.find(e => e.tag === 'css-class') || {}
    cssClass.top = [
      {
        'sticky-top': this.stickyTop
      },
      cssClass.top
    ]
    cssClass.table = [
      {
        'table-bordered': this.bordered,
        'table-hover': this.hovered,
        'table-condensed': this.densed,
        'table-striped': this.striped
      },
      cssClass.table
    ]
    return cssClass
  }
}
