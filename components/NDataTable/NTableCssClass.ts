import { Component, Mixins } from 'vue-property-decorator'
import NBase from '../Base/NBase'
import NTableProp from './NTableProp'
//import _ from 'lodash'

@Component({})
export default class NTableCssClass extends Mixins(NBase, NTableProp) {
  private get cssClass() {
    const cssClass: any = this.vSlot.data.find(e => e.tag === 'css-class') || {}
    return {
      ...cssClass,
      table:
        'table no-margin ' +
          (this.bordered ? 'table-bordered ' : '') +
          (this.hovered ? 'table-hover ' : '') +
          (this.densed ? 'table-condensed ' : '') +
          (this.striped ? 'table-striped ' : '') +
          cssClass.table || ''
    }
  }
}
