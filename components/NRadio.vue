<template>
  <label>
    <input
      ref="radio"
      :id="radioID"
      type="radio"
      class="n-radio"
      :checked="isChecked"
      :value="value"
      @input="input"
      v-bind="$attrs"
      @click="click"
    /><label :for="radioID" @click.stop style="vertical-align: middle;"></label>
    {{ label }}
  </label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'

@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop({ type: Boolean, default: true }) readonly form!: boolean
  @Prop() label!: string
  @Prop({ type: String, default: 'blue' }) color!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: number | string | boolean | object
  @ModelVar('input', 'model', { type: [String, Number, Boolean, Object] }) vModel!: number | string | boolean | object

  @Emit() click(e) {}
  get isChecked() {
    return _.isEqual(this.vModel, this.value)
  }

  toggle() {
    ;(this.$refs.radio as HTMLInputElement).click()
  }

  input(e) {
    if (e.target.checked) {
      this.vModel = this.value
    }
  }

  get radioID() {
    return _.uniqueId('n_radio_')
  }
  validate(value) {}
}
</script>

<style>
.n-radio {
  display: none;
}
.n-radio + label {
  border: 1px solid #d3cfc8;
  height: 17px;
  width: 17px;
  display: inline-block;
  position: relative;
  margin: unset;
  cursor: pointer;
  border-radius: 17px;
}
.n-radio[disabled] + label {
  opacity: 0.6;
}
.n-radio[disabled] + label:hover {
  border: 1px solid #d3cfc8;
  box-shadow: unset;
}
.n-radio[disabled] + label:hover {
  border: 1px solid #d3cfc8;
  box-shadow: unset;
}
.n-radio[disabled]:checked + label:hover {
  border: 1px solid #2489c0;
}
.n-radio + label:hover {
  border: 1px solid #2489c0;
  box-shadow: inset 0px 0px 0px 1px #2489c0;
}
.n-radio + label:active,
.n-radio:checked + label:active {
  border: 1px solid #2489c0;
  box-shadow: inset 0px 0px 0px 1px #2489c0;
}

.n-radio:checked + label {
  background-color: #2489c0;
  border: 1px solid #2489c0;
  color: #ffffff;
}

.n-radio:checked + label:after {
  content: '\2714';
  font-size: 12px;
  position: absolute;
  top: 0px;
  left: 2px;
  color: #ffffff;
}
</style>
