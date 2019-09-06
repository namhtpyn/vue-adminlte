<template>
  <div :class="`modal modal-${color} fade`">
    <div class="modal-dialog">
      <div class="modal-content">
        <div v-if="!hideHeader" class="modal-header" style="display:flex">
          <h4 class="modal-title" style="flex:1">{{ caption }}</h4>
          <n-icon style="cursor:pointer" data-dismiss="modal">times</n-icon>
        </div>
        <div class="modal-body" v-if="value">
          <slot></slot>
        </div>
        <div v-if="!hideFooter" class="modal-footer">
          <slot name="footer"></slot>
        </div>
        <n-overlay absolute :value="loading">
          <n-icon css-class="fa-spin fa-3x" style="color:white">circle-o-notch</n-icon>
        </n-overlay>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, Emit, Prop } from 'vue-property-decorator'
import NIcon from '../component/NIcon.vue'
import NOverlay from '../component/NOverlay.vue'
@Component({ inheritAttrs: false, components: { NIcon, NOverlay } })
export default class NModal extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean

  @Prop({ type: String, default: 'default' }) color!: string
  @Prop({ type: String, default: '' }) caption!: string
  @Prop({ type: Boolean, default: false }) persistent!: boolean
  @Prop({ type: Boolean, default: false }) hideHeader!: boolean
  @Prop({ type: Boolean, default: false }) hideFooter!: boolean
  @Model('input', { type: Boolean, default: false }) value!: boolean
  @Emit() input(e) {}
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    ;($(this.$el) as any).modal(val ? 'show' : 'hide')
  }
  mounted() {
    ;($(this.$el) as any)
      .modal({ backdrop: !this.persistent, show: this.value })
      .on('hidden.bs.modal', () => this.input(false))
      .on('shown.bs.modal', () => this.input(true))
  }
}
</script>

<style></style>
