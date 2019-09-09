<template>
  <label><input type="checkbox" :checked="checked" :value="value" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: string | number | boolean | object
  @Prop({ type: String, default: 'blue' }) color!: string
  @Model('input', { type: [Array, String, Number, Boolean] }) model: any[] | any
  @Emit() input(e) {}

  get checked() {
    if (this.model instanceof Array) return this.model.some(m => _.isEqual(m, this.value))
    return _.isEqual(this.model, this.value)
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
    let cModel = _.cloneDeep(this.model)
    if (cModel instanceof Array) {
      if (e.target.checked) {
        if (!cModel.some(m => _.isEqual(m, this.value))) cModel.push(this.value)
      } else {
        const idx = cModel.findIndex(m => _.isEqual(m, this.value))
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
