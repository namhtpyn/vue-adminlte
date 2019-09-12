<template>
  <div>
    <canvas ref="linechart" :id="chartID" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import _ from 'lodash'
import Chart from 'chart.js'
@Component({})
export default class NLineChart extends Vue {
  @Prop({ type: String, default: '' }) caption!: string
  drawChart() {
    const ctx = this.$refs.linechart
    new Chart(ctx, {
      type: 'line',
      data: {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'line 1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          },
          {
            label: 'line 2',
            data: [3, 6, 1, 8, 3, 7, 6],
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
  mounted() {
    this.drawChart()
  }
  get chartID() {
    return _.uniqueId('n_line_chart_')
  }
}
</script>
