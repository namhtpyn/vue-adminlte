<template>
  <a :class="cssClass" @click="click">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
@Component({})
export default class NBtn extends Vue {
  @Prop({ type: String, default: 'default' }) readonly color!: string
  @Prop(String) readonly textColor!: string
  @Prop(Boolean) readonly app!: boolean
  @Prop(Boolean) readonly block!: boolean
  @Prop(Boolean) readonly large!: boolean
  @Prop(Boolean) readonly small!: boolean
  @Prop(Boolean) readonly xSmall!: boolean
  @Prop(Boolean) readonly flat!: boolean
  @Prop(Boolean) readonly disabled!: boolean

  @Emit() click(e) {}

  private get cssClass() {
    let css = 'btn '
    css += this.cssColor + ' '
    css += this.textColor ? 'text-' + this.textColor + ' ' : ''
    css += this.block ? 'btn-block ' : ''
    css += this.large ? 'btn-lg ' : ''
    css += this.small ? 'btn-sm ' : ''
    css += this.xSmall ? 'btn-xs ' : ''
    css += this.flat ? 'btn-flat ' : ''
    css += this.app ? 'btn-app ' : ''
    css += this.disabled ? 'disabled ' : ''
    return css
  }
  private get cssColor() {
    if (['default', 'primary', 'danger', 'warning', 'success', 'info'].includes(this.color)) return 'btn-' + this.color
    else return 'bg-' + this.color
  }
}
</script>

<style scoped></style>
