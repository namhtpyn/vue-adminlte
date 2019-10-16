<template>
  <ul :class="paginationClass">
    <li :class="{ disabled: vValue === 1 }">
      <a style="cursor:pointer" @click="previousClick">❮</a>
    </li>
    <li :class="{ active: vValue === page }" v-for="(page, index) in items" :key="index">
      <a class="hidden-xs" style="cursor:pointer" @click="changePage(page)">{{ page }}</a>
    </li>
    <li :class="{ disabled: vValue === length }">
      <a style="cursor:pointer" @click="forwardClick">❯</a>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop, ModelVar } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
@Component({})
export default class NPagination extends Vue {
  @Prop(Boolean) small!: boolean

  @Prop({ type: Number, default: 0 }) length!: number
  @Prop({ type: Number, default: 7 }) totalVisible!: number
  @ModelVar('input', 'value', { type: Number, default: 1 }) vValue!: number

  get paginationClass() {
    const css: string[] = ['pagination']
    if (this.small) css.push('pagination-sm')
    return css
  }
  get items(): (string | number)[] {
    const maxLength = this.totalVisible
    if (this.length <= maxLength) {
      return this.range(1, this.length)
    }

    const even = maxLength % 2 === 0 ? 1 : 0
    const left = Math.floor(maxLength / 2)
    const right = this.length - left + 1 + even

    if (this.vValue > left && this.vValue < right) {
      const start = this.vValue - left + 2
      const end = this.vValue + left - 2 - even

      return [1, '...', ...this.range(start, end), '...', this.length]
    } else if (this.vValue === left) {
      const end = this.vValue + left - 1 - even
      return [...this.range(1, end), '...', this.length]
    } else if (this.vValue === right) {
      const start = this.vValue - left + 1
      return [1, '...', ...this.range(start, this.length)]
    } else {
      return [...this.range(1, left), '...', ...this.range(right, this.length)]
    }
  }
  range(from: number, to: number) {
    from = from > 0 ? from : 1
    return _.range(from, to + 1)
  }
  changePage(page: number) {
    if (isNaN(page)) return
    this.vValue = page
  }
  previousClick() {
    if (this.vValue >= 2) this.changePage(this.vValue - 1)
  }
  forwardClick() {
    if (this.vValue < this.length) this.changePage(this.vValue + 1)
  }
}
</script>

<style scoped></style>
