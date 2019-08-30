<template>
  <div :class="classComponent">
    <label v-if="hasLabel" :class="labelClass" :style="labelStyle">{{ label }}</label>
    <div :class="divClass" :style="divStyle">
      <select :class="cCssClass" :value="value">
        <!-- <option v-for="(item, idx) in select2Data" :key="idx" :value="item.id">{{ item.text }}</option> -->
      </select>
    </div>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
  <!-- <select :class="selectCssClass"></select> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import isEmpty from 'lodash/isEmpty'
@Component({ inheritAttrs: false })
export default class NSelect2 extends Vue {
  @Prop({ type: String, default: '' }) cssClass!: string
  @Prop({ type: Boolean, default: false }) clearable!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) horizontal!: boolean
  @Prop({ type: Boolean, default: false }) lazyValidation!: boolean
  @Prop({ type: Array, required: true }) items!: any[]
  @Prop(String) hint!: string
  @Prop(String) label!: string
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number, Array, Object]) value!: any[] | any
  input(e) {
    if ((!this.lazyForm && !this.lazyValidation) || !this.valid) this.validate(e)
    this.$emit('input', isNaN(e) ? e : Number(e))
  }

  valid: boolean = true
  lazyForm: boolean = false
  widthComponent = 0
  get hasLabel() {
    return !isEmpty(this.label)
  }
  get cCssClass() {
    let css = 'form-control '
    css += this.cssClass
    return css
  }
  get errorText() {
    if (this.rules) {
      const f = this.rules.find(r => r(this.value) !== true)
      return f ? f(this.value) : ''
    }
    return ''
  }
  get select2Data() {
    const data = (this.items || []).map(item => {
      return { id: item[this.itemValue], text: item[this.itemText] }
    })
    return data
  }
  get classComponent() {
    return { 'form-horizontal': this.horizontal, 'form-group': this.form, 'has-error': !this.valid }
  }

  get labelClass() {
    return { 'control-label': true, 'col-xs-2': this.horizontal }
  }

  get divClass() {
    return { 'col-xs-10': this.horizontal }
  }

  get labelStyle() {
    return this.horizontal ? { width: '80px', 'padding-right': '0px' } : {}
  }

  get divStyle() {
    return this.horizontal ? { width: `${this.widthComponent - 90}px` } : {}
  }
  @Watch('select2Data')
  onSelect2DataChange(n, o) {
    this.init(n)
  }
  theSelect!: any
  mounted() {
    this.theSelect = $(this.$el).find('select') as any
    this.init(this.select2Data)
    this.valid = true
  }

  init(data) {
    this.theSelect.empty()
    this.theSelect
      .select2({
        data: data,
        allowClear: this.clearable,
        disabled: this.disabled,
        multiple: this.multiple,
        placeholder: this.hint,
        minimumResultsForSearch: this.searchable ? 0 : -1
      })
      .change(e => this.input(e.target.value))
      .val(this.value)
      .trigger('change')
  }

  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }

  resetvalue() {}
}
</script>

<style>
span.select2-container {
  width: 100% !important;
}
</style>
