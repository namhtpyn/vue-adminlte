<template>
  <div class="nav nav-tabs-custom">
    <ul class="nav nav-tabs">
      <li v-for="header in headers" :key="header.index" :class="{ active: header.index === tabActive }">
        <a href="#" @click.stop="tabClicked(header)">{{ header.text }}</a>
      </li>
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from '@namhoang/vue-property-decorator'
import NTab from './NTab.vue'
@Component({ inheritAttrs: false })
export default class NTabCollection extends Vue {
  @Prop({ type: Boolean, default: false }) changeOnCreated!: boolean
  private valueTabActive: any = null
  private tabComponents: NTab[] = []
  mounted() {
    this.init()
  }

  get tabActive() {
    return this.tabComponents.findIndex(t => t.vActive)
  }

  get headers() {
    return this.tabComponents.map((tab, index) => ({ index, text: tab.title, value: tab.value }))
  }

  @Watch('tabActive')
  private onTabActiveChanged(newVal) {
    this.$emit('tab-change', this.headers[newVal])
  }

  init() {
    this.tabComponents = this.$children.filter(child => (child.$options as any)._componentTag === 'n-tab') as NTab[]
    if (this.changeOnCreated) this.onTabActiveChanged(this.tabActive)
  }

  tabClicked(header) {
    this.tabComponents.forEach(tab => (tab.vActive = false))
    this.tabComponents[header.index].vActive = true
  }
}
</script>

<style scoped></style>
