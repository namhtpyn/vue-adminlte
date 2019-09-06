<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <n-drop-down-list :value="value" @input="input" :text.sync="getText" :drop-down-width="dropDownWidth" @open="onOpen">
      <template #content="{data}">
        <n-data-table
          :headers="tableHeaders"
          :items="tableItems"
          :searchable="searchable"
          :hide-top="!searchable"
          hide-table-footer
          @row-click="e => itemSelect(e, data)"
        >
        </n-data-table>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Emit, Prop } from 'vue-property-decorator'
import isEmpty from 'lodash/isEmpty'
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
  @Prop() label!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  valid: boolean = true
  lazyValidation: boolean = false
  get hasLabel() {
    return !isEmpty(this.label)
  }
  //search=
  get getText() {
    if (!this.tableItems || this.tableItems.length <= 0) return ''
    const item = this.tableItems.find(item => item[this.itemValue] === this.value)
    if (!item || !Object.hasOwnProperty.call(item, this.itemText)) return ''
    return item[this.itemText].toString()
  }
  get errorText() {
    if (!this.valid && this.rules) {
      const f = this.rules.find(r => r(this.value) !== true)
      return f ? f(this.value) : ''
    }
    return ''
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
  itemSelect(e, data) {
    if (Object.hasOwnProperty.call(e.item, this.itemValue)) this.input(e.item[this.itemValue])
    if (!this.lazyValidation || !this.valid) this.validate(e.item[this.itemValue])
    data.isOpen = false
  }
  onOpen() {
    if (this.searchable) this.$nextTick(() => this.$children[0].$children[0].$el.querySelector('input').focus())
  }
}
</script>

<style scoped></style>
