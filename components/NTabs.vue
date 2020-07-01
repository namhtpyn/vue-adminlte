<template>
  <div class="nav-tabs-custom">
    <ul class="nav nav-tabs">
      <li :class="{ active: vValue === index }" v-for="index in length" :key="index" @click="vValue = index">
        <a href="#">
          <slot :name="`header.${index}`">header.{{ index }}</slot>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane" :class="{ active: vValue === index }" v-for="index in length" :key="index">
        <slot v-if="vValue === index" :name="`body.${index}`">body.{{ index }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NTabs extends Vue {
  @ModelVar('input', 'value', { type: Number, default: 1 }) vValue!: number
  @Prop({ type: Number, default: 1 }) length!: number
}
</script>

<style scoped></style>
