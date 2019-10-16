<template>
  <div :class="classComponent">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <select :class="cCssClass"> </select>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>
    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-1x fa-fw">circle-o-notch</n-icon>
        <div class="small">Đang tải dữ liệu</div>
      </div>
    </n-overlay>
    <div id="template-result" style="display:none">
      <span><slot name="result"></slot></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import NItems from './Base/NItems'
@Component({ inheritAttrs: false })
export default class NSelect2 extends Mixins(NItems) {
  @Prop({ type: String, default: '' }) cssClass!: string
  @Prop({ type: Boolean, default: false }) clearable!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Boolean, default: true }) closeOnSelect!: boolean
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop(String) hint!: string
  @Prop(String) label!: string
  @Prop(Array) rules!: any[]
  @ModelVar('input', 'value', [String, Number, Array, Object]) vValue!: any[] | any
  input(e) {
    if (!this.lazyValidation || !this.valid) this.validate(e)
  }

  valid: boolean = true
  lazyValidation: boolean = false

  private theSelect!: any
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
      const f = this.rules.find(r => r(this.vValue) !== true)
      return f ? f(this.vValue) : ''
    }
    return ''
  }
  get select2Data() {
    const data = (this.vItems || []).map(item => {
      return { id: item[this.itemValue], text: item[this.itemText], ...item }
    })
    return data
  }
  get classComponent() {
    return { 'form-group': this.form, 'has-error': !this.valid }
  }
  get styleLabel() {
    return {
      'control-label': true,
      'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`
    }
  }
  @Watch('select2Data')
  private onSelect2DataChange(n, o) {
    this.init()
  }
  @Watch('valid')
  private onValidChange(n, o) {
    if (n) {
      ;($(this.$el).find('span.select2-selection') as any).css('border-color', '')
    } else {
      ;($(this.$el).find('span.select2-selection') as any).css('border-color', '#dd4b39')
    }
  }
  @Watch('vValue')
  private onValueChange(n, o) {
    this.theSelect.val(this.tryParseNumber(n)).trigger('change')
  }

  mounted() {
    this.theSelect = $(this.$el).find('select') as any
    this.init()
  }

  private init() {
    if (this.theSelect.hasClass('select2-hidden-accessible')) {
      this.theSelect.select2('destroy')
      this.theSelect.off('select2:select')
      this.theSelect.empty()
    }
    this.theSelect
      .select2({
        data: this.select2Data,
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
        },
        templateResult: item => {
          const template = $(this.$el).find('#template-result')
          if (item.disabled || _.isEmpty(template.find('span').html())) return item.text
          return $(
            template.html().replace(/#(\w+)#/g, (n, $1) => {
              return item[$1]
            })
          )
        }
      })
      .on('select2:select', e => (this.vValue = this.tryParseNumber($(e.target).val())))
      .val(this.vValue)
      .trigger('change')
    this.setSize()
  }
  private setSize() {
    if (!this.small && !this.large) return
    this.$nextTick(() => {
      ;($(this.$el).find('span.select2-selection__rendered') as any).addClass(`input-${this.small ? 'sm' : 'lg'}-rendered`)
      ;($(this.$el).find('span.select2-selection.select2-selection--single') as any).addClass(
        `input-${this.small ? 'sm' : 'lg'}-select`
      )
      ;($(this.$el).find('span.select2-selection__arrow') as any).addClass(`input-${this.small ? 'sm' : 'lg'}-arrow`)
    })
  }

  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
  tryParseNumber(value) {
    return isNaN(value) ? value : Number(value)
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
  font-size: 12px !important;
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
  font-size: 18px !important;
}
</style>
