<template>
  <div>
    <div class="panel-group">
      <div class="panel panel-default" v-for="panelIndex in length" :key="panelIndex">
        <div class="panel-heading" style="cursor:pointer" @click="expandPanel(panelIndex)">
          <div class="panel-title" style="display: flex; align-items: center;">
            <slot :name="`header`">
              <slot :name="`header.${panelIndex}`" :index="panelIndex"> header {{ panelIndex }} </slot>
            </slot>
            <n-icon style="margin-left:auto" :class="`fa-chevron-${visible.includes(panelIndex) ? 'up' : 'down'}`"> </n-icon>
          </div>
        </div>
        <!-- <transition name="n-expandable-panel"> -->
        <div v-if="visible.includes(panelIndex)" class="panel-collapse collapse in">
          <div class="panel-body">
            <slot :name="`body`">
              <slot :name="`body.${panelIndex}`" :index="panelIndex"> body {{ panelIndex }} </slot>
            </slot>
          </div>
        </div>
        <!-- </transition> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class NExpandablePanel extends Vue {
  @Prop({ type: Number, default: 1 }) length!: number
  @Prop({ type: Boolean, default: false }) multiple!: boolean
  @Prop({ type: Array, default: () => [] }) value!: number[]
  visible: number[] = [].concat(this.value)

  expandPanel(panelIndex: number) {
    const index = this.visible.findIndex(v => v === panelIndex)
    if (index < 0) {
      if (!this.multiple) this.visible = [panelIndex]
      else this.visible.push(panelIndex)
    } else this.visible.splice(index, 1)
  }
}
</script>

<style>
.n-expandable-panel-enter-active,
.n-expandable-panel-leave-active {
  transition: opacity 0.15s ease-out;
}
.n-expandable-panel-enter,
.n-expandable-panel-leave-to {
  opacity: 0;
}
</style>
