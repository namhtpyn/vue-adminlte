<template>
  <div :class="{ 'form-group': form, 'has-error': !valid }">
    <label v-if="hasLabel" class="control-label">{{ label }}</label>
    <n-drop-down-list :value="value" @input="input" :text.sync="getText" :drop-down-width="dropDownWidth" @open="onOpen">
      <template #content="{data}">
        <n-tree
          :items="treeItems"
          :item-value="itemValue"
          :item-text="itemText"
          :parent-key="parentKey"
          :expand-all="treeExpandAll"
          :expand-to-level="treeExpandToLevel"
          :icon="treeNodeIcon"
          :searchable="searchable"
          @select="item => itemSelect(item, data)"
        ></n-tree>
      </template>
    </n-drop-down-list>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Emit, Prop } from 'vue-property-decorator'
import isEmpty from 'lodash/isEmpty'
import NDropDownList from '../component/NDropDownList.vue'
import NTree from '../component/NTree.vue'
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
  @Prop({ type: Boolean, default: true }) searchable!: boolean
  @Prop({ type: Number, default: 0 }) treeExpandToLevel!: number
  @Prop({ type: String, default: 'value' }) itemValue!: string
  @Prop({ type: String, default: 'text' }) itemText!: string
  @Prop({ type: String, default: 'parentID' }) parentKey!: string

  @Prop([String, Number]) dropDownWidth!: string | number
  @Prop() label!: string
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop(Array) rules!: any[]
  @Model('input', [String, Number]) value!: any
  @Emit() input(e) {}
  valid: boolean = true
  lazyValidation: boolean = false
  get hasLabel() {
    return !isEmpty(this.label)
  }
  //search=
  get getText() {
    if (!this.treeItems || this.treeItems.length <= 0) return ''
    const item = this.treeItems.find(item => item[this.itemValue] === this.value)
    if (!item || !Object.hasOwnProperty.call(item, this.itemText)) return ''
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
  itemSelect(item, data) {
    if (Object.hasOwnProperty.call(item, 'id')) this.input(item.id)
    if (!this.lazyValidation || !this.valid) this.validate(item.id)
    data.isOpen = false
  }
  onOpen() {
    if (this.searchable) this.$nextTick(() => this.$children[0].$children[0].$el.querySelector('input').focus())
  }
}
</script>

<style scoped></style>
