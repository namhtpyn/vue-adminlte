<template>
  <div>
    {{ timeDate }} <br />{{ JSON.stringify(timeDate) }}
    <n-drop-down-time-picker v-model="timeDate"></n-drop-down-time-picker>
    {{ timeText }}<br />
    {{ JSON.stringify(timeText) }}
    <n-drop-down-time-picker v-model="timeText" hide-second></n-drop-down-time-picker>

    <n-data-table read-url="./data/test.json" searchable excelable>
      <items>
        <band-item text="WTF" header-align="center">
          <items>
            <band-item text="THÔNG TIN LẮP ĐẶT NHÀ THẦU CUNG CẤP" header-align="center">
              <items>
                <text-item text="STT" value="ROWNUM"></text-item>
                <text-item text="Tỉnh/TP" value="PROVINCECODE_NCC" hide></text-item>
                <text-item text="Dự án" value="PROJECT_NCC" filterable sortable width="170px" :exportable="false"></text-item>
              </items>
            </band-item>
            <band-item text="THÔNG TIN ONLINE TRÊN HỆ THỐNG ĐANG KHAI THÁC" header-align="center">
              <items>
                <text-item text="Tỉnh/TP" value="PROVINCECODE" filterable sortable width="120px"></text-item>
                <text-item text="Tên hệ thống (SystemID)" value="SYSTEMNAME" filterable sortable></text-item>
              </items>
            </band-item> </items
        ></band-item>
      </items>
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
  import moment from 'moment'
  @Component({})
  export default class VApp extends Vue {
    timeText: string = '2020-10-16T07:00:00.000'
    timeDate: Date = new Date()
    bStatus = [
      { text: 'Online', value: '1' },
      { text: 'Offline', value: '2' },
      { text: 'Online khác site', value: '3' },
      { text: 'Online khác tỉnh', value: '4' },
    ]
    moment = (v) => moment(v)
  }
</script>

<style>
  /* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
