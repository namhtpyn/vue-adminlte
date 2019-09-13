<template>
  <div>
    <canvas ref="linechart" :id="chartID" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import _ from 'lodash'
import Chart from 'chart.js'
import NDataSource from './Base/NDataSource'
@Component({})
export default class NLineChart extends Mixins(NDataSource) {
  @Prop({ type: String, default: '' }) caption!: string
  drawChart() {
    const ctx = this.$refs.linechart
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'line 1',
            data: this.ins,
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          },
          {
            label: 'line 2',
            data: this.outs,
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
          }
        ]
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
  get dates() {
    return this.vItems.map(o => o.Statisticdate)
  }
  get ins() {
    return this.vItems.map(o => o.trafficIN)
  }
  get outs() {
    return this.vItems.map(o => o.trafficOut)
  }
  mounted() {
    this.drawChart()
    console.log()
  }
  get chartID() {
    return _.uniqueId('n_line_chart_')
  }
}
</script>
