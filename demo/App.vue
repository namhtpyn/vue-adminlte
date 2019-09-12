<template>
  <div>
    n-tree component
    <div style="max-height:100px; overflow:auto">
      <n-tree
        :items="units"
        item-value="UnitID"
        item-text="UnitName"
        parent-key="ParentID"
        v-model="unitID"
        sticky-search
      ></n-tree>
    </div>
    n-data-table component
    <div style="max-height:100px; overflow:auto">
      <n-data-table v-model="dataTableModel" :items="provinces" updatable update-url="/haha" caption="hihi" searchable selectable>
        <items>
          <text-item text="provinceName" value="provinceName"></text-item>
        </items>
        <template #modal="{modal}">
          <!-- <n-text-box v-model="modal.data.provinceName"></n-text-box> -->
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
    <div style="width:200px">
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

    <n-date-picker></n-date-picker>
    {{ checkboxModel }}
    <n-checkbox
      v-model="checkboxModel"
      :value="{ provinceID: 1016, provinceCode: 'AGG', provinceName: 'An Giang', areaID: 2 }"
    ></n-checkbox>
    <n-checkbox
      v-model="checkboxModel"
      :value="{ provinceID: 1019, provinceCode: 'BDG', provinceName: 'Bình Dương', areaID: 2 }"
    ></n-checkbox>
    <div>
      {{ radioModel }}
      <n-radio v-model="radioModel" :value="1"></n-radio>
      <n-radio v-model="radioModel" :value="2"></n-radio>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TableHeader } from '../types/Table'
import units from './data/units.json'
import provinces from './data/provinces.json'
// import _ from 'lodash'
@Component({})
export default class VApp extends Vue {
  check = 1
  units = units
  provinces = provinces
  unitID = 103
  modal = false
  dataTableModel: any = {}
  dropDownTableModel: any | any[] = ''
  checkboxModel: any[] = []
  radioModel: any = {}
  radioGroupModel: any = {}
  console(...args) {
    console.log(args)
    console.log(this.checkboxModel)
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
