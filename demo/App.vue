<template>
  <div>
    <n-tabs :length="3">
      <template #header.1>hello</template>
      <template #body.1>hello</template>
      <template #header.2 v-if="false">hello1</template>
      <template #body.2 v-if="false">hello1</template>
    </n-tabs>
    <n-data-table ref="table" multiple read-url="./data/provinces.json" v-model="a">
      <items>
        <text-item value="provinceIDx" text="provinceIDx" editable></text-item>
        <text-item value="provinceID" text="provinceID" :validate="[v => v > 1050 || 'Error']" editable></text-item>
        <text-item value="provinceCode" text="provinceCode"></text-item>
        <text-item value="provinceName" text="provinceName"></text-item>
      </items>
    </n-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@namhoang/vue-property-decorator'
import provinces from './data/provinces.json'
@Component({})
export default class VApp extends Vue {
  a: any[] = []
  provinces: any[] = provinces
  provinceInit(props, layer) {
    layer.setTooltipContent(props.Name + 'abcdef')
    //layer.setStyle({ fillColor: '#cc0000' })
  }
  provinceClick(e) {
    alert(e.target.feature.properties.Id)
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
