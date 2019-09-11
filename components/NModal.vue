<template>
  <div :class="`modal modal-${color} fade ${fullscreen ? 'no-padding' : ''}`">
    <div :class="{ 'modal-dialog': true, 'modal-lg': large, 'modal-sm': small, 'modal-fullscreen': fullscreen }">
      <div class="modal-content">
        <div v-if="!hideHeader" class="modal-header" style="display:flex">
          <h4 class="modal-title" style="flex:1">{{ caption }}</h4>
          <n-icon style="cursor:pointer" data-dismiss="modal">times</n-icon>
        </div>
        <div class="modal-body" :style="bodyStyle" v-if="value">
          <slot></slot>
        </div>
        <div v-if="!hideFooter" class="modal-footer">
          <slot name="footer"></slot>
        </div>
        <n-overlay absolute :value="vLoading">
          <n-icon css-class="fa-spin fa-3x" style="color:white">circle-o-notch</n-icon>
        </n-overlay>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Watch, Prop, Mixins } from 'vue-property-decorator'
import NBase from './Base/NBase'
@Component({ inheritAttrs: false })
export default class NModal extends Mixins(NBase) {
  @Prop({ type: String, default: 'default' }) color!: string
  @Prop({ type: String, default: '' }) caption!: string
  @Prop({ type: Boolean, default: false }) persistent!: boolean
  @Prop({ type: Boolean, default: false }) hideHeader!: boolean
  @Prop({ type: Boolean, default: false }) hideFooter!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) scrollable!: boolean
  @Prop({ type: Boolean, default: false }) fullscreen!: boolean

  @Model('input', { type: Boolean, default: false }) value!: boolean

  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    ;($(this.$el) as any).modal(val ? 'show' : 'hide')
  }
  mounted() {
    ;($(this.$el) as any)
      .modal({ backdrop: !this.persistent, show: this.value })
      .on('hidden.bs.modal', () => this.input(false))
      .on('shown.bs.modal', () => {
        this.headerHeight = $(this.$el.querySelector('.modal-header')).outerHeight(true)
        this.footerHeight = $(this.$el.querySelector('.modal-footer')).outerHeight(true)
        this.dialogMargin =
          $(this.$el.querySelector('.modal-dialog')).outerHeight(true) - $(this.$el.querySelector('.modal-dialog')).innerHeight()
        this.input(true)
      })
  }
  headerHeight = 0
  footerHeight = 0
  dialogMargin = 100
  get offsetHeight() {
    return this.headerHeight + this.footerHeight + this.dialogMargin
  }
  get bodyStyle() {
    let style = ''
    style += this.scrollable ? `overflow: auto; ` : ''
    style += this.scrollable ? `max-height: calc(100vh - ${this.offsetHeight}px); ` : ''
    style += this.fullscreen ? `min-height: calc(100vh - ${this.offsetHeight}px); ` : ''
    return style
  }
}
</script>

<style scoped>
.no-padding {
  padding: 0px !important;
}
.modal-fullscreen {
  width: auto;
  margin: auto;
  min-height: 100vh;
}
.modal-fullscreen > .modal-content {
  min-height: 100%;
}
</style>
