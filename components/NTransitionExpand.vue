<template>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @enter-cancelled="enterCancelled"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @leave-cancelled="leaveCancelled"
  >
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from '@namhoang/vue-property-decorator'

@Component({})
export default class NTransitionExpand extends Vue {
  @Prop({ type: [Number, Object], default: 500 }) readonly duration!: number | { enter: number; leave: number }
  style: { [key: string]: string } = {}
  @Emit() beforeEnter(el: HTMLElement) {
    Object.keys(el.style).forEach(k => {
      const v = el.style.getPropertyValue(k)
      if (k !== 'display') this.style[k] = v
    })
  }

  @Emit() enter(el: HTMLElement, done) {
    const computedStyle = window.getComputedStyle(el)
    const paddingTop = computedStyle.paddingTop
    const paddingBottom = computedStyle.paddingBottom
    const marginTop = computedStyle.marginTop
    const marginBottom = computedStyle.marginBottom
    const offsetHeight = el.offsetHeight
    const duration = typeof this.duration === 'number' ? this.duration : this.duration.enter || 500

    el.style.overflow = 'hidden'
    el.style.height = '0'
    el.style.paddingTop = '0'
    el.style.paddingBottom = '0'
    el.style.marginTop = '0'
    el.style.marginBottom = '0'

    requestAnimationFrame(() => {
      el.style.setProperty('transition', `all ${duration}ms`, 'important')
      el.style.height = `${offsetHeight}px`
      el.style.paddingTop = paddingTop
      el.style.paddingBottom = paddingBottom
      el.style.marginTop = marginTop
      el.style.marginBottom = marginBottom
    })
  }

  @Emit() afterEnter(el: HTMLElement) {
    this.resetStyle(el)
  }
  @Emit() enterCancelled(el: HTMLElement) {
    this.resetStyle(el)
  }
  @Emit() beforeLeave(el: HTMLElement) {
    Object.keys(el.style).forEach(k => {
      const v = el.style.getPropertyValue(k)
      if (k !== 'display') this.style[k] = v
    })
  }
  @Emit() leave(el: HTMLElement, done) {
    const computedStyle = window.getComputedStyle(el)
    const paddingTop = computedStyle.paddingTop
    const paddingBottom = computedStyle.paddingBottom
    const marginTop = computedStyle.marginTop
    const marginBottom = computedStyle.marginBottom
    const offsetHeight = el.offsetHeight
    const duration = typeof this.duration === 'number' ? this.duration : this.duration.leave || 500

    el.style.overflow = 'hidden'
    el.style.height = `${offsetHeight}px`
    el.style.paddingTop = paddingTop
    el.style.paddingBottom = paddingBottom
    el.style.marginTop = marginTop
    el.style.marginBottom = marginBottom
    requestAnimationFrame(() => {
      el.style.setProperty('transition', `all ${duration}ms`, 'important')
      el.style.height = '0'
      el.style.paddingTop = '0'
      el.style.paddingBottom = '0'
      el.style.marginTop = '0'
      el.style.marginBottom = '0'
    })
  }
  @Emit() afterLeave(el: HTMLElement) {
    this.resetStyle(el)
  }
  @Emit() leaveCancelled(el: HTMLElement) {
    this.resetStyle(el)
  }

  resetStyle(el: HTMLElement) {
    Object.keys(this.style).forEach(k => {
      el.style.setProperty(k, this.style[k])
    })
  }
}
</script>
