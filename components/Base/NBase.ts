import { Vue, Component, Emit } from 'vue-property-decorator'
import VueSlot from '../../extension/VueSlot'
@Component({})
export default class NBase extends Vue {
  vSlot: VueSlot = new VueSlot([])
  vLoading: boolean = false
  mounted() {
    this.vSlot = new VueSlot(this.$slots.default)
  }
  @Emit() async input(e) {}
  @Emit() async error(e) {}
}
