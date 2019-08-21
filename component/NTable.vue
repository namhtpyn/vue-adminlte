<template>
  <div>
    <table :class="tableCssClass">
      <thead>
        <tr :class="headerRowCssClass">
          <th v-for="(header,index) in headers" :key="index" :class="headerCellCssClass">
            <slot :name="`header.${header.value}`" :item="header">{{header.text}}</slot>
          </th>
        </tr>
      </thead>
      <tbody v-if="hasItems">
        <tr v-for="(item,rowIndex) in items" :key="rowIndex">
          <td v-for="(header,colIndex) in headers" :key="colIndex">
            <slot :name="`item.${header.value}`" :item="item">{{ item[header.value] }}</slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="text-center">{{noDataText}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td v-for="(header,colIndex) in headers" :key="colIndex">
            <slot :name="`item.${header.value}`"></slot>
          </td>
        </tr>
      </tfoot>
    </table>

    <div style="display:flex">
      <div
        class="summary hidden-xs form-inline form-group form-group-sm"
        style="display:inline-block"
      >
        <div class="form-control-static">Trang {{ page }}/{{ pageLength}} ({{ items.length}} mục)</div>
      </div>
      <div style="flex:auto">
        <n-pagination :length="pageLength" v-model="page" small class="no-margin"></n-pagination>
      </div>
      <div>
        <select
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
import { Vue, Component, Prop } from "vue-property-decorator";
import { TableHeader } from "../types/Table";
import isEmpty from "lodash/isEmpty";
import { VNode } from "vue";
import NPagination from "./NPagination.vue";
@Component({ components: { NPagination } })
export default class NTable extends Vue {
  @Prop({ type: Boolean, default: true }) bordered!: boolean;
  @Prop({ type: Boolean, default: true }) hovered!: boolean;
  @Prop({ type: Boolean, default: false }) densed!: boolean;
  @Prop({ type: Boolean, default: false }) striped!: boolean;

  @Prop({ type: String, default: "Không có dữ liệu" }) noDataText!: string;

  @Prop(Array) headers: TableHeader[];
  @Prop(Array) items: any[];

  /** Computed */
  get tableCssClass() {
    let css = "table ";
    css += this.bordered ? "table-bordered " : "";
    css += this.hovered ? "table-hover " : "";
    css += this.densed ? "table-condensed " : "";
    css += this.striped ? "table-striped " : "";
    css += this.getCssClass("table") || "";
    return css;
  }
  get headerRowCssClass() {
    return this.getCssClass("header-row") || "";
  }
  get headerCellCssClass() {
    return this.getCssClass("header-cell") || "";
  }
  get hasItems() {
    return !isEmpty(this.items);
  }
  /**pagination */
  itemPerPage = 5;
  page = 1;
  get pageLength() {
    return Math.ceil(this.items.length / this.itemPerPage);
  }

  mounted() {
    console.log(this.$slots.default.find(node => node.tag === "css-class"));
  }

  /**helper function */
  getCssClass(tag: string) {
    let css = this.$slots.default.find(node => node.tag === "css-class");
    if (!css.data) return "";
    if (!css.data.hasOwnProperty("attrs") || !css.data.attrs) return "";
    if (!css.data.attrs.hasOwnProperty(tag)) return "";
    return css.data.attrs[tag];
  }
}
</script>

<style>
</style>