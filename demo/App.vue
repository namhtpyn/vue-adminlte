<template>
  <div>
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
    <!-- <n-drop-down-tree
      read-url="/data/units.json"
      item-value="UnitID"
      item-text="UnitName"
      tree-parent-key="ParentID"
      :tree-expand-to-level="1"
      searchable
      sticky-search
      @select="selectNode"
      v-model="unitID"
    ></n-drop-down-tree>
    <n-drop-down-table read-url="/data/units.json" item-text="UnitName" item-value="UnitID" searchable>
      <items>
        <text-item text="UnitName" value="UnitName"></text-item>
      </items>
    </n-drop-down-table>
    <div style="max-height:100px; overflow:auto">
      <n-tree
        :items="units"
        item-value="UnitID"
        item-text="UnitName"
        parent-key="ParentID"
        v-model="unitID"
        sticky-search
        searchable
      ></n-tree>
    </div>
    n-data-table component
    <div style="max-height:400px; overflow:auto">
      {{ dataTableModel }}
      <n-data-table
        v-model="dataTableModel"
        read-url="/data/provinces.json"
        updatable
        update-url="/haha"
        caption="hihi"
        searchable
        selectable
        expandable
        row-select
        @row-click="console"
        key-field="provinceCode"
      >
        <items>
          <text-item text="provinceName" value="provinceName" sortable filterable></text-item>
          <text-item text="provinceCode" value="provinceCode" sortable filterable></text-item>
          <text-item text="areaID" value="areaID" sortable filterable></text-item>
        </items>
        <template #modal="{modal}">
          <n-text-box v-model="modal.data.provinceName"></n-text-box>
        </template>
        <template #item.expand="{item}">
          <n-btn>a</n-btn>
        </template>
      </n-data-table>
    </div>
    n-modal component<br />
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
      >
        <items>
          <text-item text="provinceID" value="provinceID"></text-item>
          <text-item text="provinceCode" value="provinceCode"></text-item>
          <text-item text="provinceName" value="provinceName"></text-item>
          <text-item text="areaID" value="areaID"></text-item>
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
    <div style="width:300px">
      <n-line-chart read-url="/data/traffics.json" caption="HAHAHA">
        <common value="Statisticdate"></common>
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
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TableHeader } from '../types/Table'
import units from './data/units.json'
import provinces from './data/provinces.json'
import traffics from './data/traffics.json'
// import _ from 'lodash'
@Component({})
export default class VApp extends Vue {
  deviceIP = null
  account = ''
  check = 1
  units = units
  provinces = provinces
  traffics = traffics
  unitID = 0
  modal = false
  dataTableModel: any = {}
  dropDownTableModel: any | any[] = ''
  checkboxModel: any[] = [2]
  radioModel: any = 2
  radioGroupModel: any = {}
  tabs = []
  console(...args) {
    console.log(args)
  }
  selectNode(item) {
    console.log(item)
  }
  mounted() {
    //this.tabs = ['1', '2', '3', '4', '5', '6']
    //this.$nextTick(() => (this.$refs.tabCollection as any).init())
  }
}
</script>

<style>
/* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
