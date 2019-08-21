<template>
  <div :class="'form-group ' + (!valid ? 'has-error': '')">
    <label class="control-label">{{ label }}</label>
    <div :class="inputGroup ? 'input-group': '' ">
      <span v-if="prefix" class="input-group-addon">{{ prefix }}</span>
      <span v-if="prependIcon" class="input-group-addon">
        <n-icon>{{ prependIcon }}</n-icon>
      </span>
      <input
        :type="type"
        :class="cCssClass"
        :placeholder="hint"
        :value="vModel"
        @input="(e)=>input(e.target.value)"
        @blur="validate(vModel)"
        :disabled="readonly"
      />
      <span v-if="suffix" class="input-group-addon">{{ suffix }}</span>
      <span v-if="appendIcon" class="input-group-addon">
        <n-icon>{{ appendIcon }}</n-icon>
      </span>
      <span v-if="appendButton" class="input-group-btn">
        <slot name="appendButton"></slot>
      </span>
    </div>
    <span v-if="!valid" class="help-block">{{ errorText }}</span>
  </div>
</template>

<script lang="ts">
import NIcon from "../component/NIcon.vue";
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Emit,
  Model
} from "vue-property-decorator";
@Component({ components: { NIcon } })
export default class NTextBox extends Vue {
  @Prop({ type: String, default: "text" }) type!: string;
  @Prop(String) cssClass!: string;
  @Prop(String) label!: string;
  @Prop(String) hint!: string;
  @Prop(Array) rules!: any[];
  @Prop(Boolean) readonly!: boolean;
  @Prop({ type: String, default: "default" }) color!: string;
  @Prop(String) prefix!: string;
  @Prop(String) prependIcon!: string;
  @Prop(String) suffix!: string;
  @Prop(String) appendIcon!: string;
  @Model("input", { type: String }) vModel: string;
  @Emit() input(e) {
    this.validate(e);
  }
  valid: boolean = true;

  get appendButton() {
    return this.$slots.appendButton;
  }
  get inputGroup() {
    return (
      this.prefix ||
      this.prependIcon ||
      this.suffix ||
      this.appendIcon ||
      this.appendButton
    );
  }
  get cCssClass() {
    let css = "form-control " + this.cssClass;
    return css;
  }
  get errorText() {
    if (this.rules) {
      let f = this.rules.find(r => r(this.vModel) !== true);
      return f ? f(this.vModel) : "";
    }
    return "";
  }
  validate(text) {
    if (this.rules) this.valid = !this.rules.some(e => e(text) !== true);
    this.valid = true;
  }
}
</script>

<style scoped>
</style>