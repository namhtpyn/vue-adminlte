import { Vue, Component, Emit } from 'vue-property-decorator'
import VueSlot from '../../extension/VueSlot'
import _ from 'lodash'
@Component({})
export default class NBase extends Vue {
  vSlot: VueSlot = new VueSlot([])
  vLoading: boolean = false
  get mySlot() {
    return new VueSlot(this.$slots.default)
  }
  mounted() {
    this.vSlot = new VueSlot(this.$slots.default)
  }
  updateVSlot() {
    this.vSlot = new VueSlot(this.$slots.default)
  }
  @Emit() async input(e) {}
  @Emit() async error(e) {}
  setLoading(state: boolean) {
    this.vLoading = state
  }
  get isMobile() {
    return !_.isNil(window.orientation) || navigator.userAgent.indexOf('IEMobile') !== -1
  }
  get isLg() {
    return window.innerWidth >= 1200
  }
  get isMd() {
    return window.innerWidth >= 992
  }
  get isSm() {
    return window.innerWidth >= 768
  }
  get isXs() {
    return window.innerWidth < 768
  }
}
