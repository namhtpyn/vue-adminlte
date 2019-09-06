<template>
  <div style="position:relative">
    <div v-if="!hideTop" class="tbl-header">
      <slot name="top.prepend"></slot>
      <slot name="top">
        <div class="title" v-if="caption" style="flex:auto">{{ caption }}</div>
        <div v-if="searchable" class="has-feedback" style="flex:auto">
          <div class="has-feedback">
            <input type="text" class="form-control" v-model="searchText" />
            <span class="glyphicon glyphicon-search form-control-feedback"></span>
          </div>
        </div>
        <div v-if="!caption && !searchable" style="flex:auto"></div>
        <div v-if="creatable">
          <n-btn @click="createClick">
            <n-icon>plus</n-icon>
            <span class="hidden-xs">Thêm</span>
          </n-btn>
        </div>
      </slot>
      <slot name="top.append"></slot>
    </div>

    <div class="table-responsive">
      <table :class="cssClass.table">
        <thead v-if="!hideHeader">
          <tr :class="cssClass.headerRow" v-for="headerRow in headerRows()" :key="headerRow">
            <th
              v-for="(header, colIndex) in headersLevel(headerRow)"
              :key="colIndex"
              :colspan="headerColspan(header)"
              :rowspan="headerRowspan(header)"
              :class="cssClass.headerCell"
              :style="headerCellStyle(header)"
            >
              <div v-if="header.value === '$selection'">
                <n-checkbox v-if="multiple" @input="checkAll"></n-checkbox>
              </div>
              <slot v-else :name="`header.${header.value}`" :item="header">{{ header.text }}</slot>
            </th>
          </tr>
        </thead>
        <tbody v-if="hasItems">
          <tr
            :class="cssClass.row"
            v-for="(item, rowIndex) in pageItems"
            :key="rowIndex"
            @contextmenu="e => rowContextmenu(e, item)"
            @dblclick="e => rowDblclick(e, item)"
            @click="e => rowClick(e, item)"
          >
            <td :class="cssClass.cell" :style="cellStyle(header)" v-for="(header, colIndex) in headerColumns()" :key="colIndex">
              <div v-if="header.value === '$selection'">
                <n-checkbox v-if="multiple" @input="input" :model="value" :value="keyField ? item[keyField] : item"></n-checkbox>
                <n-radio v-else @input="input" :model="value" :value="keyField ? item[keyField] : item"></n-radio>
              </div>
              <div v-else-if="header.value === '$expansion'">
                <n-icon style="cursor:pointer" @click="expandRow(rowIndex)">chevron-down</n-icon>
              </div>
              <div v-else-if="header.value === '$action'">
                <n-btn v-if="updatable" @click="updateClick(item)">
                  <n-icon>pencil</n-icon>
                </n-btn>
                <n-btn v-if="deletable" @click="remove(item)">
                  <n-icon>trash</n-icon>
                </n-btn>
              </div>

              <slot v-else :name="`item.${header.value}`" :item="item">{{ formatItemValue(item, header) }}</slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="headerColumns().length" class="text-center">{{ noDataText }}</td>
          </tr>
        </tbody>
        <tfoot v-if="!hideFooter">
          <tr :class="cssClass.footerRow">
            <td :class="cssClass.footerCell" v-for="(header, colIndex) in headerColumns()" :key="colIndex">
              <slot :name="`footer.${header.value}`" :item="items">
                {{ footerSummary(items, header) }}
              </slot>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="!hideBottom" style="display:flex; padding:10px 5px; align-items: center;">
      <slot name="bottom.prepend"></slot>
      <slot name="bottom">
        <div class="hidden-xs" style="height: 30px;min-height: 32px;padding: 6px 10px 6px 0px;font-size: 12px; line-height: 1.5;">
          Trang {{ page }}/{{ pageLength }} ({{ items.length }} mục)
        </div>

        <div style="flex:auto">
          <n-pagination :length="pageLength" v-model="page" small class="no-margin"></n-pagination>
        </div>
        <div>
          <select
            @change="changeItemPerPage"
            class="form-control"
            style="width:70px;display: inline-block; height:30px;  padding: 6px 6px"
            :value="itemPerPage"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="-1">Tất cả</option>
          </select>
        </div>
      </slot>
      <slot name="bottom.append"></slot>
    </div>

    <!-- Table loading -->
    <n-overlay absolute :value="loading">
      <n-icon css-class="fa-spin fa-5x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>

    <n-modal
      :loading="modal.isLoading"
      v-if="updatable || creatable"
      :caption="modal.isNew ? 'Thêm' : 'Sửa'"
      v-model="modal.visible"
    >
      <slot name="modal" :modal="modal"></slot>
      <template v-slot:footer>
        <n-btn color="primary" @click="save">Lưu</n-btn>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from 'vue-property-decorator'
import { TableHeader } from '../types/Table'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import cloneDeep from 'lodash/cloneDeep'
import upperFirst from 'lodash/upperFirst'
import NPagination from './NPagination.vue'
import NBtn from './NBtn.vue'
import NIcon from './NIcon.vue'
import NModal from './NModal.vue'
import NCheckbox from './NCheckbox.vue'
import NRadio from './NRadio.vue'
import NOverlay from './NOverlay.vue'
import { VNode } from 'vue'
import camelCase from 'lodash/camelCase'
@Component({
  inheritAttrs: false,
  components: { NPagination, NBtn, NIcon, NModal, NCheckbox, NRadio, NOverlay }
})
export default class NDataTable extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean

  @Prop({ type: Boolean, default: true }) bordered!: boolean
  @Prop({ type: Boolean, default: true }) hovered!: boolean
  @Prop({ type: Boolean, default: false }) densed!: boolean
  @Prop({ type: Boolean, default: false }) striped!: boolean

  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) expandable!: boolean
  @Prop({ type: Boolean, default: false }) selectable!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) creatable!: boolean
  @Prop({ type: Boolean, default: false }) updatable!: boolean
  @Prop({ type: Boolean, default: false }) deletable!: boolean

  @Prop({ type: Boolean, default: false }) hideBottom!: boolean
  @Prop({ type: Boolean, default: false }) hideTop!: boolean
  @Prop({ type: Boolean, default: false }) hideFooter!: boolean
  @Prop({ type: Boolean, default: false }) hideHeader!: boolean

  @Prop(String) caption!: string
  @Prop({ type: String, default: 'Không có dữ liệu' }) noDataText!: string
  @Prop(String) keyField!: string

  @Prop(Array) headers: TableHeader[]
  @Prop(Array) items: any[]

  @Model('input', { type: [Array, String, Number, Boolean, Object] }) value!: any[] | any
  @Emit() input(e) {}

  createClick(e) {
    this.modal.visible = true
    this.modal.data = {}
    this.modal.isNew = true
    this.modal.isLoading = false
    this.$emit('create-click', this.modal)
  }
  updateClick(e) {
    this.modal.visible = true
    this.modal.data = cloneDeep(e)
    this.modal.isNew = false
    this.modal.isLoading = false
    this.$emit('update-click', this.modal)
  }
  rowClick(event, item) {
    //console.log(event)
    this.$emit('row-click', { event, item })
  }
  rowDblclick(event, item) {
    this.$emit('row-dblclick', { event, item })
  }
  rowContextmenu(event, item) {
    this.$emit('row-contextmenu', { event, item })
  }

  @Emit('delete') remove(e) {}
  save() {
    if (this.modal.isNew) this.$emit('create', this.modal)
    else this.$emit('update', this.modal)
  }

  /**Items */
  get hasItems() {
    return !isEmpty(this.items)
  }
  get pageItems() {
    let items = cloneDeep(this.items)
    if (this.searchText)
      items = items.filter(item =>
        Object.values(item).some(field =>
          isNil(field)
            ? false
            : field
                .toString()
                .toUpperCase()
                .includes(this.searchText.toUpperCase())
        )
      )

    if (this.itemPerPage > 0)
      items = items.slice(
        (this.page - 1) * this.itemPerPage,
        this.page * this.itemPerPage < this.items.length ? this.page * this.itemPerPage : this.items.length
      )
    return items
  }
  formatItemValue(item: any, header: TableHeader) {
    return item[header.value]
  }
  expandRow(rowIndex: number) {
    // this.itemsClone.splice(rowIndex + 1, 0, { isExpansion: true })
    // console.log(this.itemsClone)
  }
  /** search */
  searchText: string = ''

  /**pagination */
  itemPerPage = 10
  page = 1
  get pageLength() {
    return Math.ceil(this.items.length / this.itemPerPage)
  }
  changeItemPerPage(e) {
    this.itemPerPage = e.target.value
  }

  /** headers */
  get tableHeaders() {
    let headers: TableHeader[] = this.getHeadersFromTag()
    if (!isEmpty(this.headers)) headers = cloneDeep(this.headers)
    else if (isEmpty(headers) && !isEmpty(this.items)) {
      headers = Object.keys(this.items[0]).map(key => {
        return { text: upperFirst(key), value: key }
      })
    }
    //expansion
    if (this.expandable)
      headers.unshift({
        text: '',
        value: '$expansion',
        width: '36px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })
    //selection
    if (this.selectable)
      headers.unshift({
        text: '',
        value: '$selection',
        width: '36px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })
    //action
    if (this.updatable || this.deletable)
      headers.push({
        text: 'Tác vụ',
        value: '$action',
        width: '96px',
        headerAlign: 'center',
        headerValign: 'middle',
        align: 'center'
      })

    return headers
  }

  headerColspan(header: TableHeader) {
    return header.children ? this.headerColumns(header.children).length : 1
  }
  headerRowspan(header: TableHeader) {
    return header.children ? 1 : this.headerRows()
  }
  headerCellStyle(header: TableHeader) {
    let style = ''
    style += header.width ? 'width: ' + header.width + '; ' : ''
    style += header.width ? 'min-width: ' + header.width + '; ' : ''
    style += header.width ? 'max-width: ' + header.width + '; ' : ''
    style += header.headerBgcolor ? 'background-color: ' + header.headerBgcolor + '; ' : ''
    style += header.headerColor ? 'color: ' + header.headerColor + '; ' : ''
    style += header.headerAlign ? 'text-align: ' + header.headerAlign + '; ' : ''
    style += header.headerValign ? 'vertical-align: ' + header.headerValign + '; ' : ''
    return style
  }
  cellStyle(header: TableHeader) {
    let style = ''
    style += header.width ? 'width: ' + header.width + '; ' : ''
    style += header.width ? 'min-width: ' + header.width + '; ' : ''
    style += header.width ? 'max-width: ' + header.width + '; ' : ''
    style += header.align ? 'text-align: ' + header.align + '; ' : ''
    style += header.valign ? 'vertical-align: ' + header.valign + '; ' : ''
    style += header.bgcolor ? 'background-color: ' + header.bgcolor + '; ' : ''
    style += header.color ? 'color: ' + header.color + '; ' : ''
    return style
  }
  footerSummary(items: any[], header: TableHeader) {
    if (header.summary === 'sum') return items.reduce((a, b) => a + (b[header.value] || 0), 0)
    return ''
  }
  headerRows(value: any[] = this.tableHeaders, childrenField = 'children') {
    const hasChildren = value.filter(o => !isNil(o[childrenField]))
    if (hasChildren.length <= 0) return 1
    return Array.isArray(value) ? 1 + Math.max(...hasChildren.map(o => this.headerRows(o[childrenField], childrenField))) : 0
  }
  headersLevel(level = 1, childrenField = 'children') {
    let ar: any = this.tableHeaders
    for (let i = 1; i < level; i++) ar = ar.filter((a: any) => !isNil(a[childrenField])).flatMap((a: any) => a[childrenField])
    return ar
  }
  headerColumns(array: any[] = this.tableHeaders, childrenField = 'children') {
    let save: any[] = []
    array.forEach((item: any) => {
      if (isNil(item[childrenField])) save.push(item)
      if (Array.isArray(item[childrenField])) save = save.concat(this.headerColumns(item[childrenField], childrenField))
    })
    return save
  }
  /** Checkable */
  checkAll(e) {
    if (e) {
      if (!this.keyField) this.input(this.items)
      else this.input(this.items.map(i => i[this.keyField]))
    } else this.input([])
  }
  /** Edit modal */
  modal = {
    visible: false,
    data: {},
    isNew: false,
    isLoading: false
  }

  created() {
    //this.itemsClone = cloneDeep(this.items)
  }

  /**helper function */
  get cssClass() {
    return {
      table:
        'table no-margin ' +
          (this.bordered ? 'table-bordered ' : '') +
          (this.hovered ? 'table-hover ' : '') +
          (this.densed ? 'table-condensed ' : '') +
          (this.striped ? 'table-striped ' : '') +
          this.getCssClass('table') || '',
      headerRow: this.getCssClass('header-row') || '',
      headerCell: this.getCssClass('header-cell') || '',
      row: this.getCssClass('row') || '',
      cell: this.getCssClass('cell') || '',
      footerRow: this.getCssClass('footer-row') || '',
      footerCell: this.getCssClass('footer-cell') || ''
    }
  }
  getHeadersFromTag(node: VNode[] = this.$slots.default) {
    const itemNode = ['text-item', 'number-item', 'date-item', 'band-item']
    const items = this.getVNodeChildren(this.getVNode('items', node)).filter(node => itemNode.includes(node.tag))
    return items.map(o => {
      const obj: TableHeader = { ...{ text: '', value: '', headerValign: 'center' }, ...this.getVNodeDataAttrs(o) }
      obj.type = o.tag.slice(0, -5)
      if (o.tag === 'band-item') {
        const children = this.getVNodeChildren(o)
        obj.children = this.getHeadersFromTag(children)
      }
      return obj
    })
  }
  getCssClass(tag: string) {
    const node = this.getVNode('css-class')
    const attrs = this.getVNodeDataAttrs(node)
    return attrs[tag] || ''
  }
  getVNode(tag: string, node: VNode[] = this.$slots.default) {
    if (isNil(node)) return null
    return node.find(node => node.tag === tag)
  }
  getVNodeChildren(node: VNode) {
    if (!isNil(node) && Array.isArray(node.children)) return node.children.filter(node => !isNil(node.tag))
    else return []
  }
  getVNodeDataAttrs(node: VNode) {
    if (!isNil(node) && !isNil(node.data) && !isNil(node.data.attrs)) return this.toCamelCaseObj(node.data.attrs)
    return {}
  }
  toCamelCaseObj(obj) {
    return Object.fromEntries(
      Object.entries(obj).map(e => {
        e[0] = camelCase(e[0])
        return e
      })
    )
  }
}
</script>

<style scoped>
.tbl-header {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
}
.tbl-header > * {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
