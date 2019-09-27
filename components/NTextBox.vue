<template>
  <div :class="classComponent">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <div :class="divClass">
      <span v-if="prefix" class="input-group-addon">{{ prefix }}</span>
      <span v-if="prependIcon" class="input-group-addon">
        <n-icon>{{ prependIcon }}</n-icon>
      </span>
      <span v-if="prependBtn" class="input-group-btn">
        <n-btn :color="prependBtnColor" :flat="prependBtnFlat" @click.stop="prependBtnClick">{{ prependBtn }}</n-btn>
      </span>
      <input
        :type="type"
        :class="cClass"
        :placeholder="hint"
        :value="value"
        @input="e => input(e.target.value)"
        @blur="e => blur(e.target.value)"
        v-bind="$attrs"
        @keypress="keypress"
        @change="e => change(e.target.value)"
      />
      <span v-if="suffix" class="input-group-addon">{{ suffix }}</span>
      <span v-if="appendIcon" class="input-group-addon">
        <n-icon>{{ appendIcon }}</n-icon>
      </span>
      <span v-if="appendBtn" class="input-group-btn">
        <n-btn :color="appendBtnColor" :flat="appendBtnFlat" @click.stop="appendBtnClick">{{ appendBtn }}</n-btn>
      </span>
      <span v-if="innerIcon" :class="`form-control-feedback fa fa-${innerIcon}`" aria-hidden="true"></span>
    </div>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Model } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NTextBox extends Vue {
  @Prop({ type: String, default: 'text' }) type!: string
  @Prop(String) label!: string
  @Prop(String) hint!: string
  @Prop(Array) rules!: any[]
  @Prop({ type: String, default: 'default' }) color!: string
  @Prop({ type: Boolean, default: true }) form!: string
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop(String) prefix!: string
  @Prop(String) suffix!: string
  @Prop(String) prependIcon!: string
  @Prop(String) appendIcon!: string
  @Prop(String) prependBtn!: string
  @Prop(Boolean) prependBtnFlat!: boolean
  @Prop({ type: String, default: 'default' }) prependBtnColor!: string
  @Prop(String) appendBtn!: string
  @Prop(Boolean) appendBtnFlat!: boolean
  @Prop({ type: String, default: 'default' }) appendBtnColor!: string
  @Prop(String) innerIcon!: string
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
  @Emit() change(e) {}
  @Emit() blur(e) {
    this.input(this.value)
  }
  valid: boolean = true
  lazyValidation: boolean = false
  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get appendButton() {
    return this.prependBtn || this.appendBtn
  }
  get inputGroup() {
    return (
      this.prefix || this.prependIcon || this.suffix || this.appendIcon || this.appendButton || this.prependBtn || this.appendBtn
    )
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
    css += this.innerIcon ? 'has-feedback ' : ''
    css += this.cssClass ? this.cssClass : ''
    return css
  }
  get styleLabel() {
    return {
      'control-label': true,
      'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`
    }
  }
  get divClass() {
    return {
      'input-group': this.inputGroup,
      'input-group-sm': this.inputGroup && this.small,
      'input-group-lg': this.inputGroup && this.large
    }
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
}
</script>
