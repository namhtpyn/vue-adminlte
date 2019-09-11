<template>
  <div style="position:relative" v-click-out="close">
    <div class="has-feedback" @click="toggle">
      <div :class="containerCss" style="width: 100%">
        <input type="text" readonly class="input-flat text-overflow" :placeholder="hint" :value="text" />
      </div>
      <span v-if="!modal" :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div
      v-if="!modal"
      v-show="data.isOpen"
      class="form-control drop-down-container"
      :style="dropDownWidth ? `width:${dropDownWidth}px` : ''"
    >
      <slot name="content" :data="data"></slot>
    </div>
    <n-modal v-else v-model="data.isOpen">
      <slot name="content" :data="data"></slot>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import vClickOutside from 'v-click-outside'
@Component({
  directives: {
    clickOut: vClickOutside.directive
  }
})
export default class NDropDownList extends Vue {
  @Prop({ type: String, default: '' }) text!: string
  @Prop(String) hint!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: false }) modal!: boolean
  @Prop([String, Number]) dropDownWidth!: string | number

  data = {
    isOpen: false
  }

  toggle(e) {
    this.data.isOpen ? this.close(e) : this.open(e)
  }

  @Emit() open(e) {
    this.data.isOpen = true
  }
  @Emit() close(e) {
    this.data.isOpen = false
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
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 0px 0px;
  z-index: 9999;
}
</style>
