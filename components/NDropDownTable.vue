<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="{ 'font-size': this.small ? '12px' : this.large ? '18px' : '14px' }">
      {{ label }}
    </label>
    <n-drop-down-list :text="getText" :drop-down-width="dropDownWidth" @open="onOpen" :hint="hint" :small="small" :large="large">
      <template #content="{data}">
        <n-data-table
          ref="table"
          v-model="selectedValue"
          :items="vItems"
          :searchable="searchable"
          :hide-top="!searchable"
          :multiple="multiple"
          selectable
          row-select
          hide-footer
          hide-bottom
          sticky-top
          @error="error"
          @row-click="e => rowClick(e, data)"
        >
          <slot></slot>
        </n-data-table>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
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

  @Model('input', [String, Number, Array]) value!: any | any[]

  selectedValue: any[] | object = this.multiple ? [] : {}
  valid: boolean = true
  lazyValidation: boolean = false

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  //search=
  get getText() {
    console.log('xxx')
    if (this.multiple) {
      return this.vItems
        .filter(item => (this.value as any[]).includes(item[this.itemValue]))
        .map(item => item[this.itemText].toString())
        .join('; ')
    } else {
      const item = this.vItems.find(item => item[this.itemValue] === this.value)
      if (item) return item[this.itemText].toString()
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

  onOpen() {
    if (this.searchable) this.$nextTick(() => this.$children[0].$children[0].$el.querySelector('input').focus())
  }
  rowClick({ item }, data) {
    if (!this.multiple) data.isOpen = false
  }
  @Watch('selectedValue')
  onSelectedValueChanged(values: any[], any) {
    if (!_.isNil(values)) {
      if (Array.isArray(values)) this.input(values.map(v => v[this.itemValue]))
      else this.input(values[this.itemValue])
    }
  }
  created() {
    if (Array.isArray(this.value))
      this.selectedValue = this.vItems.filter(item => (this.value as any[]).includes(item[this.itemValue])) || []
    else this.selectedValue = this.vItems.find(item => item[this.itemValue] === this.value) || {}
  }
}
</script>

<style scoped></style>
