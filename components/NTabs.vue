<template>
  <div class="nav-tabs-custom">
    <ul class="nav nav-tabs">
      <template v-for="index in length">
        <li v-if="hasSlot(`header.${index}`)" :class="{ active: vValue === index }" :key="index" @click="vValue = index">
          <a style="cursor:pointer">
            <slot :name="`header.${index}`">header.{{ index }}</slot>
          </a>
        </li>
      </template>
    </ul>
    <div class="tab-content">
      <template v-for="index in length">
        <div v-if="hasSlot(`body.${index}`)" class="tab-pane" :class="{ active: vValue === index }" :key="index">
          <slot v-if="!lazy || (lazy && vValue === index)" v-show="lazy || (!lazy && vValue === index)" :name="`body.${index}`"
            >body.{{ index }}</slot
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NTabs extends Vue {
  @ModelVar('input', 'value', { type: Number, default: 1 }) vValue!: number
  @Prop({ type: Number, default: 1 }) length!: number
  @Prop({ type: Boolean, default: true }) lazy!: boolean
  hasSlot(slotName: string) {
    return !_.isEmpty(this.$slots[slotName])
  }
  mounted() {
    let found = 0
    for (let i = 1; i <= this.length; i++) {
      if (this.hasSlot(`body.${i}`)) {
        found = i
        break
      }
    }
    if (this.vValue !== found) this.vValue = found
  }
}
</script>

<style scoped></style>
