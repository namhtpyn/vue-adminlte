<template>
  <div style="position:relative" v-click-out="closeDropDown">
    <input type="hidden" :value="value" />
    <div class="has-feedback" @click="toggleDropDown">
      <div :class="containerCss" style="width: 100%">
        {{ isShowHint ? hint : textSync }}
      </div>
      <span :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div v-show="data.isOpen" class="form-control auto-height" :style="dropDownWidth ? `width:${dropDownWidth}px` : ''">
      <slot name="content" :data="data"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator'
import vClickOutside from 'v-click-outside'
@Component({
  directives: {
    clickOut: vClickOutside.directive
  }
})
export default class NDropDownList extends Vue {
  @PropSync('text', { type: String, default: '' }) textSync!: string
  @Prop(String) hint!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop([String, Number]) value!: any
  @Prop([String, Number]) dropDownWidth!: string | number

  data = {
    isOpen: false
  }

  toggleDropDown(e) {
    this.data.isOpen ? this.closeDropDown(e) : this.openDropDown(e)
  }

  @Emit('open') openDropDown(e) {
    this.data.isOpen = true
  }
  @Emit('close') closeDropDown(e) {
    this.data.isOpen = false
  }
  get searchWidth() {
    return 8 * this.textSync.length + 15
  }
  get isShowHint() {
    return this.hint && this.textSync === ''
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
.input-flat,
.input-flat:active {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: content-box;
  box-shadow: none;
}
.auto-height {
  height: auto;
  position: absolute;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 0px 0px;
  z-index: 9999;
}
</style>
