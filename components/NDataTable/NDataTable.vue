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
              >
                <template v-if="!isGrouped(header.value)">
                  <div v-if="header.value === '__selection'">
                    <n-checkbox v-if="multipleSelect" @click="selectAll" v-model="vSelectAll"></n-checkbox>
                  </div>
                  <template v-else>
                    <div style="display:flex; align-items: center">
                      <span style="flex-grow:1">
                        <slot :name="`header.${kebabCase(header.value)}`" :item="header">{{ header.text }}</slot>
                      </span>

                      <i
                        v-if="header.sortable"
                        style="flex:none; width: 14px; cursor:pointer"
                        class="sortable fa fa-sort"
                        @click.stop="toggleSort(header)"
                        :class="`${getSort(header) ? (getSort(header).desc ? 'desc' : 'asc') : ''}`"
                      ></i>
                      <i
                        v-if="header.filterable"
                        style="flex:none; width: 14px; cursor:pointer"
                        class="filterable fa fa-filter"
                        :class="`${isFiltered(header) ? 'active' : ''}`"
                        @click.stop="openFilter(header)"
                      ></i>
                    </div>
                  </template>
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
                <td
                  :class="[cssClass.cell, [validateCellErrorText(header, item) ? 'bg-red' : '']]"
                  :title="validateCellErrorText(header, item)"
                  :style="cellStyle(header)"
                  v-for="(header, colIndex) in tableColumns"
                  :key="colIndex"
                  @dblclick.capture="e => onCellDbClick(e, header)"
                  @blur="e => onEditCell(e, header, item.index)"
                >
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
        <template #top.button-group>
          <n-btn color="primary" @click="vFilterModal.value = []">Clear</n-btn>
        </template>
      </n-data-table>
    </n-modal>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Mixins, Watch, ModelVar } from '@namhoang/vue-property-decorator'

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
  import moment from 'moment'
  import { observe } from '../../extension/SlotObservable'
  import ExcelJS from 'exceljs'
  import FileSaver from 'file-saver'
  import diacritics from 'remove-all-diacritics'
  import { vnodeToString } from './ExportExcel'

  //Mixins limit 5 instances
  class mixin1 extends Mixins(NTableProp, NTableComputed, NTableCRUD, NTableData) {}
  class mixin2 extends Mixins(NTableCssClass, NTableText) {}

  @Component({
    inheritAttrs: false,
  })
  export default class NDataTable extends Mixins(mixin1, mixin2) {
    @ModelVar('input', 'value', {
      type: [Array, String, Number, Boolean, Object],
    })
    vValue: any[] | any
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
      encodeHtml: true,
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
            value: this.vFilterModal.value,
          })
      } else {
        if (_.isEmpty(this.vFilterModal.value)) this.vFilter.splice(index, 1)
        else
          this.vFilter.splice(index, 1, {
            name: this.vFilterModal.name,
            value: this.vFilterModal.value,
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
    onvValueChanged() {
      this.setSelectAllCheckBox()
    }
    @Watch('tableItems')
    onTableItemsChanged() {
      this.setSelectAllCheckBox()
    }
    isArrayEqual(x, y) {
      return _(x)
        .differenceWith(y, _.isEqual)
        .isEmpty()
    }
    setSelectAllCheckBox() {
      if (!this.selectable || !this.multipleSelect) return
      if (!_.isEmpty(this.vValue)) {
        if (!this.keyField) {
          if (this.isArrayEqual(_.cloneDeep(this.tableItems.map(o => o.data)), _.cloneDeep(this.vValue))) this.vSelectAll = true
          else {
            this.vSelectAll = false
          }
        } else {
          if (
            _.isEqual(
              this.vValue.concat().sort(),
              this.tableItems
                .map(i => i.data[this.keyField])
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
      if (e.target.checked) {
        if (!this.keyField) this.vValue = _.uniqWith(this.vValue.concat(_.cloneDeep(this.tableItems.map(i => i.data))), _.isEqual)
        else this.vValue = _.uniqWith(this.vValue.concat(_.cloneDeep(this.tableItems.map(i => i.data[this.keyField]))))
      } else this.vValue = []
    }
    /**helper function */

    private isEmpty(o) {
      return _.isEmpty(o)
    }

    mounted() {
      observe(this, () => this.vToggleReloadHeaders++)
    }
    destroyed() {
      console.log('destroyed')
    }

    validateCellErrorText(header: TableHeader, item: TableItem) {
      const f = header.validate.find(v => v(item.data[header.value]) !== true)
      return f ? f(item.data[header.value]) : ''
    }
    validate() {
      return this.tableItems
        .map(item => ({
          index: item.index,
          error: this.tableColumns
            .map(header => ({
              field: header.text,
              text: this.validateCellErrorText(header, item),
            }))
            .filter(v => v.text !== ''),
        }))
        .filter(v => !_.isEmpty(v.error))
    }
    onCellDbClick(e: Event, header: TableHeader) {
      if (!this.isGrouped(header.value) && header.encodeHtml && header.editable && e.target) {
        ;(e.target as HTMLElement).contentEditable = 'true'
        ;(e.target as HTMLElement).focus()
      }
    }
    onEditCell(e: Event, header: TableHeader, index) {
      ;(e.target as HTMLElement).contentEditable = 'false'
      let value: any = (e.target as HTMLElement).innerText.trim()
      switch (header.type) {
        case 'number':
          value = value === null || value === undefined || value === '' ? value : Number(value)
          break
        case 'date':
          value =
            value === null || value === undefined || value === '' || !moment(value, ['DD-MM-YYYY']).isValid()
              ? value
              : moment(value, ['DD-MM-YYYY']).toDate()
      }
      Vue.set(this.vItems[index], header.value, value)
      ;(e.target as HTMLElement).innerText = header.format(this.vItems[index][header.value])
    }

    private async exportExcel() {
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet('Sheet 1')

      if (this.exportTitle) {
        const titleRow = ws.addRow([this.exportTitle])
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
        titleRow.font = { bold: true, size: 16 }
        titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'c5bd98' } }
        ws.mergeCells(
          titleRow.number,
          1,
          titleRow.number,
          1 + this.tableColumns.filter(h => !h.value.startsWith('__')).length - 1
        )
        if (_.isEmpty(this.exportAfterTitle)) ws.addRow([])
      }

      let rowNumber = ws.rowCount + 1
      if (!_.isEmpty(this.exportAfterTitle)) {
        this.exportAfterTitle.forEach(r => {
          const row = ws.getRow(rowNumber)
          let colNumber = 1
          r.forEach(c => {
            const cell = row.getCell(colNumber)
            cell.value = c.text
            if ((c.colspan != undefined && c.colspan > 1) || (c.rowspan != undefined && c.rowspan > 1)) {
              ws.mergeCells(
                rowNumber,
                colNumber,
                c.rowspan && c.rowspan > 1 ? rowNumber - 1 + c.rowspan : rowNumber,
                c.colspan && c.colspan > 1 ? colNumber - 1 + c.colspan : colNumber
              )
            }

            if (c.colspan != undefined && c.colspan === -1) {
              ws.mergeCells(
                rowNumber,
                colNumber,
                rowNumber,
                colNumber + this.tableColumns.filter(h => !h.value.startsWith('__')).length - 1
              )
            }
            colNumber++
          })
          rowNumber++
        })
      }

      //Header
      if (!this.hideHeader) {
        this.headersCollection.forEach(r => {
          const row = ws.getRow(rowNumber)
          row.font = { bold: true }
          row.alignment = { vertical: 'middle', horizontal: 'center' }

          let colNumber = 1
          r.filter(h => !h.value.startsWith('__')).forEach(c => {
            while (!_.isEqual(row.getCell(colNumber).master, row.getCell(colNumber))) {
              colNumber++
            }

            const cell = row.getCell(colNumber)
            if (!this.isGrouped(c.value)) cell.value = c.text
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            }

            if (c._rowspan > 1 || c._colspan > 1) {
              ws.mergeCells(rowNumber, colNumber, rowNumber + c._rowspan - 1, colNumber + c._colspan - 1)
            }
            colNumber++
          })
          rowNumber++
        })
      }

      //Body
      const tableItems = this.itemsGrouped(this.itemsExpanded(this.tableItems))
      tableItems.forEach(r => {
        const row = ws.getRow(rowNumber)
        let colNumber = 1
        if (r.type === 'group') {
          if (r.group) {
            for (let i = 0; i <= r.group.level; i++) {
              const cell = row.getCell(colNumber + i)
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
              if (i == r.group.level) {
                cell.value = (r.group.header.text ? r.group.header.text + ': ' : '') + r.group.header.format(r.group.text)
                ws.mergeCells(
                  rowNumber,
                  colNumber + r.group.level,
                  rowNumber,
                  colNumber + this.tableColumns.filter(h => !h.value.startsWith('__')).length - 1
                )
              }
            }
          }
        } else if (r.type === 'expand') {
        } else if (r.type === 'item')
          this.tableColumns
            .filter(h => !h.value.startsWith('__'))
            .forEach(c => {
              const cell = row.getCell(colNumber)

              if (!this.isGrouped(c.value)) {
                if (this.$scopedSlots[`item.${_.kebabCase(c.value)}`] != undefined)
                  cell.value = vnodeToString(
                    (this.$scopedSlots[`item.${_.kebabCase(c.value)}`] as any)({
                      item: this.vItems[r.index],
                      value: r.data[c.value],
                      index: r.index,
                      rowIndex: r.index,
                    })
                  ).textContent
                else cell.value = c.format(r.data[c.value])
              }
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }

              colNumber++
            })
        rowNumber++
      })

      //Footer
      if (!this.hideFooter) {
        if (this.$scopedSlots[`footer`] == undefined) {
          const row = ws.addRow([])
          let colNumber = 1
          this.tableColumns
            .filter(h => !h.value.startsWith('__'))
            .forEach(c => {
              const cell = row.getCell(colNumber)
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
              if (!this.isGrouped(c.value)) {
                if (this.$scopedSlots[`footer.${_.kebabCase(c.value)}`] != undefined)
                  cell.value = vnodeToString(
                    (this.$scopedSlots[`footer.${_.kebabCase(c.value)}`] as any)({
                      items: this.vItems,
                    })
                  ).textContent
                else cell.value = this.footerSummary(this.vItems, c)
              }

              colNumber++
            })
        } else {
          let footerEl = vnodeToString(
            (this.$scopedSlots[`footer`] as any)({
              items: this.vItems,
              headers: this.headersCollection,
            })
          )
          //console.log(footerEl)
          footerEl.querySelectorAll('tr').forEach(r => {
            const row = ws.getRow(rowNumber)
            let colNumber = 1
            r.querySelectorAll('td').forEach((c, i) => {
              while (!_.isEqual(row.getCell(colNumber).master, row.getCell(colNumber))) {
                colNumber++
              }
              const cell = row.getCell(colNumber)
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }

              cell.value = c.textContent
              let colOffset = 0
              if (i == 0 && this.tableColumns.some(h => h.value === '__selection')) colOffset = 1
              const colspan = Number(c.getAttribute('colspan')) || 1
              const rowspan = Number(c.getAttribute('rowspan')) || 1
              console.log(rowNumber, colNumber, rowNumber + rowspan - 1, colNumber + colspan - 1 - colOffset)
              ws.mergeCells(rowNumber, colNumber, rowNumber + rowspan - 1, colNumber + colspan - 1 - colOffset)

              colNumber++
            })
            rowNumber++
          })
        }
      }
      /**
         *
         * <tfoot v-if="!hideFooter">
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
         */

      for (let i = 1; i <= ws.rowCount; i++) {
        ws.getRow(i).font = { name: 'Times New Roman', size: 13, ...(ws.getRow(i).font || {}) }
      }

      ws.columns.forEach(c => {
        c.width = c.width || 12
        c.numFmt = '@'
      })

      FileSaver.saveAs(
        new Blob([await wb.xlsx.writeBuffer()]),
        moment().format('DD-MM-YYYY') +
          '_' +
          (this.exportTitle ? _.snakeCase(diacritics.remove(this.exportTitle)) : 'export') +
          '.xlsx'
      )
      // let wb = XLSX.utils.book_new()
      // var ws_name = 'SheetJS'
      // var ws_data = this.tableItems.map(r =>
      //   this.tableColumns.filter(h => !h.value.startsWith('__')).map(c => c.format(r.data[c.value]))
      // )
      // var ws = XLSX.utils.aoa_to_sheet(ws_data)
      // var range = XLSX.utils.decode_range(ws['!ref'] || '')
      // for (var r = range.s.r; r <= range.e.r; r++) {
      //   for (var c = range.s.c; c <= range.e.c; c++) {
      //     var cellName = XLSX.utils.encode_cell({ c: c, r: r })
      //     ws[cellName].z = '@'
      //   }
      // }
      // //ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }]
      // XLSX.utils.book_append_sheet(wb, ws, ws_name)
      // XLSX.writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
      //Show all to export then reverse back
      // this.vLoading = true
      // const itemPerPage = this.vItemPerPage
      // this.vItemPerPage = -1
      // this.$nextTick(() => {
      //   const wb = XLSX.utils.table_to_book(this.$refs.table)
      //   XLSX.writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
      //   this.vItemPerPage = itemPerPage
      //   this.vLoading = false
      // })
    }
    kebabCase(v) {
      return _.kebabCase(v)
    }
  }
</script>

<style scoped>
  .n-data-table thead th .sortable,
  .n-data-table thead th .filterable {
    opacity: 0.3;
  }
  .n-data-table thead th .sortable:hover,
  .n-data-table thead .sortable.asc,
  .n-data-table thead .sortable.desc,
  .n-data-table thead th .filterable:hover,
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
