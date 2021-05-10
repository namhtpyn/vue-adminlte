<template>
  <div>
    <table class="n-table table table-bordered table-hover">
      <thead class="bg-primary text-bold">
        <tr>
          <th v-for="(header, colIndex) in visibleHeaders" :key="colIndex">
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in vItems" :key="rowIndex" @click="(e) => rowClick(e, item)">
          <td v-for="(header, colIndex) in visibleHeaders" :key="colIndex">
            <template v-if="header.field === '__select'">
              <div @click="input(item)">OK</div>
            </template>
            <template v-else>{{ item[header.field] }}</template>
          </td>
        </tr>
      </tbody>
      <tfoot></tfoot>
    </table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Emit, Mixins, Model } from '@namhoang/vue-property-decorator'
  import NRadio from '../NRadio.vue'
  import NItems from '../Base/NItems'
  import _ from 'lodash'
  @Component({ inheritAttrs: false, components: { NRadio } })
  export default class NTableNTable extends Mixins(NItems) {
    //@Prop({ type: Array, default: undefined }) readonly items!: any[]
    @Prop({ type: Array, default: undefined }) readonly headers!: any[]
    @Prop({ type: Boolean, default: false }) readonly selectable!: any[]
    @Model('input', { type: Object, default: undefined }) readonly value!: any[]
    get visibleHeaders() {
      if (!Array.isArray(this.headers)) return []
      var headers = this.headers.slice()
      if (this.selectable) headers.unshift({ field: '__select' })
      var headers = headers.map((h) => ({ visible: true, field: '', text: '', ...h }))
      return headers
    }
    @Emit() input(v) {}
    @Emit() rowClick(e, item) {
      //console.log(e, item)
      this.input(item)
    }
    isChecked(item) {
      return _.isEqual(item, this.value)
    }
    get tableID() {
      return _.uniqueId('n_table_')
    }
  }
</script>

<style scoped>
  .n-table thead tr th {
  }
</style>
