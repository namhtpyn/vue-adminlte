<template>
  <div :class="{ 'tab-pane': true, active: vActive }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropVar } from '@namhoang/vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NTab extends Vue {
  @PropVar('active', { type: Boolean, default: false }) vActive!: boolean
  @Prop({ type: [String, Number, Object] }) value!: string | number | object
  @Prop(String) title!: string
}
</script>

<style></style>
