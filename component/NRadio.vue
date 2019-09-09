<template>
  <label><input type="radio" :checked="checked" :value="value" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch, Emit } from 'vue-property-decorator'
import _ from 'lodash'

@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: number | string | boolean | object
  @Model('input', { type: [String, Number, Boolean, Object] }) model: number | string | boolean | object
  @Emit() input(e) {}
  radioEl!: any
  get checked() {
    return _.isEqual(this.model, this.value)
  }
  mounted() {
    this.radioEl = $(this.$el) as any
    this.radioEl
      .iCheck({
        radioClass: 'iradio_flat-green'
      })
      .on('ifChanged', this.modifiedModel)
  }
  @Watch('checked')
  onCheckedChange(n) {
    this.radioEl.iCheck(n ? 'check' : 'uncheck')
  }

  modifiedModel(e) {
    if (e.target.checked) this.input(this.value)
  }
}
</script>

<style></style>
