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
                <n-checkbox v-if="multiple" @input="selectAll"></n-checkbox>
              </div>
              <slot v-else :name="`header.${kebabCase(header.value)}`" :item="header">{{ header.text }}</slot>
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
              <slot :name="`item.${kebabCase(header.value)}`" :item="item" :value="item[header.value]">
                <template v-if="header.value === '$selection'">
                  <n-checkbox
                    v-if="multiple"
                    @input="input"
                    :model="value"
                    :value="keyField ? item[keyField] : item"
                  ></n-checkbox>
                  <n-radio v-else @input="input" :model="value" :value="keyField ? item[keyField] : item"></n-radio>
                </template>
                <template v-else-if="header.value === '$expansion'">
                  <n-icon style="cursor:pointer" @click="expandRow(rowIndex)">chevron-down</n-icon>
                </template>
                <template v-else-if="header.value === '$action'">
                  <n-btn v-if="updatable" @click="updateClick(item)">
                    <n-icon>pencil</n-icon>
                  </n-btn>
                  <n-btn v-if="deletable" @click="removeClick(item)">
                    <n-icon>trash</n-icon>
                  </n-btn>
                </template>
                <template v-else>
                  {{ formatItemValue(item, header) }}
                </template>
              </slot>
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
              <slot :name="`footer.${kebabCase(header.value)}`" :items="items">
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
          Trang {{ page }}/{{ pageLength }} ({{ itemsLength }} mục)
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

    <n-modal :loading="modal.loading" :caption="modal.new ? 'Thêm' : 'Sửa'" v-model="modal.visible">
      <n-form ref="form" v-model="modal.valid">
        <slot name="modal" :modal="modal"></slot>
      </n-form>
      <template v-slot:footer>
        <n-btn color="primary" @click="save">Lưu</n-btn>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from 'vue-property-decorator'
import { TableHeader } from '../types/Table'
import _ from 'lodash'
import axios from 'axios'
import NPagination from './NPagination.vue'
import NBtn from './NBtn.vue'
import NIcon from './NIcon.vue'
import NModal from './NModal.vue'
import NCheckbox from './NCheckbox.vue'
import NRadio from './NRadio.vue'
import NOverlay from './NOverlay.vue'
import NForm from './NForm.vue'
import { VNode } from 'vue'

@Component({
  inheritAttrs: false,
  components: { NPagination, NBtn, NIcon, NModal, NCheckbox, NRadio, NOverlay, NForm }
})
export default class NDataTable extends Vue {
  @Prop({ type: Boolean, default: true }) readonly bordered!: boolean
  @Prop({ type: Boolean, default: true }) readonly hovered!: boolean
  @Prop({ type: Boolean, default: false }) readonly densed!: boolean
  @Prop({ type: Boolean, default: false }) readonly striped!: boolean

  @Prop({ type: Boolean, default: false }) readonly hideBottom!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideTop!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideFooter!: boolean
  @Prop({ type: Boolean, default: false }) readonly hideHeader!: boolean

  @Prop({ type: Boolean, default: false }) readonly searchable!: boolean
  @Prop({ type: Boolean, default: false }) readonly expandable!: boolean

  /**Auto read on component initialize and when read-url is changed */
  @Prop({ type: Boolean, default: true }) readonly autoRead!: boolean
  @Prop({ type: Boolean, default: false }) readonly creatable!: boolean
  @Prop({ type: Boolean, default: false }) readonly updatable!: boolean
  @Prop({ type: Boolean, default: false }) readonly deletable!: boolean

  /**default value for new item */
  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  newItem!: string
  @Prop(String) readonly readUrl!: string
  @Prop(String) readonly createUrl!: string
  @Prop(String) readonly updateUrl!: string
  @Prop(String) readonly deleteUrl!: string

  /**Enable selection */
  @Prop({ type: Boolean, default: false }) readonly selectable!: boolean
  /**Only work with selectable, enable checkbox instead of radio */
  @Prop({ type: Boolean, default: false }) readonly multiple!: boolean
  @Prop({ type: Boolean, default: false }) readonly rowSelect!: boolean
  @Prop(String) readonly keyField!: string

  @Prop(String) readonly caption!: string
  @Prop({ type: String, default: 'Không có dữ liệu' }) noDataText!: string

  @Prop(Array) headers: TableHeader[]

  loading: boolean = false
  items: any[] = []

  @Model('input', { type: [Array, String, Number, Boolean, Object] }) value!: any[] | any
  @Emit() input(e) {}
  @Emit() error(e) {}

  setLoading(status: boolean) {
    this.loading = status
  }

  setItems(items: any[]) {
    this.items = items
  }

  createClick(e) {
    this.modal.visible = true
    this.modal.data = _.cloneDeep(this.newItem)
    this.modal.new = true
    this.modal.loading = false
    this.modal.valid = true
  }
  updateClick(e) {
    this.modal.visible = true
    this.modal.data = _.cloneDeep(e)
    this.modal.new = false
    this.modal.loading = false
    this.modal.valid = true
  }
  private rowClick(event, item) {
    //Row select
    if (this.selectable && this.rowSelect) {
      const value = this.keyField ? item[this.keyField] : item
      if (this.multiple) {
        const values = _.cloneDeep(this.value)
        const index = values.findIndex(o => _.isEqual(o, value))
        if (index < 0) values.push(value)
        else values.splice(index, 1)
        this.input(values)
      } else this.input(value)
    }

    this.$emit('row-click', { event, item })
  }
  private rowDblclick(event, item) {
    this.$emit('row-dblclick', { event, item })
  }
  private rowContextmenu(event, item) {
    this.$emit('row-contextmenu', { event, item })
  }

  async removeClick(e) {
    await this.delete(e)
  }
  async save() {
    if (this.modal.new) {
      await this.create()
    } else {
      await this.update()
    }
  }

  /**Items */
  private get hasItems() {
    return !_.isEmpty(this.items)
  }
  private get itemsLength() {
    return this.items.length
  }
  private get pageItems() {
    let items = _.cloneDeep(this.items)
    if (this.searchText)
      items = items.filter(item =>
        Object.values(item).some(field =>
          _.isNil(field)
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
  private formatItemValue(item: any, header: TableHeader) {
    return item[header.value]
  }
  private expandRow(rowIndex: number) {
    // this.itemsClone.splice(rowIndex + 1, 0, { isExpansion: true })
    // console.log(this.itemsClone)
  }
  /** search */
  searchText: string = ''

  /**pagination */
  itemPerPage = 10
  page = 1
  private get pageLength() {
    return Math.ceil(this.items.length / this.itemPerPage)
  }
  private changeItemPerPage(e) {
    this.itemPerPage = e.target.value
  }

  /** headers */
  private get tableHeaders() {
    let headers: TableHeader[] = this.getHeadersFromTag()
    if (!_.isEmpty(this.headers)) headers = _.cloneDeep(this.headers)
    else if (_.isEmpty(headers) && !_.isEmpty(this.items)) {
      headers = Object.keys(this.items[0]).map(key => {
        return { text: _.startCase(key), value: key }
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

  private headerColspan(header: TableHeader) {
    return header.children ? this.headerColumns(header.children).length : 1
  }
  private headerRowspan(header: TableHeader) {
    return header.children ? 1 : this.headerRows()
  }
  private headerCellStyle(header: TableHeader) {
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
  private cellStyle(header: TableHeader) {
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
  private footerSummary(items: any[], header: TableHeader) {
    if (header.summary === 'sum') return items.reduce((a, b) => a + (b[header.value] || 0), 0)
    else if (header.summary === 'count') return items.map(o => o[header.value]).length
    return ''
  }
  private headerRows(value: any[] = this.tableHeaders, childrenField = 'children') {
    const hasChildren = value.filter(o => !_.isNil(o[childrenField]))
    if (hasChildren.length <= 0) return 1
    return Array.isArray(value) ? 1 + Math.max(...hasChildren.map(o => this.headerRows(o[childrenField], childrenField))) : 0
  }
  private headersLevel(level = 1, childrenField = 'children') {
    let ar: any = this.tableHeaders
    for (let i = 1; i < level; i++) ar = ar.filter((a: any) => !_.isNil(a[childrenField])).flatMap((a: any) => a[childrenField])
    return ar
  }
  private headerColumns(array: any[] = this.tableHeaders, childrenField = 'children') {
    let save: any[] = []
    array.forEach((item: any) => {
      if (_.isNil(item[childrenField])) save.push(item)
      if (Array.isArray(item[childrenField])) save = save.concat(this.headerColumns(item[childrenField], childrenField))
    })
    return save
  }
  /** selectable */
  selectAll(e) {
    if (!this.selectable || !this.multiple) return
    if (e) {
      if (!this.keyField) this.input(this.items)
      else this.input(this.items.map(i => i[this.keyField]))
    } else this.input([])
  }
  /** Edit modal */
  modal = {
    visible: false,
    data: {},
    new: false,
    loading: false,
    valid: true
  }

  async created() {
    if (this.autoRead) await this.read()
  }

  /**CRUD */
  @Watch('readUrl')
  private onReadUrlChanged() {
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
  async create() {
    if (!this.creatable) return
    if (_.isEmpty(this.createUrl)) return
    this.modal.loading = true
    try {
      if ((this.$refs.form as NForm).validate()) {
        await axios.put(this.createUrl, this.modal.data)
        this.modal.visible = false
        this.$emit('created', this.modal)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.modal.loading = false
  }
  async update() {
    if (!this.updatable) return
    if (_.isEmpty(this.updateUrl)) return
    this.modal.loading = true
    try {
      if ((this.$refs.form as NForm).validate()) {
        await axios.post(this.updateUrl, this.modal.data)
        this.modal.visible = false
        this.$emit('updated', this.modal)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.modal.loading = false
  }
  async delete(item) {
    if (!this.deletable) return
    if (_.isEmpty(this.deleteUrl)) return
    this.loading = true
    try {
      if (confirm('Bạn có chắc muốn xóa?')) {
        await axios.delete(this.readUrl, { params: item })
        this.$emit('deleted', item)
        await this.read()
      }
    } catch (e) {
      this.error(e)
    }
    this.loading = false
  }

  /**helper function */
  private get cssClass() {
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
  private getHeadersFromTag(node: VNode[] = this.$slots.default) {
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
  private getCssClass(tag: string) {
    const node = this.getVNode('css-class')
    const attrs = this.getVNodeDataAttrs(node)
    return attrs[tag] || ''
  }
  private getVNode(tag: string, node: VNode[] = this.$slots.default) {
    if (_.isNil(node)) return null
    return node.find(node => node.tag === tag)
  }
  private getVNodeChildren(node: VNode) {
    if (!_.isNil(node) && Array.isArray(node.children)) return node.children.filter(node => !_.isNil(node.tag))
    else return []
  }
  private getVNodeDataAttrs(node: VNode) {
    if (!_.isNil(node) && !_.isNil(node.data) && !_.isNil(node.data.attrs)) return this.toCamelCaseObj(node.data.attrs)
    return {}
  }
  private toCamelCaseObj(obj) {
    return Object.fromEntries(
      Object.entries(obj).map(e => {
        e[0] = _.camelCase(e[0])
        return e
      })
    )
  }
  private kebabCase(t) {
    return _.kebabCase(t)
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
