<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <n-drop-down-list :text="getText" @open="onOpen" :small="small" :large="large" v-bind="$attrs">
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
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>

    <n-overlay absolute :value="vLoading">
      <n-icon css-class="fa-spin fa-4x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import NDataSource from './Base/NDataSource'
import NBase from './Base/NBase'
import NDataTable from './NDataTable/index.vue'
@Component({ inheritAttrs: false })
export default class NDropDownTable extends Mixins(NBase, NDataSource) {
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean

  @Prop(String) label!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop(Array) rules!: any[]

  @Model('input', [String, Number, Array]) value!: any | any[]

  selectedValue: any[] | object = this.multiple ? [] : {}
  valid: boolean = true
  lazyValidation: boolean = false

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get styleLabel() {
    return {
      'control-label': true,
      'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`
    }
  }
  //search=
  get getText() {
    if (this.multiple) {
      return this.vItems
        .filter(item => (this.value as any[]).includes(item[this.itemValue]))
        .map(item => (item[this.itemText] || '').toString())
        .join('; ')
    } else {
      const item = this.vItems.find(item => item[this.itemValue] === this.value)
      if (item) return (item[this.itemText] || '').toString()
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
    if (this.searchable) this.$nextTick(() => ((this.$refs.table as NDataTable).$refs.search as HTMLInputElement).focus())
  }
  rowClick({ item }, data) {
    if (!this.multiple) this.$nextTick(() => (data.isOpen = false))
  }
  @Watch('selectedValue')
  onSelectedValueChanged(values: any[], any) {
    if (!_.isNil(values)) {
      let output: any
      if (Array.isArray(values)) output = values.map(v => v[this.itemValue])
      else output = values[this.itemValue]

      if (!_.isNil(output) && !_.isEqual(output, this.value)) this.input(output)
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
