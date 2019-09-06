<template>
  <label><input type="checkbox" :checked="checked" :value="value" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: string | number | boolean | object
  @Prop({ type: String, default: 'blue' }) color!: string
  @Model('input', { type: [Array, String, Number, Boolean] }) model: any[] | any
  @Emit() input(e) {}

  get checked() {
    if (this.model instanceof Array) return this.model.some(m => isEqual(m, this.value))
    return isEqual(this.model, this.value)
  }
  iCheck!: any
  mounted() {
    this.iCheck = $(this.$el).find('input') as any
    this.iCheck
      .iCheck({
        checkboxClass: 'icheckbox_square-' + this.color
      })
      .on('ifChanged', this.modifiedModel)
  }

  @Watch('checked')
  onCheckedChange(n) {
    this.iCheck.iCheck(n ? 'check' : 'uncheck')
  }

  modifiedModel(e) {
    let cModel = cloneDeep(this.model)
    if (cModel instanceof Array) {
      if (e.target.checked) {
        if (!cModel.some(m => isEqual(m, this.value))) cModel.push(this.value)
      } else {
        const idx = cModel.findIndex(m => isEqual(m, this.value))
        if (idx >= 0) cModel.splice(idx, 1)
      }
    } else {
      if (e.target.checked) {
        cModel = this.value
      } else {
        cModel = null
      }
    }
    this.input(cModel)
  }
}
</script>

<style></style>
