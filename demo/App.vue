<template>
  <div>
    <n-data-table v-model="OKOK" ref="table" :items="items" selectable multiple-select excelable export-title="Báo cáo thống kê">
      <items>
        <percent-item value="provinceID" text="provinceID" sortable filterable summary="count"></percent-item>
        <text-item value="provinceCode" text="provinceCode" grouped></text-item>
        <datetime-item value="provinceName" text="provinceName" grouped></datetime-item>
      </items>
      <template #item.province-id="prop">
        <img src="haha.jpg" />
        <img src="haha.jpg" />
        <img src="haha.jpg" />
        <img src="haha.jpg" />
      </template>
    </n-data-table>
    <n-btn @click="toggleVisibility"></n-btn>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from '@namhoang/vue-property-decorator'
  import provinces from './data/provinces.json'

  @Component({})
  export default class VApp extends Vue {
    OKOK = provinces
    visible = true
    items = [
      { provinceID: 0.123, provinceCode: 'Code', provinceName: new Date() },
      { provinceID: 0.123, provinceCode: 'Code', provinceName: new Date() },
      { provinceID: 0.123, provinceCode: 'Code', provinceName: new Date() },
      { provinceID: 0.123, provinceCode: 'Nam', provinceName: new Date() },
    ]
    toggleVisibility() {
      this.visible = !this.visible
    }
    get readUrl() {
      return './data/provinces.json'
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
