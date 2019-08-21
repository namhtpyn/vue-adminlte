<template>
  <div :class="'form-group ' + (!valid ? 'has-error': '')">
    <label css="control-label">{{ label }}</label>
    <select :class="cCssClass" :value="vModel" @input="(e) => input(e.target.value)">
      <option v-for="(item, idx) in items" :key="idx" :value="item[itemValue]">{{ item[itemText] }}</option>
    </select>
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
export default class NSelect extends Vue {
  @Prop(String) label!: string;
  @Prop(String) cssClass!: string;
  @Prop(Array) items!: any[];
  @Prop(Array) rules!: any[];
  @Prop({ type: String, default: "text" }) itemText!: string;
  @Prop({ type: String, default: "value" }) itemValue!: string;
  @Model("input") vModel!: any;
  @Emit() input(e) {
    this.validate(e);
  }
  valid: boolean = true;
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
  validate(value) {
    if (this.rules) this.valid = !this.rules.some(e => e(value) !== true);
  }
}
</script>

<style scoped>
</style>