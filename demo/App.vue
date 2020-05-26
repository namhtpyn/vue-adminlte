<template>
  <div>
    <n-vietnam-map
      style="height:500px"
      zoom-control
      :zoom="10"
      @province-init="provinceInit"
      @province-click="provinceClick"
    ></n-vietnam-map>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@namhoang/vue-property-decorator'
@Component({})
export default class VApp extends Vue {
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
