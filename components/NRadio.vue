<template>
  <label><input type="radio" :checked="checked" :value="value" v-bind="$attrs" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch, Emit } from 'vue-property-decorator'
import _ from 'lodash'

@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop() label!: string
  @Prop({ type: String, default: 'blue' }) color!: string
  @Prop({ type: [String, Number, Boolean, Object], default: true }) value!: number | string | boolean | object
  @Model('input', { type: [String, Number, Boolean, Object] }) model: number | string | boolean | object
  @Emit() input(e) {}
  private radioEl!: any
  groupModel: any = null
  get checked() {
    if (!this.model) return _.isEqual(this.groupModel, this.value)
    return _.isEqual(this.model, this.value)
  }
  mounted() {
    this.radioEl = $(this.$el) as any
    this.radioEl
      .iCheck({
        radioClass: 'iradio_flat-' + this.color
      })
      .on('ifChanged', this.modifiedModel)
  }
  @Watch('checked')
  private onCheckedChange(n) {
    this.radioEl.iCheck(n ? 'check' : 'uncheck')
  }

  private modifiedModel(e) {
    if (e.target.checked) {
      if (!this.model) this.groupModel = _.cloneDeep(this.value)
      else this.input(this.value)
    }
  }
}
</script>

<style></style>
