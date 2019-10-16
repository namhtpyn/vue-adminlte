import { Component, Vue } from '@namhoang/vue-property-decorator'
import camelcaseKeys from '../Base/camelcaseKeys'

@Component({})
export default class NTableText extends Vue {
  private get tableText() {
    const textNode = this.$slots && this.$slots.default && this.$slots.default.find(e => e.tag === 'table-text')
    const text = (textNode && textNode.data && camelcaseKeys(textNode.data.attrs)) || {}
    return {
      noData: 'Không có dữ liệu',
      ...text
    }
  }
}
