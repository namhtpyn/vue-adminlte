<template>
  <div :class="'form-group ' + (!valid ? 'has-error' : '')">
    <label v-if="!hideDetails" class="control-label">{{ label }}</label>
    <select :class="cCssClass" :value="vModel" @input="e => input(e.target.value)">
      <option v-for="(item, idx) in items" :key="idx" :value="item[itemValue]">{{ item[itemText] }}</option>
    </select>
    <span v-if="!valid && !hideDetails" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Prop, Emit, Model, Mixins } from 'vue-property-decorator'
import NDataSource from './Base/NDataSource'
@Component({ inheritAttrs: false })
export default class NSelect extends Mixins(NDataSource) {
  @Prop({ type: Boolean, default: false }) hideDetails!: boolean
  @Prop(String) label!: string
  @Prop(String) cssClass!: string
  @Prop(Array) rules!: any[]
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Model('input') vModel!: any
  @Emit() async input(e) {
    this.validate(e)
  }
  valid: boolean = true
  get cCssClass() {
    const css = 'form-control ' + this.cssClass
    return css
  }
  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get errorText() {
    if (this.rules) {
      const f = this.rules.find(r => r(this.vModel) !== true)
      return f ? f(this.vModel) : ''
    }
    return ''
  }
  validate(value) {
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
  }
}
</script>

<style scoped></style>
