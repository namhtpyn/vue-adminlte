<template>
  <div>
    <n-drop-down-tree
      read-url="https://localhost:5001/vnptunit/GetUnitListByID?unitID=1"
      item-value="UnitID"
      item-text="UnitName"
      tree-parent-key="ParentID"
      :tree-expand-to-level="1"
      searchable
      sticky-search
      @select="selectNode"
      v-model="unitID"
    ></n-drop-down-tree>
    <!-- <n-drop-down-table read-url="https://localhost:5001/vnptunit/GetUnitListByID" item-text="UnitName" item-value="UnitID">
      <items>
        <text-item text="UnitName" value="UnitName"></text-item>
      </items>
    </n-drop-down-table> -->
    <!-- <div style="max-height:100px; overflow:auto">
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
      <n-data-table
        v-model="dataTableModel"
        :items="provinces"
        updatable
        update-url="/haha"
        caption="hihi"
        searchable
        selectable
        expandable
      >
        <items>
          <text-item text="provinceName" value="provinceName"></text-item>
        </items>
        <template #modal="{modal}">
          <n-text-box v-model="modal.data.provinceName"></n-text-box>
        </template>
        <template #item.expand="{item}">
          {{ item }}
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
        :items="provinces"
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
      <n-text-box :rules="[v => !!v | 'required']"></n-text-box>
    </n-form>
    <div style="width:300px">
      <n-line-chart read-url="http://localhost:3001/home/traffics" caption="HAHAHA">
        <common text="In" value="Statisticdate"></common>
        <series>
          <item text="In" value="trafficIN"></item>
          <item text="Out" value="trafficOut"></item>
        </series>
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
  check = 1
  units = units
  provinces = provinces
  traffics = traffics
  unitID = 9
  modal = false
  dataTableModel: any = {}
  dropDownTableModel: any | any[] = ''
  checkboxModel: any[] = [2]
  radioModel: any = 2
  radioGroupModel: any = {}
  tabs = []
  console(...args) {
    console.log(args)
    console.log(this.checkboxModel)
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
