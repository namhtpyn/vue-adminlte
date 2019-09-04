<template>
  <div>
    <input type="text" v-if="searchable" class="form-control" v-model="searchText" placeholder="Tìm kiếm" />
    <span v-if="!hasData">Không có dữ liệu</span>
    <div></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NTree extends Vue {
  @Prop({ type: Array, required: true }) items!: any[]
  @Prop({ type: String, default: 'none' }) icon!: string
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) expandAll!: boolean
  @Prop({ type: Boolean, default: true }) searchable!: boolean
  @Prop({ type: Number, default: 0 }) expandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'parentID' }) parentKey!: string

  @Model('input', [String, Number]) value!: string | number
  @Emit() input(e) {}
  @Emit() select(e) {}
  searchText: string = ''
  get treeData() {
    if (this.items.length === 0) return []
    const itemsMap = this.items
      .filter(m => m[this.itemText].toUpperCase().includes(this.searchText.toUpperCase()))
      .map(m => {
        return { id: m[this.itemValue], text: m[this.itemText], parentID: m[this.parentKey], state: { opened: false } }
      })
    if (itemsMap.length === 0) return []
    const root = itemsMap.reduce((cur, next) => {
      if (next) {
        if (cur > next.parentID) return next.parentID
        return cur
      }
    }, itemsMap[0].parentID)
    const convertData = this.convertHereditaryToObject(itemsMap, root, 1)
    return convertData
  }
  get iconFa() {
    let result = this.icon
    if (result !== 'none') {
      result = `fa fa-${this.icon}`
    }
    return result
  }
  get hasData() {
    return this.treeData.length > 0
  }
  theTree!: any
  mounted() {
    this.theTree = $($(this.$el as any).find('div')) as any
    this.init(this.treeData)
  }
  @Watch('treeData')
  onTreeDataChange(n, o) {
    if (o !== undefined) {
      this.init(n)
    }
  }
  init(data) {
    if (this.theTree.hasClass('jstree')) this.theTree.jstree().destroy()
    this.theTree
      .jstree({
        types: {
          default: {
            icon: this.iconFa
          }
        },
        core: {
          data: data,
          multiple: this.multiple
        },
        plugins: ['types', 'dnd']
      })
      .on('ready.jstree', this.setModel)
      .on('changed.jstree', (e, data) => {
        this.input(data.selected[0])
      })
      .on('select_node.jstree', (e, data) => {
        this.select(data.node.original)
      })
  }
  convertHereditaryToObject(arr, id, level) {
    const result: Object[] = []
    if (!arr.some(i => i.parentID === id)) {
      return result
    }
    const children = arr.filter(i => i.parentID === id)
    children.forEach(v => {
      v.state.opened = level <= this.expandToLevel
      v.children = this.convertHereditaryToObject(arr, v.id, level + 1)
      result.push(v)
    })
    return result
  }
  setModel(e) {
    if (this.expandAll) this.theTree.jstree().open_all()
    this.theTree.jstree().select_node(this.value)
  }
}
</script>

<style scoped></style>
