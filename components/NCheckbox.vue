<template>
  <label>
    <input
      :id="checkboxID"
      class="n-checkbox"
      type="checkbox"
      :checked="isChecked"
      :value="value"
      v-bind="$attrs"
      @input="input"
    />
    <label :for="checkboxID"></label>
    {{ label }}
  </label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: true }) readonly form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) readonly value!: string | number | boolean | object
  @Model('input', { type: [Array, String, Number, Boolean] }) readonly model: any[] | any

  get isChecked() {
<<<<<<< HEAD
    if (Array.isArray(this.model)) return this.model.some(m => _.isEqual(m, this.value))
    else return _.isEqual(this.model, this.value)
=======
    if (this.model instanceof Array) return this.model.some(m => _.isEqual(m, this.value))
    return _.isEqual(this.model, this.value)
  }
  checkboxEl!: any
  mounted() {
    this.checkboxEl = $(this.$el) as any
    this.checkboxEl
      .iCheck({
        checkboxClass: 'icheckbox_square-' + this.color,
        disabledClass: 'hover_disabled'
      })
      .on('ifClicked', e => this.iCheckChanged(!this.isChecked))
  }
  check() {
    this.checkboxEl.iCheck('check')
  }
  uncheck() {
    this.checkboxEl.iCheck('uncheck')
  }
  toggle() {
    this.checkboxEl.click()
    //this.isChecked ? this.uncheck() : this.check()
>>>>>>> 9510b94709569543d469d23eac8872c30669d0ae
  }

  input(e) {
    let model = _.cloneDeep(this.model)
    if (Array.isArray(this.model)) {
      if (e.target.checked) {
        if (!model.some(m => _.isEqual(m, this.value))) model.push(this.value)
      } else {
        const idx = model.findIndex(m => _.isEqual(m, this.value))
        if (idx >= 0) model.splice(idx, 1)
      }
    } else {
      if (e.target.checked) model = this.value
      else model = null
    }
    this.$emit('input', model)
  }

  toggle() {
    ;(this.$el.querySelector('input[type="checkbox"]') as HTMLInputElement).click()
  }

  get checkboxID() {
    return _.uniqueId('n_checkbox_')
  }
}
</script>

<style>
<<<<<<< HEAD
.n-checkbox {
  display: none;
}
.n-checkbox + label {
  border: 1px solid #d3cfc8;
  height: 17px;
  width: 17px;
  display: inline-block;
  position: relative;
  margin: unset;
  cursor: pointer;
}
.n-checkbox + label:hover {
  border: 1px solid #2489c0;
  box-shadow: inset 0px 0px 0px 1px #2489c0;
}
.n-checkbox + label:active,
.n-checkbox:checked + label:active {
  border: 1px solid #2489c0;
  box-shadow: inset 0px 0px 0px 1px #2489c0;
}

.n-checkbox:checked + label {
  background-color: #2489c0;
  border: 1px solid #2489c0;
  color: #ffffff;
}

.n-checkbox:checked + label:after {
  content: '\2714';
  font-size: 12px;
  position: absolute;
  top: 0px;
  left: 2px;
  color: #ffffff;
=======
.hover_disabled {
  cursor: not-allowed !important;
>>>>>>> 9510b94709569543d469d23eac8872c30669d0ae
}
</style>
