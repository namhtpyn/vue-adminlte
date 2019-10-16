<template>
  <div :class="overlayCss" :style="overlayStyle">
    <div :class="scrimCss" :style="scrimStyle"></div>
    <div v-if="vValue" class="n-overlay__content"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'
@Component({ inheritAttrs: false })
export default class NOverlay extends Vue {
  @Prop({ type: Boolean, default: false }) absolute!: boolean
  @Prop({ type: [String, Number], default: 9999 }) zIndex!: number | string
  @Prop({ type: [String, Number], default: 0.46 }) opacity!: number | string
  @Prop({ type: [String], default: 'black' }) color!: string
  @ModelVar('input', 'value', { type: Boolean, default: false }) vValue!: boolean

  get overlayStyle() {
    let style = ''
    style += this.absolute ? 'position:absolute; ' : ''
    style += this.zIndex ? `z-index:${this.zIndex}; ` : ''
    return style
  }
  get scrimStyle() {
    let style = ''
    style += this.opacity ? `opacity:${this.vValue ? this.opacity : 0}; ` : ''
    return style
  }
  get overlayCss() {
    let css = 'n-overlay '
    css += this.vValue ? 'n-overlay--active ' : ''
    return css
  }
  get scrimCss() {
    let css = 'n-overlay__scrim '
    css += this.color ? `bg-${this.color} ` : ''
    return css
  }
}
</script>

<style scoped>
.n-overlay {
  align-items: center;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
}
.n-overlay__scrim {
  border-radius: inherit;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  will-change: opacity;
}
.n-overlay--active {
  pointer-events: auto;
  touch-action: none;
}
.n-overlay__content {
  position: relative;
}
.bg-black {
  background-color: black;
}
</style>
