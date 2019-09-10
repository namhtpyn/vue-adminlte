<template>
  <div style="position:relative" v-click-out="closeDropDown">
    <input type="hidden" :value="value" />
    <div class="has-feedback">
      <div @click="openDropDown" class="form-control text-overflow">
        {{ text }}
      </div>
      <span :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div v-show="data.isOpen" class="form-control drop-down-container" :style="dropDownWidth ? `width:${dropDownWidth}px` : ''">
      <slot name="content" :data="data"></slot>
    </div>
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
  @Prop([String, Number]) value!: any
  @Prop([String, Number]) dropDownWidth!: string | number

  data = {
    isOpen: false
  }

  @Emit('open') openDropDown(e) {
    this.data.isOpen = true
  }
  @Emit('close') closeDropDown(e) {
    this.data.isOpen = false
  }
  get searchWidth() {
    return 8 * this.text.length + 15
  }
}
</script>

<style scoped>
.input-flat,
.input-flat:active {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: content-box;
  box-shadow: none;
}
.drop-down-container {
  height: auto;
  position: absolute;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 0px 0px;
  z-index: 9999;
}
</style>
