<template>
  <div style="position:relative">
    <canvas ref="linechart" :id="chartID" :height="height"></canvas>
    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-2x fa-fw">circle-o-notch</n-icon>
        <div>Đang tải dữ liệu</div>
      </div>
    </n-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from '@namhoang/vue-property-decorator'
import _ from 'lodash'
import Chart from 'chart.js'
import { ChartSeries, ChartCommon } from '../types/Chart'
import NItems from './Base/NItems'
import camelcaseKeys from './Base/camelcaseKeys'
@Component({})
export default class NLineChart extends Mixins(NItems) {
  @Prop({ type: String, default: '' }) caption!: string
  @Prop({ type: Number, default: 100 }) height!: number
  chart: any
  vDefaultColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ]
  drawChart() {
    const ctx = this.$refs.linechart
    if (this.chart) this.chart.destroy()
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.common.data,
        datasets: this.series
      },
      options: this.options
    })
  }
  get chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 3,
      //hoverMode: 'index',
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      stacked: false,
      title: {
        display: !_.isEmpty(this.caption),
        text: this.caption
      }
    }
  }

  get common(): ChartCommon {
    const commonNode = this.$slots && this.$slots.default && this.$slots.default.find(node => node.tag === 'common')
    const common: ChartCommon = {
      ...new ChartCommon(),
      ...((commonNode && commonNode.data && camelcaseKeys(commonNode.data.attrs)) || {})
    }
    if (!_.isEmpty(common.value)) common.data = this.vItems.map(i => common.format(i[common.value]))
    return common
  }
  get series(): any[] {
    const seriesNode = this.$slots && this.$slots.default && this.$slots.default.find(node => node.tag === 'series')
    const children = ((seriesNode && seriesNode.children) || []).filter(node => node.tag === 'item')
    return children.map((child, index) => {
      const item: ChartSeries = {
        ...new ChartSeries(),
        ...{ backgroundColor: this.vDefaultColors[index], borderColor: this.vDefaultColors[index] },
        ...((child && child.data && camelcaseKeys(child.data.attrs)) || {})
      }
      if (!_.isEmpty(item.value)) item.data = this.vItems.map(i => i[item.value])
      return this.mapSeriesToDataset(item)
    })
  }
  get options() {
    const optionsNode = this.$slots && this.$slots.default && this.$slots.default.find(node => node.tag === 'options')
    const legendNode = optionsNode && optionsNode.children && optionsNode.children.find(node => node.tag === 'legend')
    const tooltipNode = optionsNode && optionsNode.children && optionsNode.children.find(node => node.tag === 'tooltip')
    console.log(tooltipNode)
    const axisesNode = optionsNode && optionsNode.children && optionsNode.children.find(node => node.tag === 'axises')
    const xAxises =
      axisesNode &&
      axisesNode.children &&
      axisesNode.children
        .filter(node => node.tag === 'x-axis')
        .map(node => {
          return {
            ...{
              display: 'auto',
              scaleLabel: {
                display: !_.isEmpty(node.data && node.data.attrs && node.data.attrs.text),
                labelString: node.data && node.data.attrs && node.data.attrs.text
              },
              ticks: { callback:  node.data && node.data.attrs && node.data.attrs.format || ((v) => v) }
            },
            ...((node.data && camelcaseKeys(node.data.attrs)) || {})
          }
        })
    const yAxises =
      axisesNode &&
      axisesNode.children &&
      axisesNode.children
        .filter(node => node.tag === 'y-axis')
        .map(node => {
          return {
            ...{
              display: 'auto',
              scaleLabel: {
                display: !_.isEmpty(node.data && node.data.attrs && node.data.attrs.text),
                labelString: node.data && node.data.attrs && node.data.attrs.text
              },
              ticks: { callback:  node.data && node.data.attrs && node.data.attrs.format || ((v) => v) }
            },
            ...((node.data && camelcaseKeys(node.data.attrs)) || {})
          }
        })
    return {
      responsive: (optionsNode && optionsNode.data && optionsNode.data.attrs && optionsNode.data.attrs.responsive) || true,
      tooltips: {
        ...{ mode: 'index', intersect: false, callbacks: { label: (item, data) => data.datasets[item.datasetIndex].format(item.value)} },
        ...((tooltipNode && tooltipNode.data && camelcaseKeys(tooltipNode.data.attrs)) || {})
      },
      legend: { ...{ position: 'bottom' }, ...((legendNode && legendNode.data && camelcaseKeys(legendNode.data.attrs)) || {}) },
      stacked: (optionsNode && optionsNode.data && optionsNode.data.attrs && optionsNode.data.attrs.stacked) || false,
      scales: {
        xAxes: xAxises || [],
        yAxes: yAxises || []
      },
      title: {
        display: !_.isEmpty(this.caption),
        text: this.caption
      }
    }
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
  }
  get chartID() {
    return _.uniqueId('n_line_chart_')
  }
}
</script>
