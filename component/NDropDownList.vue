<template>
  <div style="position:relative" @click="openDropDown">
    <input type="hidden" :value="value" />
    <div class="has-feedback">
      <div class="form-control text-overflow">
        <input
          ref="search"
          class="input-flat"
          type="text"
          :style="`width:${searchWidth}px; max-width:100%`"
          @blur="closeDropDown"
          v-model="textSync"
        />
      </div>
      <span :class="`fa fa-caret-${data.isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div v-if="data.isOpen" class="form-control auto-height">
      <slot name="content" :data="data"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import { setTimeout, clearTimeout } from 'timers'
@Component({})
export default class NDropDownList extends Vue {
  @PropSync('text', { type: String, default: '' }) textSync!: string
  @Prop([String, Number]) value!: any

  data = {
    isOpen: false
  }

  closeTimeout: NodeJS.Timeout
  openDropDown() {
    clearTimeout(this.closeTimeout)
    this.data.isOpen = true
    ;(this.$refs.search as any).focus()
  }
  closeDropDown() {
    this.closeTimeout = setTimeout(() => {
      this.data.isOpen = false
    }, 150)
  }
  get searchWidth() {
    return 8 * this.textSync.length + 15
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
.auto-height {
  height: auto;
  position: absolute;
  width: 100%;
  padding: 0px 0px;
}
</style>
