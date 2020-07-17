<template>
  <div>
    <n-select
      v-model="type"
      :items="[
        { text: '1', value: 1 },
        { text: '2', value: 2 }
      ]"
    ></n-select>
    <n-data-table :selectable="type == 1" multiple-select ref="table" multiple :read-url="readUrl" v-model="a">
      <items>
        <text-item value="provinceIDx" text="provinceIDx" editable></text-item>
        <text-item value="provinceID" text="provinceID" :validate="[v => v > 1050 || 'Error']" editable></text-item>
        <text-item value="provinceCode" text="provinceCode"></text-item>
        <text-item value="provinceName" text="provinceName"></text-item>
      </items>
    </n-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@namhoang/vue-property-decorator'
import provinces from './data/provinces.json'
@Component({})
export default class VApp extends Vue {
  a = provinces
  type = 1
  get readUrl() {
    return './data/provinces.json?type' + this.type
  }
  mounted() {}
}
</script>

<style>
/* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
