<template>
  <div>
    <n-text-area v-model="textarea" :form="false" hide-error-text auto-grow></n-text-area>
    <n-select2 v-model="abc" :items="provinces" item-text="provinceName" item-value="provinceCode"></n-select2>
    <n-drop-down-table
      v-model="dropDownTableModel"
      read-url="/data/provinces.json"
      item-text="provinceName"
      item-value="provinceName"
      searchable
      multiple
    >
      <items>
        <text-item text="provinceID" value="provinceID"></text-item>
        <text-item text="provinceCode" value="provinceCode"></text-item>
        <text-item text="provinceName" value="provinceName"></text-item>
        <number-item text="areaID" value="areaID"></number-item>
      </items>
    </n-drop-down-table>
    <n-expandable-panel>
      <template #header.1>
        hihi
      </template>
      <template #body.1>
        ok
      </template>
    </n-expandable-panel>
    n-data-table component
    {{ dataTableModel }}
    <n-data-table
      v-model="dataTableModel"
      read-url="/data/provinces.json"
      updatable
      update-url="/haha"
      caption="hihi"
      searchable
      @row-click="console"
      key-field="provinceCode"
      creatable
      excelable
      multiple-sort
    >
      <css-class create-button="btn-primary"></css-class>

      <n-test></n-test>
      <items>
        <text-item text="provinceName" value="provinceName" sortable filterable></text-item>
        <text-item
          text="provinceCode"
          value="provinceCode"
          sortable
          filterable
          :format="v => provinces.find(i => i.provinceCode === v).provinceName"
        ></text-item>
        <text-item text="Tui Test" value="test" grouped></text-item>
        <text-item text="areaID" value="areaID" sortable filterable grouped></text-item>
        <band-item text="on shit">
          <items>
            <text-item text="provinceCode" value="provinceCode"></text-item>
            <text-item text="provinceName" value="provinceName"></text-item>
            <text-item text="areaID" value="areaID"></text-item>
            <band-item text="on shit">
              <items>
                <text-item text="provinceCode" value="provinceCode"></text-item>
                <text-item text="provinceName" value="provinceName"></text-item>
                <text-item text="areaID" value="areaID"></text-item
                ><band-item text="on shit">
                  <items>
                    <text-item text="provinceCode" value="provinceCode"></text-item>
                    <text-item text="provinceName" value="provinceName"></text-item>
                    <text-item text="areaID" value="areaID"></text-item>
                  </items>
                </band-item>
              </items>
            </band-item>
          </items>
        </band-item>
      </items>
      <template #item.expand="{item}">
        <n-btn>a</n-btn>
      </template>
      <template #modal="modal">
        <div class="row">
          <div class="col-xs-12">
            <n-drop-down-date-picker v-model="today"></n-drop-down-date-picker>
          </div>
        </div>

        <n-drop-down-table
          v-model="dropDownTableModel"
          read-url="/data/provinces.json"
          item-text="provinceName"
          item-value="provinceName"
          searchable
          multiple
        >
          <items>
            <text-item text="provinceID" value="provinceID"></text-item>
            <text-item text="provinceCode" value="provinceCode"></text-item>
            <text-item text="provinceName" value="provinceName"></text-item>
            <number-item text="areaID" value="areaID"></number-item>
          </items>
        </n-drop-down-table>
      </template>
    </n-data-table>
    <n-btn @click="modal = !modal">AAA</n-btn>
    <n-modal v-model="modal" scrollable>
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
      b<br />
    </n-modal>
    <!--
    <n-select2 label="Trạng thái" :items="spuStatuses">
      <template #result>
        <n-icon>#icon#</n-icon> #text#
      </template>
    </n-select2>
    <n-select2 label="Trạng thái" :items="spuStatuses"> </n-select2> -->
    <!-- <n-modal v-model="modal" scrollable>
      <div class="col-xs-6">
        <n-select2 label="Trạng thái" :items="spuStatuses">
          <template #result>
            <n-icon>#icon#</n-icon> #text#
          </template>
        </n-select2>
      </div>
    </n-modal> -->
    <n-tab-collection>
      <n-tab title="abc" active>abc</n-tab>
      <n-tab title="def">def</n-tab>
    </n-tab-collection>
    <!-- <n-drop-down-time-picker v-model="timepicker"></n-drop-down-time-picker>
    <n-drop-down-date-picker v-model="date"></n-drop-down-date-picker>
    <n-time-picker v-model="timepicker" hide-second :step-hour="2" :step-minute="15"></n-time-picker>
    <n-drop-down-table
      v-model="dropDownTableModel"
      read-url="/data/provinces.json"
      item-text="provinceName"
      item-value="provinceCode"
      searchable
    >
      <items>
        <text-item text="provinceID" value="provinceID"></text-item>
        <text-item text="provinceCode" value="provinceCode"></text-item>
        <text-item text="provinceName" value="provinceName"></text-item>
        <number-item text="areaID" value="areaID"></number-item>
      </items>
    </n-drop-down-table> -->
    <!--
    <n-form ref="form2" lazy-validation>
      <div class="row">
        <div class="col-xs-4">
          <n-drop-down-tree
            v-model="unitID"
            label="Đơn vị"
            searchable
            read-url="/data/units.json"
            item-value="UnitID"
            item-text="UnitName"
            tree-parent-key="ParentID"
            :tree-expand-to-level="1"
            :rules="[v => !!v || 'abc']"
          ></n-drop-down-tree>
        </div>
        <div class="col-xs-3">
          <n-drop-down-table
            v-model="deviceIP"
            label="Thiết bị"
            item-text="SystemName"
            item-value="IpAddress"
            :rules="[v => !!v || 'abc']"
          >
            <items>
              <text-item text="Tên hệ thống" value="SystemName"></text-item>
              <text-item text="Loại" value="ProductCode"></text-item>
              <text-item text="Trạm" value="BuildingName"></text-item>
              <text-item text="Địa chỉ IP" value="IpAddress"></text-item>
              <text-item text="Ghi chú" value="Note"></text-item>
            </items>
          </n-drop-down-table>
        </div>
      </div>
    </n-form>
    <n-drop-down-tree
      :items="units"
      item-value="UnitID"
      item-text="UnitName"
      tree-parent-key="ParentID"
      :tree-expand-to-level="1"
      searchable
      sticky-search
      @select="selectNode"
      v-model="unitID"
    ></n-drop-down-tree>
    <n-tree
      :items="units"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      v-model="unitID"
      sticky-search
      searchable
    ></n-tree> -->

    <!-- n-modal component<br />
    <div class="row">
      <div class="col-xs-1">
        <n-btn @click="modal = !modal" color="primary">Toggle Modalsssssssssssssssssssssssssssssssssssssss</n-btn>
      </div>
    </div>
    <n-modal v-model="modal">
      <ul>
        <li v-for="i in 100" :key="i">{{ i }}</li>
      </ul>
    </n-modal>

    n-drop-down-table component<br />
    {{ dropDownTableModel }}
    <div style="width:400px">
      <n-drop-down-table
        v-model="dropDownTableModel"
        read-url="/data/provinces.json"
        item-text="provinceName"
        item-value="provinceName"
        searchable
        multiple
      >
        <items>
          <text-item text="provinceID" value="provinceID"></text-item>
          <text-item text="provinceCode" value="provinceCode"></text-item>
          <text-item text="provinceName" value="provinceName"></text-item>
          <number-item text="areaID" value="areaID"></number-item>
        </items>
      </n-drop-down-table>
    </div>

    {{ checkboxModel }}
    <n-checkbox v-model="checkboxModel" :value="1"></n-checkbox>
    <n-checkbox v-model="checkboxModel" disabled :value="2"></n-checkbox>
    <div>
      {{ radioModel }}
      <n-radio v-model="radioModel" :value="1"></n-radio>
      <n-radio v-model="radioModel" disabled :value="2"></n-radio>
      <n-radio v-model="radioModel" :value="3"></n-radio>
    </div>
    <div>
      {{ radioGroupModel }}
      <n-radio-group v-model="radioGroupModel">
        <n-radio :value="1"></n-radio>
        <n-radio :value="2"></n-radio>
        <n-radio :value="3"></n-radio>
      </n-radio-group>
    </div>

    <n-form ref="form" lazy-validation>
      <div>
        <n-text-box :rules="[v => !!v | 'required']"></n-text-box>
      </div>
    </n-form>
    <n-line-chart read-url="/data/traffics.json" caption="HAHAHA">
      <common value="Statisticdate" :format="v => 'aaa'"></common>
      <series>
        <item text="In" value="trafficIN" y-axis-i-d="first"></item>
        <item text="Out" value="trafficOut" y-axis-i-d="second"></item>
      </series>
      <options>
        <axises>
          <x-axis text="Thời gian"></x-axis>
          <y-axis id="first" position="left" text="Tốc độ upload (mpbs)"></y-axis>
          <y-axis id="second" position="right" text="Tốc độ download (mpbs)"></y-axis>
        </axises>
      </options>
    </n-line-chart>
    {{ date }}
    <n-date-picker v-model="date"></n-date-picker>
    <n-drop-down-date-picker v-model="date"></n-drop-down-date-picker>
    {{ abc }}
    <n-select2 v-model="abc" multiple :items="provinces" item-text="provinceName" item-value="provinceCode"></n-select2> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TableHeader } from '../types/Table'
import units from './data/units.json'
import provinces from './data/provinces.json'
import traffics from './data/traffics.json'
import moment = require('moment')
@Component({})
export default class VApp extends Vue {
  textarea = null
  modal = false
  spuStatuses = [
    { text: 'Khởi tạo', value: 0, icon: 'wrench' },
    { text: 'Hoạt động', value: 1, icon: 'check-circle' },
    { text: 'Tạm ngưng', value: 2, icon: 'times-circle' }
  ]
  today = '2019-09-27'
  timepicker = '14:21:30'
  abc = ['PYN', 'HNI']
  date = moment().format('YYYY-MM-DD')
  deviceIP = null
  account = ''
  check = 1
  units = units
  provinces = provinces
  traffics = traffics
  unitID = 0
  dataTableModel: any = []
  dropDownTableModel: any | any[] = 'PYN'
  checkboxModel: any[] = [2]
  radioModel: any = 2
  radioGroupModel: any = {}
  tabs = []
  console(...args) {
    //console.log(args)
  }
  selectNode(item) {
    //console.log(item)
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
