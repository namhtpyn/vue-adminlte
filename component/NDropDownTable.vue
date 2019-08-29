<template>
  <n-drop-down-list :value="value" @input="input" :text.sync="getText">
    <template #content="{data}">
      <n-data-table
        :headers="tableHeaders"
        :items="tableItems"
        :component-footer="false"
        :component-header="false"
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

<style scoped>
.input-flat,
.input-flat:active {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: content-box;
  box-shadow: none;
}
.auto-height {
  height: auto;
  position: absolute;
  width: 100%;
  padding: 0px 0px;
}
</style>
