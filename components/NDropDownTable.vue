<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }" :style="componentStyle">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      <slot name="label" :text="label">{{ label }}</slot>
    </label>
    <n-drop-down-list :text="getText" @open="onOpen" :small="small" :large="large" v-bind="$attrs">
      <template #content="{data}">
        <n-data-table
          ref="table"
          v-model="selectedValue"
          :items="vItems"
          :searchable="searchable"
          :hide-top="!searchable"
          :multiple-select="multiple"
          selectable
          row-select
          hide-footer
          :hide-bottom="!paging"
          sticky-top
          @error="error"
          @row-click="(e) => rowClick(e, data)"
        >
          <slot></slot>
        </n-data-table>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>

    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-1x fa-fw">circle-o-notch</n-icon>
        <div class="small">Đang tải dữ liệu</div>
      </div>
    </n-overlay>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, ModelVar, Mixins } from '@namhoang/vue-property-decorator'
  import _ from 'lodash'
  import NDataTable from './NDataTable/index.vue'
  import NItems from './Base/NItems'
  @Component({ inheritAttrs: false })
  export default class NDropDownTable extends Mixins(NItems) {
    @Prop({ type: String, default: 'text' }) itemText!: string
    @Prop({ type: String, default: 'value' }) itemValue!: string
    @Prop({ type: Boolean, default: false }) searchable!: boolean
    @Prop({ type: Boolean, default: false }) multiple!: boolean
    @Prop({ type: Boolean, default: false }) paging!: boolean

    @Prop(String) label!: string
    @Prop({ type: Boolean, default: false }) small!: boolean
    @Prop({ type: Boolean, default: false }) large!: boolean
    @Prop({ type: Boolean, default: true }) form!: boolean
    @Prop({ type: Boolean, default: false }) hideErrorText!: string
    @Prop(Array) rules!: any[]

    @ModelVar('input', 'value', [String, Number, Array]) vValue!: any | any[]

    valid: boolean = true
    lazyValidation: boolean = false

    get hasLabel() {
      return !_.isEmpty(this.label)
    }
    get styleLabel() {
      return {
        'control-label': true,
        'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`,
      }
    }
    //search=
    get getText() {
      if (this.multiple) {
        return this.vItems
          .filter((item) => (this.vValue as any[]).includes(item[this.itemValue]))
          .map((item) => (item[this.itemText] || '').toString())
          .join('; ')
      } else {
        const item = this.vItems.find((item) => item[this.itemValue] === this.vValue)
        if (item) return (item[this.itemText] || '').toString()
      }
      return ''
    }
    get errorText() {
      if (!this.valid && this.rules) {
        const f = this.rules.find((r) => r(this.vValue) !== true)
        return f ? f(this.vValue) : ''
      }
      return ''
    }
    validate(value) {
      this.valid = true
      if (this.rules) this.valid = !this.rules.some((e) => e(value) !== true)
      return this.valid
    }

    onOpen() {
      if (this.searchable) this.$nextTick(() => ((this.$refs.table as NDataTable).$refs.search as HTMLInputElement).focus())
    }
    rowClick({ item }, data) {
      if (!this.multiple) this.$nextTick(() => (data.isOpen = false))
    }

    @Watch('vValue', { immediate: true })
    onValueChanged(value) {
      this.$nextTick(() => {
        if (!this.valid || !this.lazyValidation) {
          this.validate(value)
        }
      })
    }

    get selectedValue() {
      if (Array.isArray(this.vValue))
        return this.vItems.filter((item) => (this.vValue as any[]).includes(item[this.itemValue])) || []
      else return this.vItems.find((item) => item[this.itemValue] === this.vValue) || {}
    }
    set selectedValue(values) {
      if (!_.isNil(values)) {
        let output: any
        if (Array.isArray(values)) output = values.map((v) => v[this.itemValue])
        else output = values[this.itemValue]

        if (!_.isNil(output) && !_.isEqual(output, this.vValue)) this.vValue = output
      }
    }
    get componentStyle() {
      const style: object[] = []
      if (this.vLoading) style.push({ position: 'relative' })
      return style
    }
  }
</script>

<style scoped></style>
