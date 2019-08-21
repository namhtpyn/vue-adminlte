<template>
  <i :class="cCssClass"></i>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Emit } from "vue-property-decorator";
@Component({})
export default class NDataTable extends Vue {
  @Prop(String) cssClass!: string;
  @Prop({ type: String, default: "default" }) color!: string;

  get cCssClass() {
    let css = "fa ";
    css += this.$slots.default[0].text
      ? "fa-" + this.$slots.default[0].text + " "
      : "";
    css += this.color ? "text-" + this.color + " " : "";
    css += this.cssClass || "";
    return css;
  }
}
</script>

<style scoped>
</style>