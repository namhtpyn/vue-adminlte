<template>
  <form @submit="submit" role="form" :class="{ 'form-inline': inline }">
    <slot />
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Model, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NForm extends Vue {
  @Prop({ type: Boolean, default: false }) lazyValidation!: boolean
  @Prop({ type: Boolean, default: false }) inline!: boolean
  @Model('input', { type: Boolean, default: false }) value!: boolean
  @Emit() input(e) {}
  @Emit() submit(e) {}

  private formControlComponents: any[] = []

  mounted() {
    this.findDeep(this.$slots.default)
    if (this.lazyValidation) {
      this.formControlComponents.forEach(v => {
        v.lazyValidation = true
      })
    }
  }
  @Watch('value')
  private onValueChange(n) {
    if (!n) this.resetValidation()
  }

  validate() {
    const valid = !this.formControlComponents.map(v => v.validate(v.value)).some(v => !v)
    this.input(valid)
    return valid
  }

  resetValidation() {
    this.formControlComponents.forEach(v => (v.valid = true))
    this.input(false)
  }

  private findDeep(obj) {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        this.findDeep(obj[i])
      }
    } else {
      if (!_.isEmpty(obj.componentInstance) && obj.componentInstance.form) {
        this.formControlComponents.push(obj.componentInstance)
      }
      if (!_.isEmpty(obj.children)) {
        this.findDeep(obj.children)
      }
    }
  }
}
</script>

<style scoped>
form {
  margin-bottom: 0px;
}
</style>
