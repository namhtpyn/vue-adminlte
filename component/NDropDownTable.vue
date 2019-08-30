<template>
  <n-drop-down-list :value="value" @input="input" :text.sync="getText" :drop-down-width="dropDownWidth" @open="onOpen">
    <template #content="{data}">
      <n-data-table
        :headers="tableHeaders"
        :items="tableItems"
        :searchable="searchable"
        hide-component-footer
        :hide-component-header="!searchable"
        hide-table-footer
        @row-click="item => itemSelect(item, data)"
      >
      </n-data-table>
    </template>
  </n-drop-down-list>
</template>

<script lang="ts">
import { Vue, Component, Model, Emit, Prop } from 'vue-property-decorator'
//import { setTimeout } from 'timers'
import { TableHeader } from '../types/Table'
import NDropDownList from '../component/NDropDownList.vue'
import NDataTable from '../component/NDataTable.vue'
@Component({
  components: {
    NDropDownList,
    NDataTable
  }
})
export default class NDropDownTable extends Vue {
  @Prop(Array) tableHeaders!: TableHeader[]
  @Prop(Array) tableItems!: any[]
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop([String, Number]) dropDownWidth!: string | number
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  //search=
  get getText() {
    if (!this.tableItems || this.tableItems.length <= 0) return ''
    const item = this.tableItems.find(item => item[this.itemValue] === this.value)
    if (!item || Object.hasOwnProperty.call(item, this.itemText)) return ''
    return item[this.itemText].toString()
  }
  itemSelect(item, data) {
    if (Object.hasOwnProperty.call(item, this.itemValue)) this.input(item[this.itemValue])
    data.isOpen = false
  }
  onOpen() {
    if (this.searchable) this.$nextTick(() => this.$children[0].$children[0].$el.querySelector('input').focus())
  }
}
</script>

<style scoped></style>
