<template>
  <div>
    <n-tree :items="data" parent-key="CONTAINEDIN" item-value="ENTINDEX" item-text="NAME"></n-tree>
    <!-- <n-select
      v-model="type"
      :items="[
        { text: '1', value: 1 },
        { text: '2', value: 2 }
      ]"
    ></n-select>
    <n-data-table :selectable="type == 1" multiple-select ref="table" multiple :read-url="readUrl" v-model="a">
      <items>
        <text-item value="provinceIDx" text="provinceIDx" editable></text-item>
        <text-item value="provinceID" text="provinceID" :validate="[v => v > 1050 || 'Error']" editable></text-item>
        <text-item value="provinceCode" text="provinceCode"></text-item>
        <text-item value="provinceName" text="provinceName"></text-item>
      </items>
    </n-data-table> -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from '@namhoang/vue-property-decorator'
  import provinces from './data/provinces.json'
  import records from './data/entityphysical.json'
  @Component({})
  export default class VApp extends Vue {
    a = provinces
    type = 1
    classType = {
      1: 'other',
      2: 'unknown',
      3: 'chassis',
      4: 'backplane',
      5: 'container',
      6: 'powerSupply',
      7: 'fan',
      8: 'sensor',
      9: 'module',
      10: 'port',
      11: 'stack',
      12: 'cpu',
    }
    data = records.recordset.map(o => ({ ...o, NAME: `${o.NAME} - ENTINDEX: ${o.ENTINDEX} - type: ${this.classType[o.CLASS]}` }))
    get readUrl() {
      return './data/provinces.json?type' + this.type
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
