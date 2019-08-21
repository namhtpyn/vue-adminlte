<template>
  <select :class="selectCssClass"></select>
</template>


<script lang="ts">
import { Component, Vue, Prop, Emit, Model } from "vue-property-decorator";
@Component({})
export default class NSelect2 extends Vue {
  @Prop({ type: String, default: "" }) cssClass!: string;

  @Prop({ type: Boolean, default: false }) clearable!: boolean;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: Boolean, default: false }) multiple!: boolean;
  @Prop({ type: Boolean, default: false }) searchable!: boolean;
  @Prop({ type: String, default: "text" }) itemText!: string;
  @Prop({ type: String, default: "value" }) itemValue!: string;
  @Prop(Array) items!: any[];
  @Prop(String) hint!: string;
  @Model("input", [String, Number]) value!: string | Number;
  @Emit() input(e) {}
  get selectCssClass() {
    let css = "form-control ";
    css += this.cssClass || "";
    return css;
  }
  get select2Data() {
    return this.items.map(item => {
      return { id: item[this.itemValue], text: item[this.itemText] };
    });
  }

  mounted() {
    ($(this.$el) as any)
      .select2({
        data: this.select2Data,
        allowClear: this.clearable,
        disabled: this.disabled,
        multiple: this.multiple,
        placeholder: this.hint,
        minimumResultsForSearch: this.searchable ? 0 : -1
      })
      .change(e => this.input(e.target.value));
  }
}
</script>

<style>
</style>