<template>
  <div style="position:relative">
    <div v-if="!hideTop" class="n-data-table-top" :class="cssClass.top">
      <slot name="top.prepend"></slot>
      <slot name="top">
        <div class="title" v-if="caption" style="flex:auto">{{ caption }}</div>
        <div v-if="searchable" class="has-feedback" style="flex:auto">
          <div class="has-feedback">
            <input ref="search" type="text" class="form-control" v-model="vSearch" />
            <span class="glyphicon glyphicon-search form-control-feedback"></span>
          </div>
        </div>
        <div v-if="!caption && !searchable" style="flex:auto"></div>
        <div class="btn-group" v-if="creatable || excelable || !isEmpty($slots['top.button-group'])">
          <n-btn v-if="creatable" color="primary" @click.stop="createClick" :class="cssClass.createButton">
            <n-icon>plus</n-icon>
            <span class="hidden-xs">Thêm</span>
          </n-btn>
          <n-btn v-if="excelable" color="primary" @click.stop="exportExcel">
            <n-icon>file-excel-o</n-icon>
            <span class="hidden-xs">Excel</span>
          </n-btn>
          <slot name="top.button-group"></slot>
        </div>
      </slot>
      <slot name="top.append"></slot>
    </div>

    <div :class="{ 'table-responsive': responsive }">
      <table ref="table" class="n-data-table table no-margin" :class="cssClass.table">
        <thead v-if="!hideHeader">
          <slot name="header" :headers="headersCollection" :sort="toggleSort">
            <tr :class="cssClass.headerRow" v-for="(headers, rowIndex) in headersCollection" :key="rowIndex">
              <th
                v-for="(header, colIndex) in headers"
                :key="colIndex"
                :colspan="header._colspan"
                :rowspan="header._rowspan"
                :class="cssClass.headerCell"
                :style="headerCellStyle(header)"
                @click="toggleSort(header)"
              >
                <template v-if="!isGrouped(header.value)">
                  <div v-if="header.value === '__selection'">
                    <n-checkbox v-if="multipleSelect" @input="selectAll" v-model="vSelectAll"></n-checkbox>
                  </div>
                  <slot v-else :name="`header.${kebabCase(header.value)}`" :item="header">{{ header.text }}</slot>
                  <i
                    v-if="header.sortable"
                    class="sortable fa fa-sort"
                    :class="`${getSort(header) ? (getSort(header).desc ? 'desc' : 'asc') : ''}`"
                  ></i>
                  <i
                    v-if="header.filterable"
                    class="filterable fa fa-filter"
                    :class="`${isFiltered(header) ? 'active' : ''}`"
                    @click.stop="openFilter(header)"
                  ></i>
                </template>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody v-if="hasItems">
          <tr
            :class="cssClass.row"
            v-for="(item, rowIndex) in pageItems"
            :key="rowIndex"
            @contextmenu="e => rowContextmenu(e, item.data, rowIndex)"
            @dblclick="e => rowDblclick(e, item.data, rowIndex)"
            @click="e => rowClick(e, item, rowIndex)"
          >
            <slot name="item" :item="vItems[item.index]" :rowIndex="rowIndex">
              <template v-if="item.type === 'group'">
                <td v-for="i in item.group.level" :key="i"></td>
                <td :colspan="tableColumnsLength - item.group.level" @click.stop>
                  {{ item.group.header.text }}:
                  <template v-if="item.group.header.encodeHtml">
                    {{ item.group.header.format(item.group.text) }}
                  </template>
                  <span v-else v-html="item.group.header.format(item.group.text)"></span>
                </td>
              </template>

              <template v-if="item.type === 'expand'">
                <td v-for="i in groupByLength" :key="i"></td>
                <td v-if="item.type === 'expand'" :colspan="tableColumnsLength - groupByLength" @click.stop>
                  <slot name="item.expand" :item="item.data"></slot>
                </td>
              </template>

              <template v-else-if="item.type === 'item'">
                <td :class="cssClass.cell" :style="cellStyle(header)" v-for="(header, colIndex) in tableColumns" :key="colIndex">
                  <slot
                    :name="`item.${kebabCase(header.value)}`"
                    :item="vItems[item.index]"
                    :value="item.data[header.value]"
                    :index="item.index"
                    :rowIndex="rowIndex"
                  >
                    <template v-if="header.value === '__selection'">
                      <n-checkbox
                        :ref="`checkbox-${item.index}`"
                        v-if="multipleSelect"
                        v-model="vValue"
                        @click.stop
                        :value="keyField ? item.data[keyField] : item.data"
                      ></n-checkbox>
                      <n-radio
                        v-else
                        :ref="`radio-${item.index}`"
                        v-model="vValue"
                        @input="input"
                        @click.stop
                        :value="keyField ? item.data[keyField] : item.data"
                      ></n-radio>
                    </template>
                    <template v-else-if="header.value === '__expansion'">
                      <n-icon
                        style="cursor:pointer"
                        @click.stop="expandRow(item.index)"
                        :class="`fa-chevron-${isExpanded(item.index) ? 'up' : 'down'}`"
                      >
                      </n-icon>
                    </template>
                    <template v-else-if="header.value === '__action'">
                      <div class="btn-group">
                        <n-btn color="primary" v-if="updatable" @click.stop="updateClick(item.data)">
                          <n-icon>pencil</n-icon>
                        </n-btn>
                        <n-btn color="danger" v-if="deletable" @click.stop="removeClick(item.data)">
                          <n-icon>trash</n-icon>
                        </n-btn>
                      </div>
                    </template>
                    <template v-else>
                      <template v-if="!isGrouped(header.value)">
                        <template v-if="header.encodeHtml">
                          {{ header.format(item.data[header.value]) }}
                        </template>
                        <span v-else v-html="header.format(item.data[header.value])"></span>
                      </template>
                    </template>
                  </slot>
                </td>
              </template>
            </slot>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="tableColumnsLength" class="text-center">
              {{ tableText.noData }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!hideFooter">
          <slot name="footer" :items="vItems" :headers="headersCollection">
            <tr :class="cssClass.footerRow">
              <td :class="cssClass.footerCell" v-for="(header, colIndex) in tableColumns" :key="colIndex">
                <slot :name="`footer.${kebabCase(header.value)}`" :items="vItems">
                  {{ footerSummary(vItems, header) }}
                </slot>
              </td>
            </tr>
          </slot>
        </tfoot>
      </table>
    </div>

    <div v-if="!hideBottom" style="display:flex; padding:10px 5px; align-items: center;">
      <slot name="bottom.prepend"></slot>
      <slot name="bottom">
        <div class="hidden-xs" style="height: 30px;min-height: 32px;padding: 6px 10px 6px 0px;font-size: 12px; line-height: 1.5;">
          Trang {{ vPage }}/{{ pageLength }} ({{ tableItems.length }} mục)
        </div>

        <div>
          <n-pagination :length="pageLength" v-model="vPage" small class="no-margin"></n-pagination>
        </div>

        <div style="margin-left:auto">
          <select
            @change="changeItemPerPage"
            class="form-control"
            style="width:70px;display: inline-block; height:30px;  padding: 6px 6px"
            :value="vItemPerPage"
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

    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-2x fa-fw">circle-o-notch</n-icon>
        <div>Đang tải dữ liệu</div>
      </div>
    </n-overlay>

    <n-modal
      scrollable
      persistent
      large
      :loading="vModal.loading"
      :caption="(vModal.new ? 'Thêm ' : 'Sửa ') + appendModalCaption"
      v-model="vModal.visible"
    >
      <n-form ref="form" v-model="vModal.valid">
        <slot name="modal" :modal="vModal"></slot>
      </n-form>
      <template v-slot:footer>
        <n-btn color="primary" @click.stop="saveClick" tag="button">Lưu</n-btn>
      </template>
    </n-modal>

    <n-modal caption="Lọc" v-model="vFilterModal.visible" hide-footer scrollable small>
      <n-data-table
        v-model="vFilterModal.value"
        :items="vFilterModal.items"
        selectable
        key-field="value"
        multiple-select
        hide-bottom
        hide-footer
        searchable
        sticky-top
        row-select
      >
        <items>
          <text-item :encode-html="vFilterModal.encodeHtml" text="Giá trị" value="text"></text-item>
        </items>
      </n-data-table>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch, ModelVar } from '@namhoang/vue-property-decorator'

import _ from 'lodash'
import numeral from 'numeral'
import XLSX from 'xlsx'

import NTableData from './NTableData'
import NTableCRUD from './NTableCRUD'
import NTableCssClass from './NTableCssClass'
import NTableText from './NTableText'
import { TableHeader, TableItem } from '../../types/Table'

import NCheckBox from '../NCheckbox.vue'
import NRadio from '../NRadio.vue'
import NTableProp from './NTableProp'
import NTableComputed from './NTableComputed'

//Mixins limit 5 instances
class mixin1 extends Mixins(NTableProp, NTableComputed, NTableCRUD, NTableData) {}
class mixin2 extends Mixins(NTableCssClass, NTableText) {}

@Component({
  inheritAttrs: false
})
export default class NDataTable extends Mixins(mixin1, mixin2) {
  @ModelVar('input', 'value', {
    type: [Array, String, Number, Boolean, Object]
  })
  vValue!: any[] | any
  consolelog(e) {
    console.log(e)
  }
  createClick(e) {
    this.vModal.visible = true
    this.vModal.data = _.cloneDeep(this.newItem)
    this.vModal.new = true
    this.vModal.loading = false
    this.vModal.valid = true
    this.$nextTick(() => {
      ;(this.$refs.form as any).focusFirstComponent()
    })
  }
  updateClick(e) {
    this.vModal.visible = true
    this.vModal.data = _.cloneDeep(e)
    this.vModal.new = false
    this.vModal.loading = false
    this.vModal.valid = true
    this.$nextTick(() => {
      ;(this.$refs.form as any).focusFirstComponent()
    })
  }
  private rowClick(event, item: TableItem, rowIndex: number) {
    //Row select
    if (this.selectable && this.rowSelect) {
      if (this.multipleSelect) (this.$refs[`checkbox-${item.index}`][0] as NCheckBox).toggle()
      else (this.$refs[`radio-${item.index}`][0] as NRadio).toggle()
    }
    this.$emit('row-click', { event, item: item.data, rowIndex })
  }
  private rowDblclick(event, item, rowIndex) {
    this.$emit('row-dblclick', { event, item, rowIndex })
  }
  private rowContextmenu(event, item, rowIndex) {
    this.$emit('row-contextmenu', { event, item, rowIndex })
  }
  async removeClick(e) {
    await this.delete(e)
  }
  async saveClick() {
    if (this.vModal.new) {
      await this.create()
    } else {
      await this.update()
    }
  }

  private expandRow(itemIndex: number) {
    if (!this.expandable) return
    if (!this.vExpansion.includes(itemIndex))
      this.multipleExpand ? this.vExpansion.push(itemIndex) : (this.vExpansion = [itemIndex])
    else
      this.vExpansion.splice(
        this.vExpansion.findIndex(i => i === itemIndex),
        1
      )
  }
  vFilterModal: {
    items: any[]
    name: string
    value: any[]
    visible: boolean
    encodeHtml: boolean
  } = {
    items: [],
    name: '',
    value: [],
    visible: false,
    encodeHtml: true
  }
  openFilter(header: TableHeader) {
    this.vFilterModal.name = header.value

    this.vFilterModal.value = this.getFilterValue(header) || []
    this.vFilterModal.encodeHtml = header.encodeHtml
    this.vFilterModal.visible = true
    this.vFilterModal.items = _.uniqBy(
      this.vItems.map(i => {
        return { text: header.format(i[header.value]), value: i[header.value] }
      }),
      'value'
    )
  }

  @Watch('vFilterModal.value')
  onFilterModalChanged() {
    const index = this.vFilter.findIndex(f => f.name === this.vFilterModal.name)
    if (index < 0) {
      if (!_.isEmpty(this.vFilterModal.value))
        this.vFilter.push({
          name: this.vFilterModal.name,
          value: this.vFilterModal.value
        })
    } else {
      if (_.isEmpty(this.vFilterModal.value)) this.vFilter.splice(index, 1)
      else
        this.vFilter.splice(index, 1, {
          name: this.vFilterModal.name,
          value: this.vFilterModal.value
        })
    }
  }
  /**pagination */
  private changeItemPerPage(e) {
    this.vItemPerPage = e.target.value
  }
  /** headers */

  private headerCellStyle(header: TableHeader) {
    const style: any[] = []
    if (header.width) {
      style.push({ width: header.width })
      style.push({ 'min-width': header.width })
      style.push({ 'max-width': header.width })
    }
    if (header.headerBgcolor) style.push({ 'background-color': header.headerBgcolor })
    if (header.headerColor) style.push({ color: header.headerColor })
    if (header.headerAlign) style.push({ 'text-align': header.headerAlign })
    if (header.headerValign) style.push({ 'vertical-align': header.headerValign })
    return style
  }
  private cellStyle(header: TableHeader) {
    const style: any = []
    if (header.width) {
      style.push({ width: header.width })
      style.push({ 'min-width': header.width })
      style.push({ 'max-width': header.width })
    }
    if (header.align) style.push({ 'text-align': header.align })
    if (header.valign) style.push({ 'vertical-align': header.valign })
    if (header.color) style.push({ color: header.color })
    if (header.bgcolor) style.push({ 'background-color': header.bgcolor })
    return style
  }
  private footerSummary(items: any[], header: TableHeader) {
    if (header.summary instanceof Function) {
      return header.summary(items)
    } else {
      if (header.summary === 'sum')
        return items.reduce((a, b) => a.add(Number(b[header.value]) || 0), numeral(0)).format('0,0[.]00[0][0][0]')
      else if (header.summary === 'count') return numeral(items.length).format('0,0[.]00')
      else if (header.summary === 'average')
        return items
          .reduce((a, b) => a.add(Number(b[header.value]) || 0), numeral(0))
          .divide(items.length)
          .format('0,0[.]00[0][0][0]')
      return ''
    }
  }
  /** selectable */
  vSelectAll: boolean = false
  @Watch('vValue')
  setSelectAllCheckBox(v) {
    if (!this.selectable || !this.multipleSelect) return
    if (!_.isEmpty(v)) {
      if (!this.keyField) {
        if (_.isEqual(this.vValue.concat().sort(), this.vItems.concat().sort())) this.vSelectAll = true
        else this.vSelectAll = false
      } else {
        if (
          _.isEqual(
            this.vValue.concat().sort(),
            this.vItems
              .map(i => i[this.keyField])
              .concat()
              .sort()
          )
        )
          this.vSelectAll = true
        else this.vSelectAll = false
      }
    } else this.vSelectAll = false
  }

  async selectAll(e) {
    if (!this.selectable || !this.multipleSelect) return
    if (e) {
      if (!this.keyField) this.vValue = _.cloneDeep(this.vItems)
      else this.vValue = this.vItems.map(i => i[this.keyField])
    } else this.vValue = []
  }
  /**helper function */

  private isEmpty(o) {
    return _.isEmpty(o)
  }

  mounted() {}

  private exportExcel() {
    //Show all to export then reverse back
    this.vLoading = true
    const itemPerPage = this.vItemPerPage
    this.vItemPerPage = -1
    this.$nextTick(() => {
      const wb = XLSX.utils.table_to_book(this.$refs.table)
      XLSX.writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
      this.vItemPerPage = itemPerPage
      this.vLoading = false
    })
  }
  kebabCase(v) {
    return _.kebabCase(v)
  }
}
</script>

<style scoped>
.table thead th {
  cursor: pointer;
}
.n-data-table thead th .sortable,
.n-data-table thead th .filterable {
  opacity: 0.3;
}
.n-data-table thead th:hover .sortable,
.n-data-table thead .sortable.asc,
.n-data-table thead .sortable.desc,
.n-data-table thead th:hover .filterable,
.n-data-table thead th .filterable.active {
  opacity: 1;
}
.n-data-table thead .sortable.asc::before {
  content: '\f0de';
}
.n-data-table thead .sortable.desc::before {
  content: '\f0dd';
}

.n-data-table-top {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  background-color: white;
}
.n-data-table-top > * + * {
  padding-left: 5px;
}
.n-data-table-top.sticky-top {
  position: sticky;
  top: 0px;
  z-index: 99;
}
</style>
