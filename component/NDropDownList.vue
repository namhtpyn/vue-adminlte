<template>
  <div style="position:relative" @click="openDropDown">
    <input type="hidden" />
    <div class="has-feedback">
      <div class="form-control text-overflow">
        <input
          ref="search"
          class="input-flat"
          type="text"
          :style="`width:${searchWidth}px; max-width:100%`"
          @blur="closeDropDown"
          v-model="search"
        />
      </div>
      <span :class="`fa fa-caret-${isOpen ? 'up' : 'down'} form-control-feedback`"></span>
    </div>
    <div v-if="isOpen" class="form-control auto-height">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { setTimeout, clearTimeout } from 'timers'
@Component({})
export default class NDropDownList extends Vue {
  search = ''
  isOpen = false
  closeTimeout: NodeJS.Timeout
  openDropDown() {
    clearTimeout(this.closeTimeout)
    this.isOpen = true
    ;(this.$refs.search as any).focus()
  }
  closeDropDown() {
    this.closeTimeout = setTimeout(() => {
      this.isOpen = false
    }, 150)
  }
  get searchWidth() {
    return 8 * this.search.length + 15
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
