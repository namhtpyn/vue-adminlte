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
    if (Array.isArray(this.model)) return this.model.some(m => _.isEqual(m, this.value))
    else return _.isEqual(this.model, this.value)
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
