<template>
  <div :id="id" :class="{ 'tab-pane': true, active: active }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NTab extends Vue {
  @Prop({ type: Boolean, default: false }) active!: boolean
  @Prop({ type: [String, Number, Object] }) value!: string | number | object
  @Prop(String) title!: string
  id: string = ''
}
</script>

<style></style>
