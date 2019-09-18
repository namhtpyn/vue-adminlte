<template>
  <div :class="'form-group ' + (!valid ? 'has-error' : '')">
    <label v-if="!hideDetails" class="control-label">{{ label }}</label>
    <select :class="cCssClass" :value="value" @input="e => input(e.target.value)">
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
import { Component, Prop, Emit, Model, Mixins } from 'vue-property-decorator'
import NDataSource from './Base/NDataSource'
@Component({ inheritAttrs: false })
export default class NSelect extends Mixins(NDataSource) {
  @Prop({ type: Boolean, default: false }) hideErrorText!: boolean
  @Prop(String) label!: string
  @Prop(String) cssClass!: string
  @Prop(Array) rules!: any[]
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Model('input') value!: any
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
      const f = this.rules.find(r => r(this.value) !== true)
      return f ? f(this.value) : ''
    }
    return ''
  }
  validate(value) {
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
  }
}
</script>

<style scoped></style>
