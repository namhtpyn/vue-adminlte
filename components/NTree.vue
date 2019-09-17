<template>
  <div :style="{ position: 'relative' }">
    <n-text-box v-if="searchable" v-model="searchText" :class="{ 'sticky-search': stickySearch }" hint="Tìm kiếm"></n-text-box>
    <div>
      <span v-if="!hasData">Không có dữ liệu</span>
      <div id="component-tree-view"></div>
    </div>
    <n-overlay absolute :value="vLoading">
      <n-icon css-class="fa-spin fa-4x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Model, Emit, Watch, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NDataSource from './Base/NDataSource'
import diacritics from 'remove-all-diacritics'
@Component({ inheritAttrs: false })
export default class NTree extends Mixins(NDataSource) {
  @Prop({ type: String, default: 'none' }) icon!: string
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) expandAll!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) stickySearch!: boolean
  @Prop({ type: Boolean, default: false }) noFocusOnLoaded!: boolean
  @Prop({ type: Number, default: 0 }) expandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'parentID' }) parentKey!: string

  @Model('input', [String, Number]) value!: string | number

  @Emit() select(e) {}
  @Emit() loaded(e) {
    if (this.expandAll || !_.isEmpty(this.searchText)) this.theTree.jstree().open_all()
    if (!this.noFocusOnLoaded) {
      this.focusSelectedNode()
      if (this.searchable) this.focusSearch()
    }
  }

  searchText: string = ''
  private theTree!: any

  get treeData() {
    if (_.isEmpty(this.vItems)) return []
    let items = _.cloneDeep(this.vItems)
    const root = items.find(i => !items.some(n => _.isEqual(n[this.itemValue], i[this.parentKey])))[this.parentKey]
    items = this.search(items, root)
    const itemsMap = items.map(m => {
      return {
        id: m[this.itemValue],
        text: m[this.itemText],
        parentID: m[this.parentKey],
        state: { opened: false, showed: true, selected: m[this.itemValue] === this.value }
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
  mounted() {
    this.theTree = $($(this.$el as any).find('#component-tree-view')) as any
    this.init()
  }
  @Watch('treeData')
  private onTreeDataChange(n) {
    Promise.resolve().then(() => {
      this.theTree.jstree().destroy()
      this.init()
    })
  }

  private init() {
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
        const node = this.vItems.find(o => _.isEqual(String(o[this.itemValue]), data.selected[0]))
        this.select(node)
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
  private convertHereditaryToObject(arr, parent, level) {
    let result: Object[] = []
    if (!arr.some(i => i.parentID === parent)) return result
    const children = arr.filter(i => i.parentID === parent)
    result = children.map(v => {
      v.state.opened = level <= this.expandToLevel
      v.children = this.convertHereditaryToObject(arr, v.id, level + 1)
      return v
    })
    return result
  }

  search(items, root) {
    if (_.isEmpty(this.searchText)) return items

    let foundItems = items.filter(i =>
      diacritics
        .remove(((i[this.itemText] as string) || '').toLowerCase())
        .includes(diacritics.remove(this.searchText.toLowerCase()))
    )
    //exclude found items
    items = _.differenceBy(items, foundItems, this.itemValue)
    foundItems = foundItems.concat(foundItems.flatMap(item => this.getParents(items, item, root)))

    return foundItems
  }

  getParents(items: any[], item, root) {
    const parentID = item[this.parentKey]
    const parents = items.filter(i => _.isEqual(i[this.itemValue], parentID))
    //exclude found items
    items = _.differenceBy(items, parents, this.itemValue)
    if (parentID === root) return parents
    else return parents.concat(parents.flatMap(p => this.getParents(items, p, root)))
  }
}
</script>

<style scoped>
.sticky-search {
  position: sticky;
  top: 0px;
  z-index: 99;
  width: 100%;
}
div.form-group {
  margin-bottom: 0px;
}
</style>
