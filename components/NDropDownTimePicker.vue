<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      <slot name="label" :text="label">{{ label }}</slot>
    </label>
    <n-drop-down-list :text="getText" :small="small" :large="large" v-bind="$attrs" @open="onOpen">
      <template #content="{data}">
        <div style="display: flex; justify-content: center;">
          <n-time-picker
            ref="timePicker"
            :value="vValue"
            @input="v => onTimePicked(v, data)"
            :step-hour="stepHour"
            :step-minute="stepMinute"
            :step-second="stepSecond"
            :hide-hour="hideHour"
            :hide-minute="hideMinute"
            :hide-second="hideSecond"
          ></n-time-picker>
        </div>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import moment from 'moment'
import NTimePicker from './NTimePicker.vue'
@Component({ inheritAttrs: false })
export default class NDropDownTimePicker extends Vue {
  @ModelVar('input', 'value', { type: [Date, String] }) vValue!: Date | string

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
  @Ref('timePicker') timePicker!: NTimePicker

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
    const date = moment(this.vValue)
    if (!date.isValid()) return ''
    const result: string[] = []
    if (!this.hideHour) result.push(_.padStart(date.get('hour').toString(), 2, '0'))
    if (!this.hideMinute) result.push(_.padStart(date.get('minute').toString(), 2, '0'))
    if (!this.hideSecond) result.push(_.padStart(date.get('second').toString(), 2, '0'))
    return result.join(':')
  }
  get errorText() {
    if (!this.valid && this.rules) {
      const f = this.rules.find(r => r(this.vValue) !== true)
      return f ? f(this.vValue) : ''
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
    this.vValue = v
    if (!this.lazyValidation || !this.valid) this.validate(v)
  }
  onOpen() {
    this.$nextTick(() => this.timePicker.scrollIntoViewIfNeeded())
  }
}
</script>

<style scoped></style>
