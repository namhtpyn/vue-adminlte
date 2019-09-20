<template>
  <div class="nav nav-tabs-custom">
    <ul class="nav nav-tabs">
      <li v-for="(i, k) in headers" :key="k" :class="{ active: k === tabActive }">
        <a :href="`#n-tab-${k}`" data-toggle="tab" @click="tabClicked(i)">{{ i.text }}</a>
      </li>
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from './Base/NBase'
import NTab from './NTab.vue'
import { VueNode } from '../extension/VueSlot'
@Component({ inheritAttrs: false })
export default class NTabCollection extends Mixins(NBase) {
  @Prop({ type: Boolean, default: false }) changeOnCreated!: boolean
  private valueTabActive: any = null
  private tabComponents: NTab[] = []
  mounted() {
    this.init()
  }

  get tabActive() {
    if (!_.isEmpty(this.tabComponents)) {
      const idx = this.tabComponents.findIndex(t => t.active)
      if (idx < 0) return 0
      return idx
    }
    return -1
  }

  get headers() {
    let result: { text: string; value: any }[] = []
    if (!_.isEmpty(this.tabComponents))
      result = this.tabComponents.map(t => {
        return { text: t.title, value: t.value }
      })
    return result
  }

  @Watch('valueTabActive')
  private onValueTabActiveChange(n, o) {
    this.$emit('tab-change', n)
  }

  init() {
    const nodes = this.vSlot.find(
      (node: VueNode) => node.isComponent && (node.componentInstance.$options as any)._componentTag === 'n-tab'
    )
    this.tabComponents = nodes.map(o => o.componentInstance as NTab)
    this.setTabID()
    if (this.changeOnCreated && !_.isEmpty(this.headers)) this.valueTabActive = this.headers[this.tabActive].value
  }

  tabClicked(item) {
    this.valueTabActive = item.value
  }

  private setTabID() {
    this.tabComponents.forEach((component, index) => {
      component.id = 'n-tab-' + index
    })
  }
}
</script>

<style scoped></style>
