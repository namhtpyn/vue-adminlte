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
      @click="click"
    />
    <label :for="checkboxID" @click.stop style="vertical-align: middle;"></label>
    {{ label }}
  </label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: true }) readonly form!: boolean
  @Prop(String) label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) readonly value!: string | number | boolean | object
  @ModelVar('input', 'model', { type: [Array, String, Number, Boolean, Object] }) vModel: any[] | any

  @Emit() click(e) {}
  get isChecked() {
    if (Array.isArray(this.vModel)) return this.vModel.some(m => _.isEqual(m, this.value))
    else return _.isEqual(this.vModel, this.value)
  }

  input(e) {
    if (Array.isArray(this.vModel)) {
      if (e.target.checked) {
        if (!this.vModel.some(m => _.isEqual(m, this.value))) this.vModel.push(this.value)
      } else {
        const idx = this.vModel.findIndex(m => _.isEqual(m, this.value))
        if (idx >= 0) this.vModel.splice(idx, 1)
      }
    } else {
      if (e.target.checked) this.vModel = this.value
      else this.vModel = null
    }
  }

  toggle() {
    ;(this.$el.querySelector('input[type="checkbox"]') as HTMLInputElement).click()
  }

  get checkboxID() {
    return _.uniqueId('n_checkbox_')
  }

  validate(value) {}
}
</script>

<style>
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
.n-checkbox[disabled] + label {
  opacity: 0.6;
}
.n-checkbox[disabled] + label:hover {
  border: 1px solid #d3cfc8;
  box-shadow: unset;
}
.n-checkbox[disabled] + label:hover {
  border: 1px solid #d3cfc8;
  box-shadow: unset;
}
.n-checkbox[disabled]:checked + label:hover {
  border: 1px solid #2489c0;
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
}
</style>
