<template>
  <!-- <div v-click-out="close">
    <div class="has-feedback" @click="toggle">
      <div :class="containerCss" style="width: 100%">
        <input type="text" readonly class="input-flat text-overflow" :placeholder="hint" :value="text" />
      </div>
      <span v-if="!useModal" :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div v-if="!useModal" v-show="data.isOpen" class="form-control drop-down-container" :style="containerStyle">
      <slot name="content" :data="data">
        Placeholder
      </slot>
    </div>
    <n-modal
      :caption="hint"
      v-else
      v-model="data.isOpen"
      hide-footer
      scrollable
      :large="modalLarge"
      :small="modalSmall"
      :fullscreen="modalFullscreen"
      @open="open"
      @close="close"
    >
      <slot name="content" :data="data"></slot>
    </n-modal>
  </div> -->
  <div v-click-out="close">
    <div :class="containerCss" style="display: flex">
      <div style="width: 100%" @click="toggle">
        <input type="text" readonly class="input-flat text-overflow" :placeholder="hint" :value="text" />
      </div>
      <div>
        <span v-if="!useModal && clearable" class="fa fa-close" @click="clear"></span>
        <span v-if="!useModal" :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'}`" @click="toggle"></span>
      </div>
    </div>
    <div v-if="!useModal" v-show="data.isOpen" class="form-control drop-down-container" :style="containerStyle">
      <slot name="content" :data="data">
        Placeholder
      </slot>
    </div>
    <n-modal
      :caption="hint"
      v-else
      v-model="data.isOpen"
      hide-footer
      scrollable
      :large="modalLarge"
      :small="modalSmall"
      :fullscreen="modalFullscreen"
      @open="open"
      @close="close"
    >
      <slot name="content" :data="data"></slot>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins, Watch } from '@namhoang/vue-property-decorator'
import vClickOutside from 'v-click-outside'
import NBase from './Base/NBase'
@Component({
  directives: {
    clickOut: vClickOutside.directive
  }
})
export default class NDropDownList extends Mixins(NBase) {
  @Prop({ type: String, default: '' }) text!: string
  @Prop(String) hint!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: false }) modal!: boolean
  @Prop({ type: Boolean, default: false }) modalLarge!: boolean
  @Prop({ type: Boolean, default: false }) modalSmall!: boolean
  @Prop({ type: Boolean, default: false }) modalFullscreen!: boolean
  @Prop({ type: Boolean, default: false }) clearable!: boolean
  @Prop([String, Number]) dropDownWidth!: string | number

  data = {
    isOpen: false
  }

  toggle(e) {
    this.data.isOpen ? this.close(e) : this.open(e)
  }

  get useModal() {
    return this.modal || this.isXs
  }

  @Emit() open(e) {
    this.data.isOpen = true
  }
  @Emit() close(e) {
    this.data.isOpen = false
  }
  @Emit() clear(e) {
    console.log('clear')
  }
  get searchWidth() {
    return 8 * this.text.length + 15
  }
  get isShowHint() {
    return this.hint && this.text === ''
  }
  get containerCss() {
    return {
      'form-control': true,
      'text-overflow': true,
      hint: this.isShowHint,
      'input-sm': this.small,
      'input-lg': this.large
    }
  }
  @Watch('data.isOpen')
  onToggleDropDown(n) {
    if (n) this.componentWidth = this.$el.clientWidth
  }
  componentWidth: number = 0
  mounted() {
    window.addEventListener('resize', () => {
      this.componentWidth = this.$el.clientWidth
    })
  }
  get containerStyle() {
    return {
      width: this.dropDownWidth ? `${this.dropDownWidth}px` : 'fit-content',
      'min-width': this.componentWidth ? `${this.componentWidth}px` : 'unset'
    }
  }
}
</script>

<style scoped>
.hint {
  color: #ccc;
}
.text-overflow {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.input-flat,
.input-flat:active {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: content-box;
  box-shadow: none;
  width: 100%;
}
.drop-down-container {
  height: auto;
  width: fit-content;
  width: -moz-fit-content;
  position: absolute;
  max-height: 300px;
  overflow: auto;
  padding: 0px 0px;
  z-index: 9999;
}
</style>
