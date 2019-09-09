<template>
  <div :class="cBoxCssClass">
    <div class="box-header" style="display:flex">
      <h3 class="box-title" style="flex:auto">{{ caption }}</h3>

      <div>
        <div v-if="enableSearch" class="input-group input-group-sm" style="width: 250px;">
          <input type="text" name="table_search" class="form-control pull-right" v-model="nSearch" placeholder="Tìm kiếm" />

          <div class="input-group-btn">
            <button type="submit" class="btn btn-default">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="box-body no-padding">
      <table :class="cTableCssClass">
        <slot name="head" :headers="headers">
          <thead>
            <tr v-for="level in cHeaderRowCount" :key="level">
              <th
                v-for="(header, index) in getHeadersAtLevel(level)"
                :key="index"
                @click="sort(header.value)"
                :colspan="header.children ? getArrayChildren(header.children).length : 1"
                :rowspan="header.children ? 1 : cHeaderRowCount"
                :class="{
                  sortable: header.sortable || false,
                  asc: nSortObject.field === header.value && nSortObject.asc,
                  desc: nSortObject.field === header.value && !nSortObject.asc
                }"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
        </slot>
        <tbody>
          <tr v-for="(row, rowIndex) in cItemsInPage" :key="rowIndex">
            <td v-for="(col, colIndex) in cHeadersChildren" :key="colIndex">
              <slot :name="`item.${col.value}`" :item="row">{{ row[col.value] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box-footer" style="display:flex">
      <div style="flex:auto">
        <div class="summary hidden-xs form-inline form-group form-group-sm pull-left" style="display:inline-block">
          <div class="form-control-static">Trang {{ nPage }}/{{ cPageLength }} ({{ items.length }} mục)</div>
        </div>
        <n-pagination :length="cPageLength" v-model="nPage" small class="no-margin pull-left"></n-pagination>
      </div>
      <div>
        <select
          @change="itemPerPageChange"
          class="form-control"
          style="width:70px;display: inline-block; height:30px;  padding: 6px 6px"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import NPagination from './NPagination.vue'
@Component({ components: { NPagination }, inheritAttrs: false })
export default class NDataTableOld extends Vue {
  @Prop(Array) headers!: any[]
  @Prop(Array) items!: any[]
  @Prop(String) caption!: string
  @Prop(Boolean) enableSearch!: boolean
  @Prop({ type: Boolean, default: false }) boxFlat!: boolean
  @Prop({ type: Boolean, default: true }) bordered!: boolean
  @Prop({ type: Boolean, default: true }) hovered!: boolean
  @Prop({ type: Boolean, default: false }) condensed!: boolean
  @Prop({ type: Boolean, default: true }) striped!: boolean
  nPage = 1
  nItemPerPage: number = 5
  nSortObject = { field: '', asc: true }
  nSearch = ''

  //boxCssClass
  get cBoxCssClass() {
    let css = 'box '
    css += this.boxFlat ? 'box-flat ' : 'box-bordered '
    return css
  }
  //tableClass
  get cTableCssClass() {
    let css = 'table '
    css += this.bordered ? 'table-bordered ' : ''
    css += this.hovered ? 'table-hover ' : ''
    css += this.condensed ? 'table-condensed ' : ''
    css += this.striped ? 'table-striped ' : ''
    return css
  }

  //Data body
  get cItemsInPage() {
    let items = this.items.slice()
    if (this.nSearch) {
      items = items.filter(r =>
        Object.values(r).some(c =>
          c
            .toString()
            .toUpperCase()
            .includes(this.nSearch.toUpperCase())
        )
      )
    }
    if (this.nSortObject.field !== '') items = items.sort(this.compare).map(o => o)

    return items.slice((this.nPage - 1) * this.nItemPerPage, this.nPage * this.nItemPerPage)
  }

  //Header
  get cHeaders() {
    return this.headers
  }
  get cHeaderRowCount() {
    return this.getArrayDepth(this.cHeaders)
  }
  get cHeadersChildren() {
    return this.getArrayChildren(this.cHeaders)
  }
  getHeadersAtLevel(level: number) {
    return this.getArrayAtLevel(this.cHeaders, level)
  }

  //Header sort
  sort(field: string) {
    const hfield = this.cHeadersChildren.find(o => (o.value || '') === field)

    if (!hfield || (hfield.sortable || false) !== true) return
    if (this.nSortObject.field !== field) {
      this.nSortObject.field = field
      this.nSortObject.asc = true
    } else if (this.nSortObject.asc) {
      this.nSortObject.asc = false
    } else {
      this.nSortObject.field = ''
    }
  }
  compare(a: any, b: any) {
    if (this.nSortObject.field === '') return 0

    const genreA = a[this.nSortObject.field]
    const genreB = b[this.nSortObject.field]

    let comparison = 0
    if (genreA > genreB) {
      comparison = this.nSortObject.asc ? 1 : -1
    } else if (genreA < genreB) {
      comparison = this.nSortObject.asc ? -1 : 1
    }
    return comparison
  }

  //Pagination
  get cPageLength() {
    return Math.ceil(this.items.length / this.nItemPerPage)
  }
  itemPerPageChange(e: any) {
    this.nItemPerPage = Number(e.target.value)
    this.nPage = 1
  }

  //Helper
  getArrayDepth(value: any[], childrenField = 'children') {
    const hasChildren = value.filter(o => Object.prototype.hasOwnProperty.call(o, childrenField))
    if (hasChildren.length <= 0) return 1
    return Array.isArray(value) ? 1 + Math.max(...hasChildren.map(o => this.getArrayDepth(o[childrenField], childrenField))) : 0
  }
  getArrayAtLevel(array: any, level = 1, childrenField = 'children') {
    let ar = array
    for (let i = 1; i < level; i++)
      ar = ar.filter((a: any) => Object.prototype.hasOwnProperty.call(a, childrenField)).flatMap((a: any) => a[childrenField])
    return ar
  }
  getArrayChildren(array: any[], childrenField = 'children') {
    let save: any[] = [] //array.filter((o: any) => !o.hasOwnProperty("children"));
    array.forEach((item: any) => {
      if (!Object.prototype.hasOwnProperty.call(item, childrenField)) save.push(item)
      if (Array.isArray(item[childrenField])) save = save.concat(this.getArrayChildren(item[childrenField], childrenField))
    })
    return save
  }
  mounted() {
    console.log(this.getArrayChildren(this.headers))
  }
}
</script>

<style scoped>
.table thead .sortable {
  cursor: pointer;
}
.table thead .sortable.asc:after {
  content: '↓';
}
.table thead .sortable.desc:after {
  content: '↑';
}
.box-flat {
  border: unset;
  box-shadow: unset;
}
.box-bordered {
  border: 1px solid #d2d6de;
  box-shadow: unset;
}
</style>
