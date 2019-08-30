<template>
  <div :class="{ 'form-group': form }">
    <label><input type="checkbox" :checked="checked" :value="value" /> {{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: false }) form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean], default: true }) value!: string | number | boolean
  @Model('input', { type: [Array, String, Number, Boolean] }) model: any[] | any
  @Emit() input(e) {}

  get checked() {
    if (this.model instanceof Array) return this.model.includes(this.value)
    return this.model === this.value
  }
  iCheck!: any
  mounted() {
    this.iCheck = $(this.$el).find('input') as any
    this.iCheck
      .iCheck({
        checkboxClass: 'icheckbox_flat-green'
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
        cModel.push(this.value)
      } else {
        const idx = cModel.findIndex(m => m === this.value)
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
