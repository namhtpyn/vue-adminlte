<template>
  <div :class="classComponent">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <select :class="cCssClass" :value="value"> </select>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
  <!-- <select :class="selectCssClass"></select> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NSelect2 extends Vue {
  @Prop({ type: String, default: '' }) cssClass!: string
  @Prop({ type: Boolean, default: false }) clearable!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: true }) closeOnSelect!: boolean
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Array, required: true }) items!: any[]
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop(String) hint!: string
  @Prop(String) label!: string
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number, Array, Object]) value!: any[] | any
  input(e) {
    if (!this.lazyValidation || !this.valid) this.validate(e)
    this.$emit('input', isNaN(e) ? e : Number(e))
  }

  valid: boolean = true
  lazyValidation: boolean = false
  widthComponent = 0
  get hasLabel() {
    return !_.isEmpty(this.label)
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
    return { 'form-group': this.form, 'has-error': !this.valid }
  }
  @Watch('select2Data')
  onSelect2DataChange(n, o) {
    this.init(n)
  }
  @Watch('valid')
  onValidChange(n, o) {
    if (n) {
      ;($(this.$el).find('span.select2-selection') as any).css('border-color', '')
    } else {
      ;($(this.$el).find('span.select2-selection') as any).css('border-color', '#dd4b39')
    }
  }
  theSelect!: any
  mounted() {
    this.theSelect = $(this.$el).find('select') as any
    this.init(this.select2Data)
    this.setSize()
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
        closeOnSelect: this.closeOnSelect,
        minimumResultsForSearch: this.searchable ? 0 : -1,
        language: {
          noResults: function() {
            return 'Không có dữ liệu'
          }
        }
      })
      .change(e => this.input(e.target.value))
      .val(this.value)
      .trigger('change')
  }

  setSize() {
    if (!this.small && !this.large) return
    ;($(this.$el).find('.select2-selection__rendered') as any).addClass(`input-${this.small ? 'sm' : 'lg'}-rendered`)
    ;($(this.$el).find('.select2-container .select2-selection--single') as any).addClass(
      `input-${this.small ? 'sm' : 'lg'}-select`
    )
    ;($(this.$el).find('.select2-selection__arrow') as any).addClass(`input-${this.small ? 'sm' : 'lg'}-arrow`)
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
  width: 100% !important;
}
.input-sm-rendered {
  font-size: 12px !important;
  line-height: 23px !important;
}
.input-sm-select {
  height: 30px !important;
}
.input-sm-arrow {
  height: 23px !important;
}
.input-sm-dropdown {
  font-size: 12px;
}
.input-lg-rendered {
  font-size: 18px !important;
  line-height: 40px !important;
}
.input-lg-select {
  height: 46px !important;
}
.input-lg-arrow {
  height: 40px !important;
}
.input-lg-dropdown {
  font-size: 18px;
}
</style>
