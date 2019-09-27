import { Component, Mixins } from 'vue-property-decorator'
import NBase from '../Base/NBase'

@Component({})
export default class NTableText extends Mixins(NBase) {
  private get tableText() {
    const tableText: any = (this.vSlot.data.find(e => e.tag === 'table-text') || {}).attrs || {}
    return {
      ...tableText,
      noData: 'Không có dữ liệu'
    }
  }
}
