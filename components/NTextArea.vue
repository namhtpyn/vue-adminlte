<template>
  <div :class="classComponent">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <textarea
      :class="cClass"
      :placeholder="hint"
      :value="value"
      @input="e => input(e.target.value)"
      @blur="input(value)"
      v-bind="$attrs"
      @keypress="keypress"
    />
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Model } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NTextArea extends Vue {
  @Prop(String) label!: string
  @Prop(String) hint!: string
  @Prop(Array) rules!: any[]
  @Prop({ type: String, default: 'default' }) color!: string
  @Prop({ type: Boolean, default: true }) form!: string
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: String, default: '' }) cssClass!: string
  @Model('input', { type: [String, Number] }) value!: string | number
  @Emit() input(e) {
    if (!this.lazyValidation || !this.valid) this.validate(e)
  }
  @Emit('append-btn-click') appendBtnClick(e) {}
  @Emit('prepend-btn-click') prependBtnClick(e) {}
  @Emit() keypress(e) {}
  valid: boolean = true
  lazyValidation: boolean = false
  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get cClass() {
    let css = 'form-control '
    css += this.large ? ' input-lg' : ''
    css += this.small ? ' input-sm' : ''
    return css
  }
  get errorText() {
    if (!this.valid && this.rules) {
      const f = this.rules.find(r => r(this.value) !== true)
      return f ? f(this.value) : ''
    }
    return ''
  }
  get classComponent() {
    let css = this.form ? 'form-group ' : ''
    css += !this.valid ? 'has-error ' : ''
    css += this.cssClass ? this.cssClass : ''
    return css
  }
  get styleLabel() {
    return {
      'control-label': true,
      'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`
    }
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
}
</script>
