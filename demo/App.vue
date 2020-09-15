<template>
  <div>
    <n-data-table v-model="OKOK" ref="table" :items="items" selectable multiple-select excelable editable>
      <items>
        <text-item value="stt" text="stt"></text-item>
        <percent-item value="provinceID" text="provinceID" sortable filterable summary="count"></percent-item>
        <text-item value="provinceCode" text="provinceCode" grouped></text-item>
        <datetime-item value="provinceName" text="provinceName"></datetime-item>
      </items>
      <template #item.stt="{index}">
        {{ index + 1 }}
        <div>
          cung dc
          <div>khong hay lam</div>
        </div>
        <div>a</div>
      </template>
      <template #footer="{items,headers}">
        <tr>
          <td colspan="4"></td>
          <td>44</td>
        </tr>
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
