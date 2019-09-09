<template>
  <div :class="{ 'form-group': form }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NRadioGroup extends Vue {
  @Prop({ type: Boolean, default: true }) form!: boolean
  @Prop() label!: string
  @Model('input', { type: [String, Number, Boolean, Object] }) value: number | string | boolean | object
  @Emit() input(e) {}

  radioComponents: any[] = []
  mounted() {
    this.findDeep(this.$slots.default)
    if (!_.isEmpty(this.value)) this.setGroupModel(this.value)
  }

  get groupModelArray() {
    let result = []
    if (!_.isEmpty(this.radioComponents)) {
      result = this.radioComponents.map(r => r.groupModel)
    }
    return result
  }

  @Watch('groupModelArray')
  onGroupModelArrayChange(n, o) {
    if (!_.isEmpty(n) && !_.isEmpty(o) && _.unionWith(n, _.isEqual).length !== 1) {
      const [changedValue] = _.difference(n, o)
      this.setGroupModel(changedValue)
      this.input(changedValue)
    }
  }

  setGroupModel(value) {
    this.radioComponents.forEach(r => (r.groupModel = _.cloneDeep(value)))
  }

  findDeep(obj) {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        this.findDeep(obj[i])
      }
    } else {
      if (
        Object.hasOwnProperty.call(obj, 'componentInstance') &&
        !_.isEmpty(obj.componentInstance) &&
        obj.componentInstance.$options._componentTag === 'n-radio'
      ) {
        this.radioComponents.push(obj.componentInstance)
      }
      if (Object.hasOwnProperty.call(obj, 'children') && !_.isEmpty(obj.children)) {
        this.findDeep(obj.children)
      }
    }
  }
}
</script>

<style></style>
