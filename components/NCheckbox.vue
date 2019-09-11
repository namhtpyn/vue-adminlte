<template>
  <label><input type="checkbox" :checked="isChecked" :value="value" v-bind="$attrs" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: true }) readonly form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) readonly value!: string | number | boolean | object
  @Prop({ type: String, default: 'blue' }) readonly color!: string
  @Model('input', { type: [Array, String, Number, Boolean] }) readonly model: any[] | any
  @Emit() input(e) {}

  get isChecked() {
    if (this.model instanceof Array) return this.model.some(m => _.isEqual(m, this.value))
    return _.isEqual(this.model, this.value)
  }
  checkboxEl!: any
  mounted() {
    this.checkboxEl = $(this.$el).find('input') as any
    this.checkboxEl
      .iCheck({
        checkboxClass: 'icheckbox_square-' + this.color
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
    this.isChecked ? this.uncheck() : this.check()
  }

  @Watch('isChecked')
  private onCheckedChange(n) {
    n ? this.check() : this.uncheck()
  }

  private iCheckChanged(checked) {
    let cModel = _.cloneDeep(this.model)
    if (cModel instanceof Array) {
      if (checked) {
        if (!cModel.some(m => _.isEqual(m, this.value))) cModel.push(this.value)
      } else {
        const idx = cModel.findIndex(m => _.isEqual(m, this.value))
        if (idx >= 0) cModel.splice(idx, 1)
      }
    } else {
      if (checked) cModel = this.value
      else cModel = null
    }
    this.input(cModel)
  }
}
</script>

<style></style>
