import { Vue, Component } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
@Component({})
export default class NBase extends Vue {
  get isMobile() {
    return !_.isNil(window.orientation) || navigator.userAgent.indexOf('IEMobile') !== -1
  }

  vWindowWidth = window.innerWidth
  get isLg() {
    return this.vWindowWidth >= 1200
  }
  get isMd() {
    return this.vWindowWidth >= 992
  }
  get isSm() {
    return this.vWindowWidth >= 768
  }
  get isXs() {
    return this.vWindowWidth < 768
  }
  mounted() {
    window.addEventListener('resize', () => {
      this.vWindowWidth = window.innerWidth
    })
  }
}
