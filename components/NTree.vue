<template>
  <div style="position: relative;">
    <input type="text" v-if="searchable" class="form-control" v-model="searchText" placeholder="Tìm kiếm" />
    <div :style="{ 'overflow-y': fixedSearch ? 'scroll' : 'none', height: height }">
      <span v-if="!hasData">Không có dữ liệu</span>
      <div id="component-tree-view"></div>
    </div>
    <n-overlay absolute :value="loading">
      <n-icon css-class="fa-spin fa-5x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import axios from 'axios'
@Component({ inheritAttrs: false })
export default class NTree extends Vue {
  @Prop({ type: String, default: 'none' }) icon!: string
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) expandAll!: boolean
  @Prop({ type: Boolean, default: true }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) fixedSearch!: boolean
  @Prop({ type: Boolean, default: true }) autoRead!: boolean
  @Prop({ type: String }) height!: string
  @Prop({ type: Number, default: 0 }) expandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'parentID' }) parentKey!: string
  @Prop(String) readUrl

  @Model('input', [String, Number]) value!: string | number
  @Emit() input(e) {}
  @Emit() select(e) {}
  @Emit() error(e) {}
  @Emit() loaded(e) {
    if (this.expandAll) this.theTree.jstree().open_all()
    this.focusSelectedNode()
    if (this.searchable) this.focusSearch()
  }

  private items: any[] = []
  searchText: string = ''
  private theTree!: any
  loading: boolean = false

  get treeData() {
    if (_.isEmpty(this.items)) return []
    const root = this.items.find(i => !this.items.some(n => _.isEqual(n[this.itemValue], i[this.parentKey])))[this.parentKey]
    // const itemsMap = _.cloneDeep(this.items).map(m => {
    //   return {
    //     id: m[this.itemValue],
    //     text: m[this.itemText],
    //     parent: _.isEqual(m[this.parentKey], root) ? '#' : m[this.parentKey],
    //     state: {
    //       opened: false,
    //       showed: true,
    //       selected: _.isEqual(m[this.itemValue], this.value)
    //     }
    //   }
    // })
    // return itemsMap
    const itemsMap = _.cloneDeep(this.items).map(m => {
      return {
        id: m[this.itemValue],
        text: m[this.itemText],
        parentID: m[this.parentKey],
        state: { opened: false, showed: true }
      }
    })
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
    return !_.isEmpty(this.treeData)
  }
  async created() {
    if (this.autoRead) await this.read()
  }
  mounted() {
    this.theTree = $($(this.$el as any).find('#component-tree-view')) as any
    this.init()
  }
  @Watch('treeData')
  private onTreeDataChange(n, o) {
    this.init()
  }
  @Watch('readUrl')
  private onReadUrlChange(n, o) {
    if (this.autoRead) this.read()
  }
  async read() {
    if (_.isEmpty(this.readUrl)) return
    this.loading = true
    try {
      const res = await axios.get(this.readUrl)
      this.items = res.data
    } catch (e) {
      this.error(e)
    }
    this.loading = false
  }
  setItems(items: any[]) {
    this.items = items
  }
  private init() {
    if (this.theTree.hasClass('jstree')) this.theTree.jstree().destroy()
    this.theTree
      .jstree({
        types: {
          default: {
            icon: this.iconFa
          }
        },
        core: {
          data: this.treeData,
          multiple: this.multiple
        },
        plugins: ['types']
      })
      .on('loaded.jstree', this.loaded)
      .on('select_node.jstree', (e, data) => {
        this.input(data.selected[0])
        this.select(data.node.original)
      })
  }
  focusSelectedNode() {
    if (!this.value) return
    this.theTree.jstree().select_node(this.value)
    const node = this.theTree.jstree().get_node(this.value)
    if (node && !_.isEmpty(node.a_attr)) {
      $(this.$el)
        .find(`#${node.a_attr.id}`)
        .focus()
    }
  }
  focusSearch() {
    if (!this.searchable) return
    $(this.$el)
      .find('input')
      .focus()
  }
  private convertHereditaryToObject(arr, parent, level) {
    const result: Object[] = []
    if (!arr.some(i => i.parentID === parent)) return result
    const children = arr.filter(i => i.parentID === parent)
    children.forEach(v => {
      v.state.opened = level <= this.expandToLevel
      v.children = this.convertHereditaryToObject(arr, v.id, level + 1)
      if (!_.isEmpty(this.searchText)) {
        const isShow = v.text.toUpperCase().includes(this.searchText.toUpperCase()) || v.children.some(i => i.state.showed)
        v.state.showed = isShow
        v.state.opened = isShow
      }
      if (v.state.showed) result.push(v)
    })
    return result
  }
}
</script>

<style scoped></style>
