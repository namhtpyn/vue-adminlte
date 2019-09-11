<template>
  <div>
    <n-tree :items="units" item-value="UnitID" item-text="UnitName" parent-key="ParentID" v-model="unitID" sticky-search></n-tree>
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
  unitID = -1
}
</script>

<style>
/* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
