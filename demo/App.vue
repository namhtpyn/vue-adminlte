<template>
  <div>
    <!-- <n-data-table v-model="OKOK" ref="table" :items="items" selectable multiple-select excelable editable>
      <items>
        <text-item value="stt" text="stt"></text-item>
        <percent-item value="provinceID" text="provinceID" sortable filterable summary="count"></percent-item>
        <text-item value="provinceCode" text="provinceCode" grouped></text-item>
        <datetime-item value="provinceName" text="provinceName"></datetime-item>
      </items>
      <template v-slot:[`item.stt`]="{index}">
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
    <n-btn @click="toggleVisibility"></n-btn> -->

    <n-line-chart read-url="./data/traffics.json">
      <common value="Statisticdate" :format="(v) => 'xxx' + v"></common>
      <series>
        <item
          text="TrafficIn"
          value="trafficIN"
          background-color="rgb(0, 36, 93)"
          border-color="rgb(0, 36, 93)"
          :format="(v) => 123"
        ></item>
        <item
          text="TrafficOut"
          value="trafficOut"
          background-color="rgb(241, 115, 172)"
          border-color="rgb(241, 115, 172)"
          :format="(v) => 321"
        ></item>
      </series>
      <options>
        <axises>
          <y-axis text="Luu luong" :format="(v) => '$$$' + v"></y-axis>
          <x-axis text="Thoi gian" :format="(v) => '###' + v"></x-axis>
        </axises>
      </options>
    </n-line-chart>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from '@namhoang/vue-property-decorator'

  @Component({})
  export default class VApp extends Vue {
    consolelog(x, ...y) {
      console.log(x, ...y)
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
