<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }" style="position:relative">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <n-drop-down-list :text="getText" :small="small" :large="large" v-bind="$attrs">
      <template #content="{data}">
        <n-time-picker
          :value="value"
          @input="v => onTimePicked(v, data)"
          :step-hour="stepHour"
          :step-minute="stepMinute"
          :step-second="stepSecond"
          :hide-hour="hideHour"
          :hide-minute="hideMinute"
          :hide-second="hideSecond"
        ></n-time-picker>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from './Base/NBase'
@Component({ inheritAttrs: false })
export default class NDropDownTimePicker extends Mixins(NBase) {
  @Prop({ type: Number, default: 1 }) stepHour!: number
  @Prop({ type: Number, default: 1 }) stepMinute!: number
  @Prop({ type: Number, default: 1 }) stepSecond!: number
  @Prop({ type: Boolean, default: false }) hideSecond!: number
  @Prop({ type: Boolean, default: false }) hideMinute!: number
  @Prop({ type: Boolean, default: false }) hideHour!: number

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
    else return this.value
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
  onTimePicked(v, data) {
    //this.$nextTick(() => (data.isOpen = false))
    this.input(v)
    if (!this.lazyValidation || !this.valid) this.validate(v)
  }
}
</script>

<style scoped></style>
