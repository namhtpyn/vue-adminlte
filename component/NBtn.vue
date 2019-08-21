<template>
  <a :class="cCssClass" @click="btnClick">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Emit } from "vue-property-decorator";
@Component({ inheritAttrs: false })
export default class NDataTable extends Vue {
  @Prop(String) cssClass!: string;
  @Prop({ type: String, default: "default" }) color!: string;
  @Prop(String) textColor!: string;
  @Prop(Boolean) app!: boolean;
  @Prop(Boolean) block!: boolean;
  @Prop(Boolean) large!: boolean;
  @Prop(Boolean) small!: boolean;
  @Prop(Boolean) xSmall!: boolean;
  @Prop(Boolean) flat!: boolean;
  @Prop(Boolean) disabled!: boolean;

  @Emit("click") btnClick(e) {}

  get cCssClass() {
    let css = "btn ";
    css += this.cCssColor + " ";
    css += this.textColor ? "text-" + this.textColor + " " : "";
    css += this.block ? "btn-block " : "";
    css += this.large ? "btn-lg " : "";
    css += this.small ? "btn-sm " : "";
    css += this.xSmall ? "btn-xs " : "";
    css += this.flat ? "btn-flat " : "";
    css += this.app ? "btn-app " : "";
    css += this.disabled ? "disabled " : "";
    css += this.cssClass || "";
    return css;
  }
  get cCssColor() {
    if (
      ["default", "primary", "danger", "warning", "success", "info"].includes(
        this.color
      )
    )
      return "btn-" + this.color;
    else return "bg-" + this.color;
  }
}
</script>

<style scoped>
</style>