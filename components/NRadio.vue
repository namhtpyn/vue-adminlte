<template>
  <label>
    <input :id="radioID" type="radio" class="n-radio" :checked="isChecked" :value="value" @input="input" v-bind="$attrs" /><label
      :for="radioID"
    ></label>
    {{ label }}
  </label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import _ from 'lodash'

@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop() label!: string
  @Prop({ type: String, default: 'blue' }) color!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: number | string | boolean | object
  @Model('input', { type: [String, Number, Boolean, Object] }) model: number | string | boolean | object

  groupModel: any = null
  get isChecked() {
    if (!this.model) return _.isEqual(this.groupModel, this.value)
    return _.isEqual(this.model, this.value)
  }

  toggle() {
    ;(this.$el.querySelector('input[type="radio"]') as HTMLInputElement).click()
  }

  input(e) {
    if (e.target.checked) {
      if (!this.model) this.groupModel = _.cloneDeep(this.value)
      else this.$emit('input', this.value)
    }
  }

  get radioID() {
    return _.uniqueId('n_radio_')
  }
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
