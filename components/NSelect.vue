<template>
  <div :class="'form-group ' + (!valid ? 'has-error' : '')">
    <label v-if="!!label" class="control-label">
      <slot name="label" :text="label">{{ label }}</slot>
    </label>
    <select class="form-control" v-bind="$attrs" :value="value" @input="e => input(e.target.value)">
      <option v-for="(item, idx) in vItems" :key="idx" :value="item[itemValue]">{{ item[itemText] }}</option>
    </select>
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
import _ from 'lodash'
import { Component, Prop, Mixins, ModelVar } from '@namhoang/vue-property-decorator'
import NItems from './Base/NItems'
@Component({ inheritAttrs: false })
export default class NSelect extends Mixins(NItems) {
  @ModelVar('input', 'value', { type: [String, Number] }) vValue!: string | number
  @Prop({ type: Boolean, default: false }) hideErrorText!: boolean
  @Prop(String) label!: string
  @Prop(Array) rules!: any[]
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  input(e) {
    this.vValue = e
    this.validate(e)
  }
  valid: boolean = true

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get errorText() {
    if (this.rules) {
      const f = this.rules.find(r => r(this.vValue) !== true)
      return f ? f(this.vValue) : ''
    }
    return ''
  }
  validate(value) {
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
}
</script>

<style scoped></style>
