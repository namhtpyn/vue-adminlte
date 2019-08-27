<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <select :class="cCssClass" :value="value"></select>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
  <!-- <select :class="selectCssClass"></select> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
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
  @Prop({ type: Boolean, default: false }) form!: boolean
  @Prop(Array) items!: any[]
  @Prop(String) hint!: string
  @Prop(String) label!: string
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number, Array, Object]) value!: any[] | any
  input(e) {
    this.validate(e)
    this.$emit('input', isNaN(e) ? e : Number(e))
  }

  valid: boolean = true
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
    return (this.items || []).map(item => {
      return { id: item[this.itemValue], text: item[this.itemText] }
    })
  }

  mounted() {
    ;($(this.$el).find('select') as any)
      .select2({
        data: this.select2Data,
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
}
</script>

<style>
span.select2-container {
  width: 100% !important
}
</style>
