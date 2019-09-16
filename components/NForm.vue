<template>
  <form @submit="submit" role="form" :class="{ 'form-inline': inline }">
    <slot />
  </form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Model, Watch, Mixins } from 'vue-property-decorator'
import NBase from './Base/NBase'
import { VueNode } from '../extension/VueSlot'
@Component({ inheritAttrs: false })
export default class NForm extends Mixins(NBase) {
  @Prop({ type: Boolean, default: false }) lazyValidation!: boolean
  @Prop({ type: Boolean, default: false }) inline!: boolean
  @Model('input', { type: Boolean, default: false }) value!: boolean
  @Emit() submit(e) {}

  private formComponents: any[] = []

  mounted() {
    const nodes = this.vSlot.find((node: VueNode) => node.isComponent && (node.componentInstance as any).form)
    this.formComponents = nodes.map(o => o.componentInstance)
    if (this.lazyValidation) {
      this.formComponents.forEach(v => {
        v.lazyValidation = true
      })
    }
  }
  @Watch('value')
  private onValueChange(n) {
    if (!n) this.resetValidation()
  }

  validate() {
    const valid = !this.formComponents.map(v => v.validate(v.value)).some(v => !v)
    this.input(valid)
    return valid
  }

  resetValidation() {
    this.formComponents.forEach(v => (v.valid = true))
    this.input(false)
  }
}
</script>

<style scoped>
form {
  margin-bottom: 0px;
}
</style>
