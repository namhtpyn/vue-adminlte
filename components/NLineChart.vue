<template>
  <div style="position:relative">
    <canvas ref="linechart" :id="chartID" width="400" height="400"></canvas>
    <n-overlay absolute :value="vLoading">
      <n-icon css-class="fa-spin fa-4x" style="color:white">circle-o-notch</n-icon>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import Chart from 'chart.js'
import NDataSource from './Base/NDataSource'
import { VueNode } from '../extension/VueSlot'
import { ChartSeries, ChartCommon } from '../types/Chart'
@Component({})
export default class NLineChart extends Mixins(NDataSource) {
  @Prop({ type: String, default: '' }) caption!: string
  drawChart() {
    const ctx = this.$refs.linechart
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.common.data,
        datasets: this.series
      },
      options: this.chartOptions
    })
  }
  get chartOptions() {
    return {
      title: {
        display: !_.isEmpty(this.caption),
        text: this.caption
      }
    }
  }

  get common(): ChartCommon {
    if (_.isEmpty(this.vSlot.data)) return new ChartCommon()
    const commonNode = this.vSlot.data.find(node => node.tag === 'common') || new VueNode()
    const common: ChartCommon = { ...new ChartCommon(), ...commonNode.attrs }
    if (!_.isEmpty(common.value)) common.data = this.vItems.map(i => common.format(i[common.value]))
    return common
  }
  get series(): any[] {
    if (_.isEmpty(this.vSlot.data)) return []
    const seriesNode = this.vSlot.data.find(node => node.tag === 'series') || new VueNode()
    const children = (seriesNode.children || []).filter(node => node.tag === 'item')
    return children
      .map(child => {
        const item: ChartSeries = { ...new ChartSeries(), ...child.attrs }
        if (!_.isEmpty(item.value)) item.data = this.vItems.map(i => item.format(i[item.value]))
        return item
      })
      .map(this.mapSeriesToDataset)
  }

  //https://www.chartjs.org/docs/latest/charts/line.html
  mapSeriesToDataset(item: ChartSeries) {
    return {
      ...item,
      label: item.text
    }
  }
  @Watch('vItems')
  onItemsChanged() {
    this.drawChart()
  }
  mounted() {
    this.drawChart()
    console.log('')
  }
  get chartID() {
    return _.uniqueId('n_line_chart_')
  }
}
</script>
