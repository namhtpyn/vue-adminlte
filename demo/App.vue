<template>
  <div>
    {{ model }}
    <n-drop-down-table
      v-model="model"
      searchable
      item-text="MANAGER_IP"
      item-value="MANAGER_IP"
      read-url="./data/test.json"
      paging
    >
      <items>
        <text-item value="MANAGER_IP" text="MANAGER_IP"></text-item>
        <text-item value="SYSTEM_NAME" text="SYSTEM_NAME"></text-item>
      </items>
    </n-drop-down-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from '@namhoang/vue-property-decorator'
  import NDataTable from '../components/NDataTable/NDataTable.vue'
  import moment from 'moment'
  @Component({ components: { NDataTable } })
  export default class VApp extends Vue {
    model = ''
  }
</script>

<style>
  /* #app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
} */
</style>
