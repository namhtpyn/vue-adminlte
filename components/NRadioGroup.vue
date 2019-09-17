<template>
  <div :class="{ 'form-group': form }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Model, Watch, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import NBase from './Base/NBase'
import { VueNode } from '../extension/VueSlot'
@Component({ inheritAttrs: false })
export default class NRadioGroup extends Mixins(NBase) {
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Model('input', { type: [String, Number, Boolean, Object] }) value: number | string | boolean | object

  private radioComponents: any[] = []
  mounted() {
    const nodes = this.vSlot.find((node: VueNode) => node.isComponent && node.componentInstance.$options.name === 'NRadio')
    this.radioComponents = nodes.map(o => o.componentInstance)
    if (this.value) this.setGroupModel(this.value)
  }

  get groupModelArray() {
    let result = []
    if (!_.isEmpty(this.radioComponents)) {
      result = this.radioComponents.map(r => r.groupModel)
    }
    return result
  }

  @Watch('groupModelArray')
  private onGroupModelArrayChange(n: any[], o: any[]) {
    if (!_.isEmpty(n) && !_.isEmpty(o) && _.unionWith(n, _.isEqual).length !== 1) {
      const [changedValue] = _.difference(n, o)
      this.setGroupModel(changedValue)
      this.input(changedValue)
    }
  }

  private setGroupModel(value) {
    this.radioComponents.forEach(r => (r.groupModel = _.cloneDeep(value)))
  }
}
</script>

<style></style>
