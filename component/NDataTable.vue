<template>
  <div>
    <div class="tbl-header">
      <div class="title" v-if="caption" style="flex:auto">{{ caption }}</div>
      <div v-if="searchable" class="has-feedback" style="flex:auto">
        <div class="has-feedback">
          <input type="text" class="form-control" v-model="searchText" />
          <span class="glyphicon glyphicon-search form-control-feedback"></span>
        </div>
      </div>
      <div v-if="!caption && !searchable" style="flex:auto"></div>
      <div v-if="creatable">
        <n-btn :class="buttonAddCssClass" @click="createClick">
          <n-icon>plus</n-icon>
          <span class="hidden-xs">Thêm</span>
        </n-btn>
      </div>
      <slot name="top.append"></slot>
    </div>
    <table :class="tableCssClass">
      <thead>
        <tr :class="headerRowCssClass">
          <th
            v-for="(header, index) in tableHeaders"
            :key="index"
            :class="headerCellCssClass"
            :style="(header.width ? 'width: ' + header.width + '; ' : '') + (header.align ? 'text-align: ' + header.align : '')"
          >
            <slot :name="`header.${header.value}`" :item="header">{{ header.text }}</slot>
          </th>
        </tr>
      </thead>
      <tbody v-if="hasItems">
        <tr :class="rowCssClass" v-for="(item, rowIndex) in pageItems" :key="rowIndex">
          <td
            :class="cellCssClass"
            :style="(header.width ? 'width: ' + header.width + '; ' : '') + (header.align ? 'text-align: ' + header.align : '')"
            v-for="(header, colIndex) in tableHeaders"
            :key="colIndex"
          >
            <slot v-if="header.value !== 'action'" :name="`item.${header.value}`" :item="item">{{ item[header.value] }}</slot>
            <div :class="header.align ? 'text-${header.align}' : ''" v-else>
              <n-btn v-if="updatable" @click="updateClick(item)">
                <n-icon>pencil</n-icon>
              </n-btn>
              <n-btn v-if="deletable" @click="remove(item)">
                <n-icon>trash</n-icon>
              </n-btn>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="text-center">{{ noDataText }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr :class="footerRowCssClass">
          <td :class="footerCellCssClass" v-for="(header, colIndex) in tableHeaders" :key="colIndex">
            <slot :name="`footer.${header.value}`" :item="items"></slot>
          </td>
        </tr>
      </tfoot>
    </table>

    <div style="display:flex; padding:10px 5px; align-items: center;">
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
    </div>

    <n-modal v-model="modal.visible">
      <slot name="modal" :modal="modal">OK</slot>
      <template v-slot:footer>
        <n-btn color="primary" @click="save">Lưu</n-btn>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TableHeader } from '../types/Table'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import NPagination from './NPagination.vue'
import NSelect from './NSelect.vue'
import NBtn from './NBtn.vue'
import NIcon from './NIcon.vue'
import NModal from './NModal.vue'
@Component({
  inheritAttrs: false,
  components: { NPagination, NSelect, NBtn, NIcon, NModal }
})
export default class NDataTable extends Vue {
  @Prop({ type: Boolean, default: true }) bordered!: boolean
  @Prop({ type: Boolean, default: true }) hovered!: boolean
  @Prop({ type: Boolean, default: false }) densed!: boolean
  @Prop({ type: Boolean, default: false }) striped!: boolean

  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) creatable!: boolean
  @Prop({ type: Boolean, default: false }) updatable!: boolean
  @Prop({ type: Boolean, default: false }) deletable!: boolean

  @Prop(String) caption!: string
  @Prop({ type: String, default: 'Không có dữ liệu' }) noDataText!: string

  @Prop(Array) headers: TableHeader[]
  @Prop(Array) items: any[]

  @Emit() createClick(e) {
    this.modal.visible = true
    this.modal.data = {}
    this.modal.isNew = true
  }
  @Emit() updateClick(e) {
    this.modal.visible = true
    this.modal.data = cloneDeep(e)
    this.modal.isNew = false
  }

  @Emit('delete') remove(e) {}
  save() {
    if (this.modal.isNew) this.$emit('create', this.modal)
    else this.$emit('update', this.modal)
  }

  /** css classes */
  get tableCssClass() {
    let css = 'table no-margin '
    css += this.bordered ? 'table-bordered ' : ''
    css += this.hovered ? 'table-hover ' : ''
    css += this.densed ? 'table-condensed ' : ''
    css += this.striped ? 'table-striped ' : ''
    css += this.getCssClass('table') || ''
    return css
  }
  get headerRowCssClass() {
    return this.getCssClass('header-row') || ''
  }
  get headerCellCssClass() {
    return this.getCssClass('header-cell') || ''
  }
  get rowCssClass() {
    return this.getCssClass('row') || ''
  }
  get cellCssClass() {
    return this.getCssClass('cell') || ''
  }
  get footerRowCssClass() {
    return this.getCssClass('footer-row') || ''
  }
  get footerCellCssClass() {
    return this.getCssClass('footer-cell') || ''
  }
  get buttonAddCssClass() {
    return this.getCssClass('button-add') || ''
  }

  /**Items */
  get hasItems() {
    return !isEmpty(this.items)
  }
  get pageItems() {
    let items = cloneDeep(this.items)
    if (this.searchText)
      items = items.filter(r =>
        Object.values(r).some(c =>
          c
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
    const headers: TableHeader[] = cloneDeep(this.headers)
    if (this.updatable || this.deletable)
      headers.push({
        text: 'Tác vụ',
        value: 'action',
        width: '10%',
        align: 'center'
      })
    return headers
  }

  /** Edit modal */
  modal = {
    visible: false,
    data: {},
    isNew: false
  }

  mounted() {
    console.log(this.$slots.default.find(node => node.tag === 'css-class'))
  }

  /**helper function */
  getCssClass(tag: string) {
    const css = this.$slots.default.find(node => node.tag === 'css-class')
    if (!css.data) return ''
    if (!Object.prototype.hasOwnProperty.call(css.data, 'attrs') || !css.data.attrs) return ''
    if (!Object.prototype.hasOwnProperty.call(css.data.attrs, tag)) return ''
    return css.data.attrs[tag]
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
