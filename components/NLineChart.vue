<template>
  <div style="position:relative">
    <canvas ref="linechart" :id="chartID" width="400" height="400"></canvas>
    <n-overlay absolute :value="vLoading">
      <div style="text-align:center; color:#fff">
        <n-icon class="fa-spin fa-2x fa-fw">circle-o-notch</n-icon>
        <div>Đang tải dữ liệu</div>
      </div>
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
    new Chart(ctx, {
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
    return children.map((child, index) => {
      const item: ChartSeries = {
        ...new ChartSeries(),
        ...{ backgroundColor: this.vDefaultColors[index], borderColor: this.vDefaultColors[index] },
        ...child.attrs
      }
      if (!_.isEmpty(item.value)) item.data = this.vItems.map(i => i[item.value])
      return this.mapSeriesToDataset(item)
    })
  }
  get options() {
    const optionsNode = this.vSlot.data.find(node => node.tag === 'options') || new VueNode()
    const legendNode = optionsNode.children.find(node => node.tag === 'legend') || new VueNode()
    const tooltipNode = optionsNode.children.find(node => node.tag === 'tooltip') || new VueNode()
    const axisesNode = optionsNode.children.find(node => node.tag === 'axises') || new VueNode()
    const xAxises = axisesNode.children
      .filter(node => node.tag === 'x-axis')
      .map(node => {
        return {
          ...{
            display: 'auto',
            scaleLabel: {
              display: !_.isEmpty(node.attrs.text),
              labelString: node.attrs.text
            }
          },
          ...node.attrs
        }
      })
    const yAxises = axisesNode.children
      .filter(node => node.tag === 'y-axis')
      .map(node => {
        return {
          ...{
            display: 'auto',
            scaleLabel: {
              display: !_.isEmpty(node.attrs.text),
              labelString: node.attrs.text
            }
          },
          ...node.attrs
        }
      })
    return {
      responsive: optionsNode.attrs.responsive || true,
      tooltips: { ...{ mode: 'index', intersect: false }, ...tooltipNode.attrs },
      legend: { ...{ position: 'bottom' }, ...legendNode.attrs },
      stacked: optionsNode.attrs.stacked || false,
      scales: {
        xAxes: xAxises,
        yAxes: yAxises
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
