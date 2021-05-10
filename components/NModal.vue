<template>
  <transition name="n-modal" @before-enter="beforeOpen" @after-enter="open" @after-leave="close">
    <div v-if="vValue" :class="`modal modal-${color} ${fullscreen ? 'no-padding' : ''} in`" style="display: block">
      <div :class="{ 'modal-dialog': true, 'modal-lg': large, 'modal-sm': small, 'modal-fullscreen': fullscreen }">
        <div class="modal-content" v-click-out="clickOut">
          <div v-if="!hideHeader" class="modal-header margin-right-1px" style="display:flex">
            <h4 class="modal-title" style="flex:1">{{ caption }}</h4>
            <n-icon style="cursor:pointer" @click="vValue = false">times</n-icon>
          </div>
          <div class="modal-body margin-right-1px" :style="bodyStyle" v-if="value">
            <slot></slot>
          </div>
          <div v-if="!hideFooter" class="modal-footer margin-right-1px">
            <slot name="footer"></slot>
          </div>
          <n-overlay absolute :value="vLoading">
            <div style="text-align:center; color:#fff">
              <n-icon class="fa-spin fa-2x fa-fw">circle-o-notch</n-icon>
            </div>
          </n-overlay>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import vClickOutside from 'v-click-outside'
  import { PropVar, Component, Prop, ModelVar, Vue, Emit } from '@namhoang/vue-property-decorator'
  @Component({
    inheritAttrs: false,
    directives: {
      clickOut: vClickOutside.directive,
    },
  })
  export default class NModal extends Vue {
    @ModelVar('input', 'value', { type: Boolean, default: false }) vValue!: boolean
    @PropVar('loading', { type: Boolean, default: false }) vLoading!: boolean
    @Prop({ type: String, default: 'default' }) color!: string
    @Prop({ type: String, default: '' }) caption!: string
    @Prop({ type: Boolean, default: false }) persistent!: boolean
    @Prop({ type: Boolean, default: false }) hideHeader!: boolean
    @Prop({ type: Boolean, default: false }) hideFooter!: boolean
    @Prop({ type: Boolean, default: false }) large!: boolean
    @Prop({ type: Boolean, default: false }) small!: boolean
    @Prop({ type: Boolean, default: false }) scrollable!: boolean
    @Prop({ type: Boolean, default: false }) fullscreen!: boolean

    clickOut(e) {
      if (!this.persistent) this.vValue = false
    }

    @Emit() close() {
      if (!Array.from(document.querySelectorAll('.modal')).some((el) => (el as HTMLElement).style.display === 'block')) {
        const body = document.querySelector('body')
        if (body) body.classList.remove('modal-open')
      }
    }
    beforeOpen() {
      const body = document.querySelector('body')
      if (body) body.classList.add('modal-open')
    }
    @Emit() open() {
      this.getSize()
    }
    getSize() {
      try {
        this.headerHeight = ((this.$el.querySelector('.modal-header') || {}) as HTMLElement).offsetHeight || 0
        this.footerHeight = ((this.$el.querySelector('.modal-footer') || {}) as HTMLElement).offsetHeight || 0
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    mounted() {
      this.getSize()
      window.addEventListener('resize', this.getSize)
    }
    headerHeight = 0
    footerHeight = 0
    dialogMargin = 60
    get offsetHeight() {
      return this.headerHeight + this.footerHeight
    }
    get bodyStyle() {
      const style: any[] = [{ position: 'unset' }]
      if (this.scrollable || this.fullscreen) style.push({ overflow: 'auto' })
      if (this.scrollable || this.fullscreen)
        style.push({ 'max-height': `calc(100vh - ${this.offsetHeight + this.dialogMargin}px)` })
      if (this.fullscreen) style.push({ 'min-height': `calc(100vh - ${this.offsetHeight}px)` })
      return style
    }
  }
</script>

<style scoped>
  .margin-right-1px {
    margin-right: 1px;
  }
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
  .n-modal-enter-active,
  .n-modal-leave-active {
    transition: opacity 0.15s linear;
  }
  .n-modal-enter-to,
  .n-modal-leave {
    opacity: 1;
  }
  .n-modal-enter, .n-modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .n-modal-enter-active .modal-dialog,
  .n-modal-leave-active .modal-dialog {
    transition: transform 0.3s ease-out;
  }
  .n-modal-enter-to .modal-dialog,
  .n-modal-leave .modal-dialog {
    transform: translate(0, 0);
  }
  .n-modal-enter .modal-dialog,
  .n-modal-leave-to .modal-dialog {
    transform: translate(0, -25%);
  }
</style>
