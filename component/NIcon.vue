<template>
  <i :class="cCssClass" @click="iconClick"></i>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
@Component({})
export default class NIcon extends Vue {
  @Prop(String) cssClass!: string
  @Prop({ type: String, default: 'default' }) color!: string
  @Emit('click') iconClick(e) {}

  get cCssClass() {
    let css = 'fa '
    css += this.$slots.default[0].text ? 'fa-' + this.$slots.default[0].text + ' ' : ''
    css += this.color ? 'text-' + this.color + ' ' : ''
    css += this.cssClass || ''
    return css
  }
}
</script>

<style scoped>

</style>
