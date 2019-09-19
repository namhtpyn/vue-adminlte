<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }" style="position:relative">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <n-drop-down-list :text="getText" :small="small" :large="large" v-bind="$attrs">
      <template #content="{data}">
        <div style="display: flex; justify-content: center;">
          <n-date-picker :value="value" @input="v => onDatePicked(v, data)"></n-date-picker>
        </div>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from './Base/NBase'
import moment from 'moment'
@Component({ inheritAttrs: false })
export default class NDropDownDatePicker extends Mixins(NBase) {
  @Prop({ type: String, default: 'DD/MM/YYYY' }) format!: string

  @Prop(String) label!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop(Array) rules!: any[]

  @Model('input', { type: String, required: true }) value!: string

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
    if (_.isNil(this.value)) return ''
    else return moment(this.value).format(this.format)
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
  onDatePicked(v, data) {
    this.$nextTick(() => (data.isOpen = false))
    this.input(v)
    if (!this.lazyValidation || !this.valid) this.validate(v)
  }
}
</script>

<style scoped></style>
