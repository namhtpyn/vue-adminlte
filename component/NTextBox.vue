<template>
  <div :class="classComponent">
    <label v-if="hasLabel" :class="labelClass" :style="labelStyle">{{ label }}</label>
    <div :class="divClass" :style="divStyle">
      <span v-if="prefix" class="input-group-addon">{{ prefix }}</span>
      <span v-if="prependIcon" class="input-group-addon">
        <n-icon>{{ prependIcon }}</n-icon>
      </span>
      <input
        :type="type"
        :class="cCssClass"
        :placeholder="hint"
        :value="value"
        @input="e => input(e.target.value)"
        @blur="input(value)"
        :disabled="readonly"
      />
      <span v-if="suffix" class="input-group-addon">{{ suffix }}</span>
      <span v-if="appendIcon" class="input-group-addon">
        <n-icon>{{ appendIcon }}</n-icon>
      </span>
      <span v-if="appendButton" class="input-group-btn">
        <slot name="appendButton"></slot>
      </span>
    </div>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import NIcon from '../component/NIcon.vue'
import { Component, Vue, Prop, Emit, Model } from 'vue-property-decorator'
import isEmpty from 'lodash/isEmpty'
@Component({ components: { NIcon }, inheritAttrs: false })
export default class NTextBox extends Vue {
  @Prop({ type: String, default: 'text' }) type!: string
  @Prop(String) cssClass!: string
  @Prop(String) label!: string
  @Prop(String) hint!: string
  @Prop(Array) rules!: any[]
  @Prop(Boolean) readonly!: boolean
  @Prop({ type: String, default: 'default' }) color!: string
  @Prop({ type: Boolean, default: true }) form!: string
  @Prop(String) prefix!: string
  @Prop(String) prependIcon!: string
  @Prop(String) suffix!: string
  @Prop(String) appendIcon!: string
  @Prop({ type: Boolean, default: false }) horizontal!: boolean
  @Prop({ type: Boolean, default: false }) lazyValidation!: boolean
  @Model('input', { type: [String, Number] }) value!: string | number
  @Emit() input(e) {
    if ((!this.lazyForm && !this.lazyValidation) || !this.valid) this.validate(e)
  }
  valid: boolean = true
  lazyForm: boolean = false
  widthComponent = 0
  get hasLabel() {
    return !isEmpty(this.label)
  }
  get appendButton() {
    return this.$slots.appendButton
  }
  get inputGroup() {
    return this.prefix || this.prependIcon || this.suffix || this.appendIcon || this.appendButton
  }
  get cCssClass() {
    const css = 'form-control ' + this.cssClass
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
    return { 'form-horizontal': this.horizontal, 'form-group': this.form, 'has-error': !this.valid }
  }

  get labelClass() {
    return { 'control-label': true, 'col-xs-2': this.horizontal }
  }

  get divClass() {
    return { 'input-group': this.inputGroup, 'col-xs-10': this.horizontal }
  }

  get labelStyle() {
    return this.horizontal ? { width: '80px', 'padding-right': '0px' } : {}
  }

  get divStyle() {
    return this.horizontal ? { width: `${this.widthComponent - 90}px` } : {}
  }

  mounted() {
    this.widthComponent = $(this.$el).width()
  }

  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
}
</script>

<style scoped></style>
