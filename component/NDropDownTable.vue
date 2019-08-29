<template>
  <n-drop-down-list :value="value" @input="input" :text.sync="getText" :drop-down-width="dropDownWidth">
    <template #content="{data}">
      <n-data-table
        :headers="tableHeaders"
        :items="tableItems"
        hide-component-footer
        hide-component-header
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
  @Prop([String, Number]) dropDownWidth!: string | number
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  get getText() {
    return this.tableItems.find(item => item[this.itemValue] === this.value)[this.itemText]
  }
  itemSelect(item, data) {
    this.input(item[this.itemValue])
    setTimeout(() => (data.isOpen = false), 100)
  }
}
</script>

<style scoped></style>
