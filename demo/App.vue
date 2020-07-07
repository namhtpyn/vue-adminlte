<template>
  <div>
    <n-data-table
      read-url="./data/provinces.json"
      creatable
      updatable
      searchable
    >
      <items>
        <text-item text="abc" value="provinceName"></text-item>
      </items>
      <template #modal="{data}">
        <n-text-box></n-text-box>
        <n-text-box></n-text-box>
        <n-text-box></n-text-box>
        <n-text-box></n-text-box>
      </template>
    </n-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "@namhoang/vue-property-decorator";
import provinces from "./data/provinces.json";
@Component({})
export default class VApp extends Vue {
  provinces: any[] = provinces;
  provinceInit(props, layer) {
    layer.setTooltipContent(props.Name + "abcdef");
    //layer.setStyle({ fillColor: '#cc0000' })
  }
  provinceClick(e) {
    alert(e.target.feature.properties.Id);
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
