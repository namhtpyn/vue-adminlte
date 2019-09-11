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
    <div style="max-height:200px; overflow:auto">
      <n-data-table :items="provinces" updatable update-url="/haha" caption="hihi" searchable>
        <items>
          <text-item text="provinceName" value="provinceName"></text-item>
        </items>
        <template #modal="{modal}">
          <!-- <n-text-box v-model="modal.data.provinceName"></n-text-box> -->
        </template>
      </n-data-table>
    </div>
    n-modal component
    <n-btn @click="modal = !modal" color="primary">Toggle Modal</n-btn>
    <n-modal v-model="modal">
      <ul>
        <li v-for="i in 100" :key="i">{{ i }}</li>
      </ul>
    </n-modal>
    <br />
    n-select2 component
    <div>
      <n-text-box v-model="province"></n-text-box>
      <n-select2
        v-model="province"
        :items="provinces"
        item-text="provinceName"
        item-value="provinceCode"
        :rules="[v => !!v || 'abc']"
      ></n-select2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TableHeader } from '../types/Table'
import units from './data/units.json'
import provinces from './data/provinces.json'
@Component({})
export default class VApp extends Vue {
  units = units
  provinces = []
  unitID = 103
  modal = false
  province = 'PYN'
  mounted() {
    this.provinces = provinces
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
