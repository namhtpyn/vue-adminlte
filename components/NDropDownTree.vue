<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <n-drop-down-list
      :value="value"
      @input="input"
      :text.sync="getText"
      :drop-down-width="dropDownWidth"
      @open="onOpen"
      @close="onClose"
    >
      <template #content="{data}">
        <n-tree
          :items="treeItems"
          :item-value="itemValue"
          :item-text="itemText"
          :parent-key="treeParentKey"
          :expand-all="treeExpandAll"
          :expand-to-level="treeExpandToLevel"
          :icon="treeNodeIcon"
          :searchable="searchable"
          :value="value"
          fixed-search
          height="260px"
          @select="item => itemSelect(item, data)"
        ></n-tree>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Emit, Prop } from 'vue-property-decorator'
import _ from 'lodash'
import NDropDownList from './NDropDownList.vue'
import NTree from './NTree.vue'
@Component({
  components: {
    NDropDownList,
    NTree
  }
})
export default class NDropDownTree extends Vue {
  @Prop({ type: Array, required: true }) treeItems!: any[]
  @Prop({ type: String, default: 'none' }) treeNodeIcon!: string
  @Prop({ type: Boolean, default: false }) treeExpandAll!: boolean
  @Prop({ type: Boolean, default: false }) searchable!: boolean
  @Prop({ type: Number, default: 0 }) treeExpandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: [String, Number], default: 'parentID' }) treeParentKey!: string | number

  @Prop([String, Number]) dropDownWidth!: string | number
  @Prop() label!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  valid: boolean = true
  lazyValidation: boolean = false
  private treeComponent!: any
  get hasLabel() {
    return !_.isEmpty(this.label)
  }
  get getText() {
    if (!this.treeItems || this.treeItems.length <= 0) return ''
    const item = this.treeItems.find(item => item[this.itemValue] === this.value)
    if (!item || !Object.hasOwnProperty.call(item, this.itemText)) return ''
    this.$emit('change', item)
    return item[this.itemText].toString()
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
    if (Object.hasOwnProperty.call(item, 'id')) this.input(item.id)
    if (!this.lazyValidation || !this.valid) this.validate(item.id)
    data.isOpen = false
  }
  mounted() {
    this.treeComponent = this.$children[0].$children[0] as any
  }
  private onOpen() {
    this.$nextTick(() => {
      this.treeComponent.focusSelectedNode()
      this.treeComponent.focusSearch()
    })
  }
  private onClose() {
    this.treeComponent.searchText = ''
  }
}
</script>

<style scoped></style>
