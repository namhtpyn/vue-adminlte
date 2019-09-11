<template>
  <div>
<<<<<<< HEAD
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
      <n-data-table :items="provinces" updatable update-url="/haha">
        <items>
          <text-item text="provinceName" value="provinceName"></text-item>
        </items>
        <template #modal="{modal}">
          <!-- <n-text-box v-model="modal.data.provinceName"></n-text-box> -->
        </template>
      </n-data-table>
    </div>
=======
    <!-- <n-tree :items="units" item-value="UnitID" item-text="UnitName" parent-key="ParentID" v-model="unitID" sticky-search></n-tree> -->
    <n-drop-down-tree
      :items="units"
      item-value="UnitID"
      item-text="UnitName"
      tree-parent-key="ParentID"
      :tree-expand-to-level="1"
      v-model="unitID"
      searchable
    ></n-drop-down-tree>
>>>>>>> 7fc25a36d29f76c5fc9dec0d7b03e89b7e6d0f50
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
  provinces = provinces
  unitID = 103
}
</script>

<style>
/* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
