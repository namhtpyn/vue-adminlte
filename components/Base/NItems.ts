import _ from 'lodash'
import axios from 'axios'
import { Vue, Component, Watch, Prop, Emit, PropVar } from '@namhoang/vue-property-decorator'
@Component({})
export default class NItems extends Vue {
  @PropVar('loading', { type: Boolean, default: false }) vLoading!: boolean
  setLoading(state: boolean) {
    this.vLoading = state
  }

  @PropVar('items', { type: Array, default: () => [] }) vItems!: any[]
  get hasItems() {
    return !_.isEmpty(this.vItems)
  }
  get itemsLength() {
    if (_.isEmpty(this.vItems)) return 0
    else return this.vItems.length
  }
  setItems(items: any[]) {
    this.vItems = _.cloneDeep(items)
  }

  @Prop({ type: Boolean, default: true }) readonly readable!: boolean
  @Prop({ type: Boolean, default: true }) readonly autoRead!: boolean
  @Prop(String) readonly readUrl!: string
  @Emit() async error(e) {}
  /**CRUD */
  @Watch('readUrl', { immediate: true })
  private onReadUrlChanged(n, o) {
    if (this.autoRead) this.read()
  }
  async read() {
    if (!this.readable) return
    if (_.isEmpty(this.readUrl)) return
    if (this.vLoading) return
    this.vLoading = true
    try {
      const res = await axios.get(this.readUrl)
      this.vItems = res.data
      this.$emit('readed', true)
    } catch (e) {
      this.error(e)
    }
    this.vLoading = false
  }
}
