<template>
  <div>
    <div>
      <div>{{ year }}</div>
      <div>{{ date }}</div>
    </div>
    <div>{{ lastDateOfMonth }}</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import moment from 'moment'
import _ from 'lodash'
@Component({})
export default class NDatePicker extends Vue {
  currentDate: Date = new Date()
  get year() {
    return this.currentDate.getFullYear()
  }
  get date() {
    return moment(this.currentDate).format('ddd, MMM DD')
  }
  get lastDateOfMonth() {
    return _.range(
      1,
      moment(this.currentDate)
        .endOf('month')
        .date() + 1
    )
  }
}
</script>
