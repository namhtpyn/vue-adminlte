<template>
  <div :style="{ position: 'relative' }">
    <n-text-box
      v-if="searchable"
      :value="searchText"
      :class="{ 'sticky-search': stickySearch }"
      hint="Nhấn Enter để tìm kiếm"
      @keypress.enter.stop="e => (searchText = e.target.value)"
    ></n-text-box>
    <div>
      <span v-if="!hasData">Không có dữ liệu</span>
      <div id="component-tree-view"></div>
    </div>
    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-1x fa-fw">circle-o-notch</n-icon>
        <div class="small">Đang tải dữ liệu</div>
      </div>
    </n-overlay>
  </div>
</template>

<script lang="ts">
//todo this render dom way to much => need to rewrite without jquery
import { Component, Prop, Emit, Watch, Mixins, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import diacritics from 'remove-all-diacritics'
import NItems from './Base/NItems'
@Component({ inheritAttrs: false })
export default class NTree extends Mixins(NItems) {
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
  @ModelVar('input', 'value', [String, Number]) vValue!: string | number

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
        state: { opened: false, showed: true, selected: m[this.itemValue] === (this as any).value }
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
        this.vValue = data.selected[0]
        const node = this.vItems.find(o => _.isEqual(String(o[this.itemValue]), data.selected[0]))
        this.select(node)
      })
  }
  focusSelectedNode() {
    if (!this.vValue) return
    const node = this.theTree.jstree().get_node(this.vValue)
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
    foundItems = foundItems
      .concat(foundItems.flatMap(item => this.getParents(items, item)))
      .concat(foundItems.flatMap(item => this.getChildren(items, item)))
    foundItems = _.uniqBy(foundItems, this.itemValue)
    return foundItems
  }

  getParents(items: any[], item) {
    const parentID = item[this.parentKey]
    const parents = items.filter(i => _.isEqual(i[this.itemValue], parentID))
    //exclude found items
    items = _.differenceBy(items, parents, this.itemValue)
    if (_.isEmpty(parents)) return parents
    else return parents.concat(parents.flatMap(p => this.getParents(items, p)))
  }
  getChildren(items: any[], item) {
    const parentID = item[this.itemValue]
    const children = items.filter(i => _.isEqual(i[this.parentKey], parentID))
    //exclude found items
    items = _.differenceBy(items, children, this.itemValue)
    if (_.isEmpty(children)) return children
    else return children.concat(children.flatMap(p => this.getChildren(items, p)))
  }
}
</script>

<style scoped>
.sticky-search {
  position: sticky;
  top: 0px;
  z-index: 98;
  width: 100%;
}
div.form-group {
  margin-bottom: 0px;
}
</style>
