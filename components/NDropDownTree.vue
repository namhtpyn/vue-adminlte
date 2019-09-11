<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label" :style="{ 'font-size': this.small ? '12px' : this.large ? '18px' : '14px' }">
      {{ label }}
    </label>
    <n-drop-down-list
      :value="value"
      @input="input"
      :text.sync="text"
      :drop-down-width="dropDownWidth"
      :hint="hint"
      :small="small"
      :large="large"
      @open="onOpen"
      @close="onClose"
    >
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
          @select="item => itemSelect(item, data)"
          @error="error"
        ></n-tree>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins, Ref } from 'vue-property-decorator'
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
  @Prop(Array) rules!: any[]
  @Ref('tree') tree!: NTree
  @Model('input', [String, Number]) value!: string | number

  //treeItems: any[] = []
  valid: boolean = true
  lazyValidation: boolean = false
  private text: string = ''

  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  // get getText() {
  //   if (_.isEmpty(this.treeItems)) return ''
  //   const item = this.treeItems.find(item => item[this.itemValue] === this.value)
  //   if (!item || !Object.hasOwnProperty.call(item, this.itemText)) return ''
  //   this.$emit('change', item)
  //   return item[this.itemText].toString()
  // }
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
    this.text = item.text
    this.input(item.id)
    if (!this.lazyValidation || !this.valid) this.validate(item.id)
    data.isOpen = false
  }
  mounted() {}
  private onOpen() {
    this.$nextTick(() => {
      this.tree.focusSelectedNode()
      this.tree.focusSearch()
    })
  }
  private onClose() {
    this.tree.searchText = ''
  }
}
</script>

<style scoped></style>
