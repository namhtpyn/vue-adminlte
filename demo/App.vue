<template>
  <div>
    <n-data-table>
      <items>
        <band-item text="wtf">
          <items>
            <text-item text="OK"></text-item>
          </items>
        </band-item>
        <band-item text="wtf">
          <items>
            <band-item text="wtf">
              <items>
                <text-item text="OK"></text-item>
              </items>
            </band-item>
          </items>
        </band-item>
      </items>
    </n-data-table>
    <!-- <n-data-table
      ref="table"
      read-url="/data/provinces.json"
      updatable
      update-url="/haha"
      caption="hihi"
      searchable
      key-field="provinceCode"
      creatable
      excelable
      multiple-sort
      @readed="input"
      expandable
    >
      <css-class create-button="btn-primary"></css-class>

      <items>
        <text-item text="provinceName" value="provinceName" sortable filterable></text-item>
        <text-item
          text="provinceCode"
          value="provinceCode"
          sortable
          filterable
          :format="v => provinces.find(i => i.provinceCode === v).provinceName"
        ></text-item>
        <text-item text="Tui Test" value="test" merged></text-item>
        <text-item text="areaID" value="areaID" merged></text-item>
        <band-item text="on shit">
          <items>
            <text-item text="provinceCode" value="provinceCode"></text-item>
            <text-item text="provinceName" value="provinceName"></text-item>
            <band-item text="on shit">
              <items>
                <text-item text="provinceCode" value="provinceCode"></text-item>
                <text-item text="provinceName" value="provinceName"></text-item>
                ><band-item text="on shit">
                  <items>
                    <text-item text="provinceCode" value="provinceCode"></text-item>
                    <text-item text="provinceName" value="provinceName"></text-item>
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
      <template #item.province-name="{item}">
        aaaaaa
      </template>
      <template #modal="modal"> </template>
    </n-data-table> -->
    <!-- <n-line-chart :items="traffics" caption="HAHAHA">
      <common text="In" value="Statisticdate"></common>
      <series>
        <item text="In" value="trafficIN"></item>
        <item text="Out" value="trafficOut"></item>
      </series>
    </n-line-chart>
    <n-date-picker></n-date-picker>
    n-data-table component
    <n-data-table
      read-url="/data/provinces.json"
      updatable
      update-url="/haha"
      caption="hihi"
      searchable
      key-field="provinceCode"
      creatable
      excelable
      multiple-sort
      @readed="input"
    >
      <css-class create-button="btn-primary"></css-class>

      <items>
        <text-item text="provinceName" value="provinceName" sortable filterable></text-item>
        <text-item
          text="provinceCode"
          value="provinceCode"
          sortable
          filterable
          :format="v => provinces.find(i => i.provinceCode === v).provinceName"
        ></text-item>
        <text-item text="Tui Test" value="test" merged></text-item>
        <text-item text="areaID" value="areaID" merged></text-item>
        <band-item text="on shit">
          <items>
            <text-item text="provinceCode" value="provinceCode"></text-item>
            <text-item text="provinceName" value="provinceName"></text-item>
            <band-item text="on shit">
              <items>
                <text-item text="provinceCode" value="provinceCode"></text-item>
                <text-item text="provinceName" value="provinceName"></text-item>
                ><band-item text="on shit">
                  <items>
                    <text-item text="provinceCode" value="provinceCode"></text-item>
                    <text-item text="provinceName" value="provinceName"></text-item>
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
      <template #modal="modal"> </template>
    </n-data-table> -->

    <n-drop-down-tree
      :items="units"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      sticky-search
      searchable
    ></n-drop-down-tree>
    <!-- <n-btn>AAA</n-btn>
    {{ checkboxModel }}
    <n-checkbox v-model="checkboxModel" :value="1"></n-checkbox>
    <n-checkbox v-model="checkboxModel" :value="2"></n-checkbox>
    <n-date-picker v-model="datepickerModel"></n-date-picker>
    <n-drop-down-list></n-drop-down-list>
    <n-drop-down-date-picker v-model="datepickerModel"></n-drop-down-date-picker>

    <n-drop-down-time-picker v-model="timepickerModel"></n-drop-down-time-picker>
    <n-text-box></n-text-box>
    <n-text-area auto-grow @input="input"></n-text-area>
    <n-select :items="provinces" item-text="provinceName" item-value="provinceCode"></n-select>
    <n-drop-down-tree
      :items="units"
      item-value="UnitID"
      item-text="UnitName"
      parent-key="ParentID"
      sticky-search
      searchable
    ></n-drop-down-tree>
    <n-expandable-panel :length="3">
      <template #header.1="">
        aaa
      </template>
      <template #body.1="">
        aaaaaaa
      </template>
    </n-expandable-panel>
    <n-tab-collection>
      <n-tab title="hihi">
        oh shit
      </n-tab>
      <n-tab title="hihi" active>
        oh shit2
      </n-tab>
      <n-tab title="hihi">
        oh shit3
      </n-tab>
    </n-tab-collection>
    <n-radio-group v-model="radioModel" @input="input">
      <n-radio :value="1"></n-radio>
      <n-radio :value="2"></n-radio>
    </n-radio-group>
    <n-pagination :length="10"></n-pagination>
    <n-select2 @input="input" :items="provinces" item-text="provinceName" item-value="provinceCode"></n-select2> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@namhoang/vue-property-decorator'
import units from './data/units.json'
import provinces from './data/provinces.json'
import traffics from './data/traffics.json'
@Component({})
export default class VApp extends Vue {
  checkboxModel: number[] = [1]
  radioModel = 2
  datepickerModel: string = '2019-10-10'
  timepickerModel: Date = new Date()
  provinces = provinces
  units = units
  traffics = traffics
  input(e) {
    console.log(e)
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
