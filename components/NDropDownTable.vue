<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <n-drop-down-list :value="value" @input="input" :text.sync="getText" :drop-down-width="dropDownWidth" @open="onOpen">
      <template #content="{data}">
        <n-data-table
          ref="table"
          :items="tableItems"
          :read-url="readUrl"
          :searchable="searchable"
          :hide-top="!searchable"
          hide-table-footer
          @row-click="e => itemSelect(e, data)"
          @error="error"
        >
          <slot></slot>
        </n-data-table>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Emit, Prop, Ref } from 'vue-property-decorator'
import _ from 'lodash'
import NDropDownList from './NDropDownList.vue'
import NDataTable from './NDataTable.vue'
@Component({
  components: {
    NDropDownList,
    NDataTable
  }
})
export default class NDropDownTable extends Vue {
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop(String) readonly readUrl!: string
  @Prop([String, Number]) dropDownWidth!: string | number
  @Prop() label!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop(Array) rules!: any[]
  @Ref('table') table!: NDataTable
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  @Emit() error(e) {}
  valid: boolean = true
  lazyValidation: boolean = false
  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  //search=
  get getText() {
    if (this.table && this.table.items && this.table.items.length > 0) {
      const item = this.table.items.find(item => item[this.itemValue] === this.value)
      if (item && Object.hasOwnProperty.call(item, this.itemText)) return item[this.itemText].toString()
    }
    return ''
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
  setItems(items: any[]) {
    this.$nextTick(() => {
      if (this.table) this.table.setItems(items)
    })
  }
  get items() {
    return this.table.items
  }
}
</script>

<style scoped></style>
