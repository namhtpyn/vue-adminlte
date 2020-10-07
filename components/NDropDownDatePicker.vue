<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      <slot name="label" :text="label">{{ label }}</slot>
    </label>
    <n-drop-down-list :text="getText" :small="small" :large="large" v-bind="$attrs" @clear="vValue = null">
      <template #content="{data}">
        <div style="display: flex; justify-content: center;">
          <n-date-picker :value="vValue" @input="v => onDatePicked(v, data)"></n-date-picker>
        </div>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import moment from 'moment'
@Component({ inheritAttrs: false })
export default class NDropDownDatePicker extends Vue {
  @ModelVar('input', 'value', { type: String }) vValue!: string
  @Prop({ type: String, default: 'DD/MM/YYYY' }) format!: string

  @Prop(String) label!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop(Array) rules!: any[]

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
    return moment(this.vValue).isValid() ? moment(this.vValue).format(this.format) : ''
  }
  get errorText() {
    if (!this.valid && this.rules) {
      const f = this.rules.find(r => r(this.vValue) !== true)
      return f ? f(this.vValue) : ''
    }
    return ''
  }

  onDatePicked(v, data) {
    this.$nextTick(() => (data.isOpen = false))
    this.vValue = v
    if (!this.lazyValidation || !this.valid) this.validate(v)
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
}
</script>

<style scoped></style>
