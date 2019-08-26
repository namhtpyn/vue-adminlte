<template>
  <label><input type="radio" :check="check" /> {{ label }}</label>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop({ type: Boolean, default: false }) form!: boolean
  @Prop() label!: string
  @Prop({ type: [String, Number] }) value!: number | string

  radioEl!: any
  check!: boolean
  mounted() {
    this.radioEl = ($(this.$el) as any)
      .iCheck({
        radioClass: 'iradio_flat-green'
      })
      .on('ifClicked', e => (this.check = true))
  }

  change(check: boolean) {
    if (check) this.radioEl.iCheck('check')
    else this.radioEl.iCheck('uncheck')
  }
}
</script>

<style></style>
