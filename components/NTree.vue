<template>
  <div :style="{ position: 'relative', 'overflow-y': 'auto', height: height }">
    <input
      type="text"
      v-if="searchable"
      :class="{ 'form-control': true, 'sticky-search': stickySearch }"
      v-model="searchText"
      placeholder="Tìm kiếm"
    />
    <div>
      <span v-if="!hasData">Không có dữ liệu</span>
      <div id="component-tree-view"></div>
    </div>
    <n-overlay absolute :value="vLoading">
      <n-icon css-class="fa-spin fa-5x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Model, Emit, Watch, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NDataSource from './Base/NDataSource'
@Component({ inheritAttrs: false })
export default class NTree extends Mixins(NDataSource) {
  @Prop({ type: String, default: 'none' }) icon!: string
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) expandAll!: boolean
  @Prop({ type: Boolean, default: true }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) stickySearch!: boolean
  @Prop({ type: Boolean, default: true }) autoRead!: boolean
  @Prop({ type: String }) height!: string
  @Prop({ type: Number, default: 0 }) expandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'parentID' }) parentKey!: string

  @Model('input', [String, Number]) value!: string | number

  @Emit() select(e) {}
  @Emit() loaded(e) {
    if (this.expandAll) this.theTree.jstree().open_all()
  }

  searchText: string = ''
  private theTree!: any

  get treeData() {
    if (_.isEmpty(this.vItems)) return []
    const itemsMap = _.cloneDeep(this.vItems).map(m => {
      return {
        id: m[this.itemValue],
        text: m[this.itemText],
        parentID: m[this.parentKey],
        state: { opened: false, matched: true }
      }
    })
    if (_.isEmpty(this.vItems)) return []
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
    return !_.isEmpty(this.treeData)
  }
  mounted() {
    this.theTree = $($(this.$el as any).find('#component-tree-view')) as any
    this.init(this.treeData)
  }
  @Watch('treeData')
  private onTreeDataChange(n, o) {
    if (o !== undefined) {
      this.init(n)
    }
  }

  private init(data) {
    if (this.theTree.hasClass('jstree')) {
      this.theTree.jstree().destroy()
    }
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
        plugins: ['types']
      })
      .on('ready.jstree', this.loaded)
      .on('select_node.jstree', (e, data) => {
        this.input(data.selected[0])
        this.select(data.node.original)
      })
  }
  focusSelectedNode() {
    if (!this.value) return
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
  private convertHereditaryToObject(arr, idRoot, level) {
    const result: Object[] = []
    if (!arr.some(i => i.parentID === idRoot)) return result

    const children = arr.filter(i => i.parentID === idRoot)
    children.forEach(v => {
      v.state.selected = v.id === this.value
      v.state.opened = level <= this.expandToLevel
      v.children = this.convertHereditaryToObject(arr, v.id, level + 1)
      if (!_.isEmpty(this.searchText)) {
        const matchSearch = v.text.toUpperCase().includes(this.searchText.toUpperCase())
        v.state.matched = matchSearch
        v.state.opened = matchSearch || v.children.some(c => c.state.matched)
      }
      if (v.state.matched || v.children.some(c => c.state.matched)) result.push(v)
    })
    return result
  }
}
</script>

<style scoped>
.sticky-search {
  position: sticky;
  top: 0px;
  z-index: 99;
}
</style>
