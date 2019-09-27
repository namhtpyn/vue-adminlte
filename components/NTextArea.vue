<template>
  <div :class="classComponent">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <textarea
      ref="textarea"
      :class="cClass"
      :placeholder="hint"
      :value="value"
      @input="e => input(e.target.value)"
      @blur="e => blur(e.target.value)"
      @keypress="keypress"
      :style="styleTextarea"
      @change="change"
      v-bind="$attrs"
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
  @Prop({ type: Boolean, default: false }) autoGrow!: boolean
  @Prop({ type: String, default: '' }) cssClass!: string
  @Model('input', { type: [String, Number] }) value!: string | number
  @Emit() input(e) {
    this.setScrollHeight()
    if (!this.lazyValidation || !this.valid) this.validate(e)
  }
  @Emit() blur(e) {
    this.input(this.value)
  }
  @Emit() change(e) {}
  @Emit() keyup(e) {}
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
  scrollHeight = 0
  setScrollHeight() {
    this.scrollHeight = 34
    this.$nextTick(() => {
      try {
        this.scrollHeight = (this.$refs.textarea as Element).scrollHeight + 2
        this.scrollHeight = this.scrollHeight < 34 ? 34 : this.scrollHeight
        // eslint-disable-next-line no-empty
      } catch (e) {}
    })
  }
  get styleTextarea() {
    const style: object[] = []
    if (this.autoGrow) style.push({ height: this.scrollHeight + 'px' })
    return style
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
  mounted() {
    this.setScrollHeight()
  }
}
</script>
