<template>
  <div style="position:relative">
    <div v-if="!hideTop" :class="{ 'tbl-header': true, 'bg-white': true, 'sticky-top': stickyTop }">
      <slot name="top.prepend"></slot>
      <slot name="top">
        <div class="title" v-if="caption" style="flex:auto">{{ caption }}</div>
        <div v-if="searchable" class="has-feedback" style="flex:auto">
          <div class="has-feedback">
            <input type="text" class="form-control" v-model="vSearch" />
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
            @contextmenu="e => rowContextmenu(e, item, rowIndex)"
            @dblclick="e => rowDblclick(e, item, rowIndex)"
            @click="e => rowClick(e, item, rowIndex)"
          >
            <td :class="cssClass.cell" :style="cellStyle(header)" v-for="(header, colIndex) in headerColumns()" :key="colIndex">
              <slot :name="`item.${kebabCase(header.value)}`" :item="item" :value="item[header.value]" :index="rowIndex">
                <template v-if="header.value === '$selection'">
                  <n-checkbox
                    ref="checkbox"
                    v-if="multiple"
                    @input="input"
                    :model="value"
                    :value="keyField ? item[keyField] : item"
                  ></n-checkbox>
                  <n-radio v-else ref="radio" @input="input" :model="value" :value="keyField ? item[keyField] : item"></n-radio>
                </template>
                <template v-else-if="header.value === '$expansion'">
                  <n-icon style="cursor:pointer" @click="expandRow(rowIndex)">chevron-down</n-icon>
                </template>
                <template v-else-if="header.value === '$action'">
                  <div class="btn-group">
                    <n-btn v-if="updatable" @click="updateClick(item)">
                      <n-icon>pencil</n-icon>
                    </n-btn>
                    <n-btn v-if="deletable" @click="removeClick(item)">
                      <n-icon>trash</n-icon>
                    </n-btn>
                  </div>
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
            <td :colspan="headerColumns().length" class="text-center">{{ tableText.noData }}</td>
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
          Trang {{ vPage }}/{{ pageLength }} ({{ itemsLength }} mục)
        </div>

        <div style="flex:auto">
          <n-pagination :length="pageLength" v-model="vPage" small class="no-margin"></n-pagination>
        </div>
        <div>
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
      <n-icon css-class="fa-spin fa-5x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>

    <n-modal :loading="vModal.loading" :caption="vModal.new ? 'Thêm' : 'Sửa'" v-model="vModal.visible">
      <n-form ref="form" v-model="vModal.valid">
        <slot name="modal" :modal="vModal"></slot>
      </n-form>
      <template v-slot:footer>
        <n-btn color="primary" @click="saveClick">Lưu</n-btn>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import _ from 'lodash'

import NTableData from './NTableData'
import NTableHeader from './NTableHeader'
import NTableProp from './NTableProp'
import NTableCRUD from './NTableCRUD'
import NTableCssClass from './NTableCssClass'
import NTableText from './NTableText'
import { TableHeader } from '../../types/Table'

import NCheckBox from '../NCheckbox.vue'
import NRadio from '../NRadio.vue'

//Mixins limit 5 instances
class mixin1 extends Mixins(NTableData, NTableHeader, NTableProp, NTableCRUD, NTableCssClass) {}
class mixin2 extends Mixins(NTableText) {}

@Component({
  inheritAttrs: false,
  mixins: []
})
export default class NDataTable extends Mixins(mixin1, mixin2) {
  createClick(e) {
    this.vModal.visible = true
    this.vModal.data = _.cloneDeep(this.newItem)
    this.vModal.new = true
    this.vModal.loading = false
    this.vModal.valid = true
  }
  updateClick(e) {
    this.vModal.visible = true
    this.vModal.data = _.cloneDeep(e)
    this.vModal.new = false
    this.vModal.loading = false
    this.vModal.valid = true
  }
  private rowClick(event, item, rowIndex) {
    //Row select
    if (this.selectable && this.rowSelect) {
      if (this.multiple) (this.$refs.checkbox[rowIndex] as NCheckBox).toggle()
      else (this.$refs.radio[rowIndex] as NRadio).check()
    }
    this.$emit('row-click', { event, item, rowIndex })
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

  private formatItemValue(item: any, header: TableHeader) {
    return item[header.value]
  }
  private expandRow(rowIndex: number) {}
  /**pagination */
  private changeItemPerPage(e) {
    this.vItemPerPage = e.target.value
  }
  /** headers */

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
  /** selectable */
  async selectAll(e) {
    if (!this.selectable || !this.multiple) return
    if (e) {
      if (!this.keyField) this.input(this.vItems)
      else this.input(this.vItems.map(i => i[this.keyField]))
    } else this.input([])
  }
  /**helper function */

  //console.log(this.items, this.__items)
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
.sticky-top {
  position: sticky;
  top: 0px;
  z-index: 99;
}
.bg-white {
  background-color: white;
}
</style>
