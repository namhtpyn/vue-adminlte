<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="styleLabel">
      {{ label }}
    </label>
    <n-drop-down-list :text="text" :drop-down-width="dropDownWidth" :hint="hint" :small="small" :large="large" @open="onOpen">
      <template #content="{data}">
        <n-tree
          ref="tree"
          :items="vItems"
          :item-value="itemValue"
          :item-text="itemText"
          :parent-key="treeParentKey"
          :expand-all="treeExpandAll"
          :expand-to-level="treeExpandToLevel"
          :icon="treeNodeIcon"
          :searchable="searchable"
          :value="value"
          sticky-search
          no-focus-on-loaded
          @select="item => itemSelect(item, data)"
          @error="error"
        ></n-tree>
      </template>
    </n-drop-down-list>
    <span v-if="!valid && !hideErrorText" class="help-block">{{ errorText }}</span>

    <n-overlay absolute :value="vLoading">
      <n-icon css-class="fa-spin fa-4x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins, Ref, Emit } from 'vue-property-decorator'
import _ from 'lodash'
import NTree from './NTree.vue'
import NDataSource from './Base/NDataSource'
@Component({})
export default class NDropDownTree extends Mixins(NDataSource) {
  @Prop({ type: String, default: 'none' }) treeNodeIcon!: string
  @Prop({ type: Boolean, default: false }) treeExpandAll!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Number, default: 0 }) treeExpandToLevel!: number
  @Prop({ type: [String, Number], default: 'parentID' }) treeParentKey!: string | number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop([String, Number]) dropDownWidth!: string | number
  @Prop(String) label!: string
  @Prop(String) hint!: string
  @Prop({ type: Boolean, default: false }) small!: boolean
  @Prop({ type: Boolean, default: false }) large!: boolean
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop({ type: Boolean, default: false }) hideErrorText!: string
  @Prop(Array) rules!: any[]
  @Ref('tree') tree!: NTree
  @Model('input', [String, Number]) value!: string | number
  @Emit() select(e) {}

  //treeItems: any[] = []
  valid: boolean = true
  lazyValidation: boolean = false

  get text() {
    const item = this.vItems.find(item => item[this.itemValue] === this.value)
    if (item) return (item[this.itemText] || '').toString()
    return ''
  }

  get styleLabel() {
    return {
      'control-label': true,
      'font-size': `${this.small ? '11px' : this.large ? '15px' : '13px'} !important`
    }
  }

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get errorText() {
    if (!this.valid && this.rules) {
      const f = this.rules.find(r => r(this.value) !== true)
      return f ? f(this.value) : ''
    }
    return ''
  }
  validate(value) {
    this.valid = true
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true)
    return this.valid
  }
  private itemSelect(item, data) {
    this.input(item[this.itemValue])
    this.select(item)
    if (!this.lazyValidation || !this.valid) this.validate(item[this.itemValue])
    data.isOpen = false
  }
  mounted() {}
  private onOpen() {
    this.$nextTick(() => {
      this.tree.focusSelectedNode()
      this.tree.focusSearch()
    })
  }
}
</script>

<style scoped></style>
