<template>
  <ul :class="cCssClass">
    <li :class="{'disabled': value===1}">
      <a style="cursor:pointer" @click="previousClick">❮</a>
    </li>
    <li :class="{'active': value===page}" v-for="(page,index) in items" :key="index">
      <a class="hidden-xs" style="cursor:pointer" @click="changePage(page)">{{page}}</a>
    </li>
    <li :class="{'disabled': value===length}">
      <a style="cursor:pointer" @click="forwardClick">❯</a>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Emit,
  Model
} from "vue-property-decorator";
@Component({ inheritAttrs: false })
export default class NPagination extends Vue {
  @Prop(String) cssClass!: string;
  @Prop(Boolean) small!: boolean;

  @Prop({ type: Number, default: 0 }) length!: number;
  @Prop({ type: Number, default: 7 }) totalVisible!: number;
  @Model("input", { type: Number, default: 0 }) value!: number;

  get cCssClass() {
    let css = "pagination ";
    css += this.small ? "pagination-sm " : "";
    css += this.cssClass || "";
    return css;
  }
  get items(): (string | number)[] {
    const maxLength = this.totalVisible;
    if (this.length <= maxLength) {
      return this.range(1, this.length);
    }

    const even = maxLength % 2 === 0 ? 1 : 0;
    const left = Math.floor(maxLength / 2);
    const right = this.length - left + 1 + even;

    if (this.value > left && this.value < right) {
      const start = this.value - left + 2;
      const end = this.value + left - 2 - even;

      return [1, "...", ...this.range(start, end), "...", this.length];
    } else if (this.value === left) {
      const end = this.value + left - 1 - even;
      return [...this.range(1, end), "...", this.length];
    } else if (this.value === right) {
      const start = this.value - left + 1;
      return [1, "...", ...this.range(start, this.length)];
    } else {
      return [...this.range(1, left), "...", ...this.range(right, this.length)];
    }
  }
  range(from: number, to: number) {
    const range = [];

    from = from > 0 ? from : 1;

    for (let i = from; i <= to; i++) {
      range.push(i);
    }

    return range;
  }
  changePage(page: number) {
    if (isNaN(page)) return;
    this.$emit("input", page);
  }
  previousClick() {
    if (this.value >= 2) this.changePage(this.value - 1);
  }
  forwardClick() {
    if (this.value < this.length) this.changePage(this.value + 1);
  }
}
</script>

<style scoped>
</style>