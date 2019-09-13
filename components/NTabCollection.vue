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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NTabCollection extends Vue {
  @Prop({ type: Boolean, default: false }) changeOnCreated!: boolean
  private valueTabActive: any = null
  private tabComponents: any[] = []
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
    let result = []
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
    this.tabComponents = []
    this.findDeep(this.$slots.default)
    this.setTabID()
    if (this.changeOnCreated && !_.isEmpty(this.headers)) this.valueTabActive = this.headers[this.tabActive].value
  }

  tabClicked(item) {
    this.valueTabActive = item.value
  }

  private setTabID() {
    for (let i = 0; i < this.tabComponents.length; i++) {
      this.tabComponents[i].id = 'n-tab-' + i
    }
  }

  private findDeep(obj) {
    if (!obj) return
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        this.findDeep(obj[i])
      }
    } else {
      if (
        Object.hasOwnProperty.call(obj, 'componentInstance') &&
        !_.isEmpty(obj.componentInstance) &&
        obj.componentInstance.$options._componentTag === 'n-tab'
      ) {
        this.tabComponents.push(obj.componentInstance)
      }
      if (Object.hasOwnProperty.call(obj, 'children') && !_.isEmpty(obj.children)) {
        this.findDeep(obj.children)
      }
    }
  }
}
</script>

<style scoped></style>
