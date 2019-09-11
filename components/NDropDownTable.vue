<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="{ 'font-size': this.small ? '12px' : this.large ? '18px' : '14px' }">
      {{ label }}
    </label>
    <n-drop-down-list
      :value="value"
      @input="input"
      :text.sync="getText"
      :drop-down-width="dropDownWidth"
      @open="onOpen"
      :hint="hint"
      :small="small"
      :large="large"
    >
      <template #content="{data}">
        <n-data-table
          ref="table"
          v-model="selectedValue"
          :items="vItems"
          :searchable="searchable"
          :hide-top="!searchable"
          selectable
          row-select
          hide-footer
          hide-bottom
          sticky-top
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
import { Component, Model, Prop, Ref, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NDataTable from './NDataTable/index.vue'
import NDataSource from './Base/NDataSource'
import NBase from './Base/NBase'
@Component({})
export default class NDropDownTable extends Mixins(NBase, NDataSource) {
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean

  @Prop([String, Number]) dropDownWidth!: string | number
  @Prop(String) label!: string
  @Prop(String) hint!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop(Array) rules!: any[]

  @Ref('table') table!: NDataTable
  @Model('input', [String, Number]) value!: any

  selectedValue: any[] | any = ''
  valid: boolean = true
  lazyValidation: boolean = false

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  //search=
  get getText() {
    if (this.table && this.table.vItems && this.table.vItems.length > 0) {
      const item = this.table.vItems.find(item => item[this.itemValue] === this.value)
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
}
</script>

<style scoped></style>
