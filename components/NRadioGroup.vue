<template>
  <div :class="{ 'form-group': form }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'
import NRadio from './NRadio.vue'
import _ from 'lodash'
import { Watch } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NRadioGroup extends Vue {
  @Prop({ type: Boolean, default: true }) form!: boolean
  @ModelVar('input', 'value', { type: [String, Number, Boolean, Object] }) vValue!: number | string | boolean | object
  private radioComponents: NRadio[] = []
  mounted() {
    this.radioComponents = this.$children.filter(child => (child.$options as any)._componentTag === 'n-radio') as NRadio[]
    this.radioComponents.forEach(radio => {
      radio.vModel = this.vValue
      radio.$on('input', e => {
        if (!_.isEqual(e, this.vValue)) this.vValue = e
      })
    })
  }
  @Watch('vValue')
  onValueChanged(newVal) {
    this.radioComponents.forEach(radio => {
      radio.vModel = this.vValue
    })
  }
  validate(value) {}
}
</script>

<style></style>
