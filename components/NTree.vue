<template>
  <div :style="{ position: 'relative' }">
    <n-text-box
      v-if="searchable"
      v-model="searchText"
      :css-class="stickySearch ? 'sticky-search' : ''"
      hint="Nhấn Enter để tìm kiếm"
      @keypress.enter="search"
    ></n-text-box>
    <!-- <input
      type="text"
      v-if="searchable"
      :class="{ 'form-control': true, 'sticky-search': stickySearch }"
      v-model="searchText"
      placeholder="Tìm kiếm"
    /> -->
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
  itemMatchedSearch: any[] = []

  get treeData() {
    // if (_.isEmpty(this.items)) return []
    // const root = this.items.find(i => !this.items.some(n => _.isEqual(n[this.itemValue], i[this.parentKey])))[this.parentKey]
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
    if (_.isEmpty(this.vItems)) return []
    const root = this.vItems.find(i => !this.vItems.some(n => _.isEqual(n[this.itemValue], i[this.parentKey])))[this.parentKey]
    const itemsMap = (!_.isEmpty(this.itemMatchedSearch) ? this.itemMatchedSearch : this.vItems).map(m => {
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
  private onTreeDataChange() {
    this.theTree.jstree().destroy()
    this.init()
  }
  @Watch('searchText')
  private onSearchText(n) {
    if (_.isEmpty(n)) this.itemMatchedSearch = []
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
    const result: Object[] = []
    if (!arr.some(i => i.parentID === parent)) return result
    const children = arr.filter(i => i.parentID === parent)
    children.forEach(v => {
      const node = _.cloneDeep(v)
      node.state.opened = level <= this.expandToLevel
      node.children = this.convertHereditaryToObject(arr, v.id, level + 1)
      result.push(node)
    })
    return result
  }

  search(e) {
    if (_.isEmpty(this.searchText)) return
    let result = []
    const idMatches = this.vItems.filter(o => o[this.itemText].toUpperCase().includes(this.searchText.toUpperCase()))
    idMatches.forEach(o => {
      const parents = this.getParents(o[this.parentKey])
      const children = this.getChildren(o[this.itemValue])
      result = _.union(result, parents, children, [String(o[this.itemValue])])
    })
    this.itemMatchedSearch = this.vItems.filter(o => result.includes(String(o[this.itemValue])))
  }

  getParents(parentID) {
    const result = []
    let node = _.cloneDeep(this.vItems.find(o => _.isEqual(o[this.itemValue], parentID)))
    while (!_.isEmpty(node)) {
      result.push(String(node[this.itemValue]))
      node = _.cloneDeep(this.vItems.find(o => _.isEqual(o[this.itemValue], node[this.parentKey])))
    }
    return result
  }

  getChildren(id) {
    const result = []
    const children = this.vItems.filter(o => _.isEqual(o[this.parentKey], id))
    if (_.isEmpty(children)) return result
    children.forEach(o => {
      const node = _.cloneDeep(o)
      result.push(String(node[this.itemValue]), this.getChildren(node[this.itemValue]))
    })
    return _.flattenDeep(result)
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
