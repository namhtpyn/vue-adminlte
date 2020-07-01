<template>
  <form @submit.stop="submit" role="form" :class="{ 'form-inline': inline }">
    <slot />
  </form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue, ModelVar } from '@namhoang/vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NForm extends Vue {
  @Prop({ type: Boolean, default: false }) lazyValidation!: boolean
  @Prop({ type: Boolean, default: false }) inline!: boolean
  @ModelVar('input', 'value', { type: Boolean, default: false }) vValue!: boolean
  @Emit() submit(e) {}

  private formComponents: any[] = []

  mounted() {
    this.formComponents = this.$children.filter(child => child && (child as any).form)
    if (this.lazyValidation) this.formComponents.forEach(v => (v.lazyValidation = true))
  }
  // @Watch('value')
  // private onValueChange(n) {
  //   if (!n) this.resetValidation()
  // }

  validate() {
    const valid = !this.formComponents.map(v => v.validate(v.value)).some(v => !v)
    this.vValue = valid
    return valid
  }

  resetValidation() {
    this.formComponents.forEach(v => (v.valid = true))
    this.vValue = false
  }
}
</script>

<style scoped>
form {
  margin-bottom: 0px;
}
</style>
