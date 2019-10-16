import { Component, Mixins } from '@namhoang/vue-property-decorator'
import NTableProp from './NTableProp'
import camelcaseKeys from '../Base/camelcaseKeys'

@Component({})
export default class NTableCssClass extends Mixins(NTableProp) {
  private get cssClass() {
    const cssNode = this.$slots && this.$slots.default && this.$slots.default.find(e => e.tag === 'css-class')
    const cssClass = (cssNode && cssNode.data && camelcaseKeys(cssNode.data.attrs)) || {}
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
