import { Mixins, Component, Watch, Prop } from 'vue-property-decorator'
import _ from 'lodash'
import NData from './NData'
import NBase from './NBase'
import axios from 'axios'
@Component({})
export default class NDataSource extends Mixins(NBase, NData) {
  @Prop({ type: Boolean, default: true }) readonly autoRead!: boolean
  @Prop(String) readonly readUrl!: string

  created() {
    if (this.autoRead) this.read()
  }
  /**CRUD */
  @Watch('readUrl')
  private onReadUrlChanged() {
    if (this.autoRead) this.read()
  }
  async read() {
    if (_.isEmpty(this.readUrl)) return
    this.vLoading = true
    try {
      const res = await axios.get(this.readUrl)
      this.vItems = res.data
    } catch (e) {
      this.error(e)
    }
    this.vLoading = false
  }
}
