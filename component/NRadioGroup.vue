<template>
  <div :class="{ 'form-group': form }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit } from 'vue-property-decorator'
import isEmpty from 'lodash/isEmpty'
@Component({ inheritAttrs: false })
export default class NRadio extends Vue {
  @Prop({ type: Boolean, default: false }) form!: boolean
  @Prop() label!: string
  @Model('input', { type: [String, Number] }) value!: number | string
  @Emit() input(e) {}

  radioEls: any[] = []
  findDeep(obj) {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        this.findDeep(obj[i])
      }
    } else {
      if (!isEmpty(obj['children'])) {
        this.findDeep(obj['children'])
      }
      if (obj['componentInstance'] instanceof Vue) {
        console.log(obj['componentInstance'])
        // this.radioEls.push(obj['componentInstance'])
      }
    }
  }
}
</script>

<style></style>
