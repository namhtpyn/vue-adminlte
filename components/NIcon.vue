<template>
  <i :class="cCssClass" @click="iconClick" v-bind="$attrs"></i>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import _ from 'lodash'
@Component({ inheritAttrs: false })
export default class NIcon extends Vue {
  @Prop({ type: String, default: 'default' }) color!: string
  @Emit('click') iconClick(e) {}

  get cCssClass() {
    let css = 'fa '
    css +=
      !_.isEmpty(this.$slots.default) && this.$slots.default[0].text.trim()
        ? 'fa-' + this.$slots.default[0].text.trim() + ' '
        : ''
    css += this.color ? 'text-' + this.color + ' ' : ''
    return css
  }
}
</script>
