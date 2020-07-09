<template>
  <div>
    <n-drop-down-table
      multiple
      read-url="./data/provinces.json"
      v-model="a"
      item-text="provinceName"
      item-value="provinceCode"
    >
    </n-drop-down-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "@namhoang/vue-property-decorator";
import provinces from "./data/provinces.json";
@Component({})
export default class VApp extends Vue {
  a: any[] = [];
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
