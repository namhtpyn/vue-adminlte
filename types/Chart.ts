export class ChartCommon {
  text: string = ''
  value: string = ''
  data: any[] = []
  format: Function = v => v
}
export class ChartSeries {
  text: string = ''
  value: string = ''
  data: any[] = []
  fill: boolean = false
  backgroundColor: string = 'rgba(0, 0, 0, 0.1)'
  borderColor: string = 'rgba(0, 0, 0, 0.1)'
}
