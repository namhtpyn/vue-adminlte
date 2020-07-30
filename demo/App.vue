<template>
  <div>
    <n-tabs :length="10" :lazy="false">
      <template #header.1>header</template>
      <template #body.1>body</template>
      <template #header.2>header2</template>
      <template #body.2>body2</template>
      <template #header.3>header3</template>
      <template #body.3>body3</template>
    </n-tabs>
    <!-- <n-select
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
    </n-data-table> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "@namhoang/vue-property-decorator";
import provinces from "./data/provinces.json";
@Component({})
export default class VApp extends Vue {
  a = provinces;
  type = 1;
  get readUrl() {
    return "./data/provinces.json?type" + this.type;
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
