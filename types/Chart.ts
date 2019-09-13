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
  format: Function = v => v
  fill: boolean = false
}
