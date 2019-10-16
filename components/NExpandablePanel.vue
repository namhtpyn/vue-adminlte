<template>
  <div class="panel-group" style="margin-bottom:0px">
    <div class="panel panel-default" v-for="panelIndex in length" :key="panelIndex">
      <div class="panel-heading" style="cursor:pointer" @click="expandPanel(panelIndex)">
        <div class="panel-title" style="display: flex; align-items: center;">
          <slot :name="`header`">
            <slot :name="`header.${panelIndex}`" :index="panelIndex"> header {{ panelIndex }} </slot>
          </slot>
          <n-icon style="margin-left:auto" :class="`fa-chevron-${vValue.includes(panelIndex) ? 'up' : 'down'}`"> </n-icon>
        </div>
      </div>
      <n-expand-transition>
        <div v-show="vValue.includes(panelIndex)" class="panel-collapse">
          <div class="panel-body">
            <slot :name="`body`">
              <slot :name="`body.${panelIndex}`" :index="panelIndex"> body {{ panelIndex }} </slot>
            </slot>
          </div>
        </div>
      </n-expand-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ModelVar } from '@namhoang/vue-property-decorator'

@Component({})
export default class NExpandablePanel extends Vue {
  @Prop({ type: Number, default: 1 }) length!: number
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @ModelVar('input', 'value', { type: Array, default: () => [] }) vValue!: number[]

  expandPanel(panelIndex: number) {
    const index = this.vValue.findIndex(v => v === panelIndex)
    if (index < 0) {
      if (!this.multiple) this.vValue = [panelIndex]
      else this.vValue.push(panelIndex)
    } else this.vValue.splice(index, 1)
  }
  created() {
    if (!this.vValue) this.vValue = []
  }
}
</script>

<style></style>
