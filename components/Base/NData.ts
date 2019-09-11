import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import _ from 'lodash'
@Component({})
export default class NData extends Vue {
  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  items: any[]

  created() {
    this.vItems = this.items
  }

  vItems: any[] = []

  @Watch('items')
  onPropItemsChanged(items) {
    this.vItems = items
  }
  @Watch('vItems')
  onVarItemsChanged(items) {
    this.$emit('update:items', items)
  }

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
}
