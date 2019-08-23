<template>
  <div :class="{ 'form-group': form }">
    <label><input type="checkbox" :checked="value" /> {{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NCheckbox extends Vue {
  @Prop({ type: Boolean, default: false }) form!: boolean
  @Prop() label!: string
  @Model('input', { type: Boolean }) value: boolean
  @Emit() input(e) {}

  mounted() {
    ;($(this.$el).find('input') as any)
      .iCheck({
        checkboxClass: 'icheckbox_flat-green'
      })
      .on('ifChanged', e => this.input(!this.value))
  }
}
</script>

<style></style>
