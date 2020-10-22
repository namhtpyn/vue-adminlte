<template>
  <div>
    {{timeDate}} <br>{{ JSON.stringify(timeDate) }}
    <n-drop-down-time-picker v-model="timeDate"></n-drop-down-time-picker>
    {{timeText}}<br> {{ JSON.stringify(timeText) }}
    <n-drop-down-time-picker v-model="timeText" hide-second></n-drop-down-time-picker>


    <n-data-table ref="table" read-url="./data/provinces.json" selectable multiple-select excelable editable
    export-title="Đây là report xxx"
    :export-after-title="[[{text:'Từ ngày xxx đến ngày yyy', colspan:-1}],[{value:''}]]">
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

    <!-- 
    <n-btn @click="toggleVisibility"></n-btn> -->

    <!-- <n-line-chart read-url="./data/traffics.json">
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
    </n-line-chart> -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from '@namhoang/vue-property-decorator'

  @Component({})
  export default class VApp extends Vue {
    timeText: string = '2020-10-16T07:00:00.000'
    timeDate: Date = new Date()
  }
</script>

<style>
  /* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
