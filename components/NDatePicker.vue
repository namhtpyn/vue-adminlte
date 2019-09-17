<template>
  <div>
    <div>
      <!-- <div>{{ year }}</div>
      <div>{{ date }}</div> -->
      {{ date }}
    </div>
    <div>
      <button @click="goToPreviousMonth">Previous</button>
      <button @click="goToNextMonth">Next</button>
    </div>
    <div>
      <table class="n-date-picker--data-table">
        <thead>
          <tr>
            <th>Hai</th>
            <th>Ba</th>
            <th>Tư</th>
            <th>Năm</th>
            <th>Sáu</th>
            <th>Bảy</th>
            <th>CN</th>
          </tr>
        </thead>
        <tr v-for="week in weeksInMonths" :key="week">
          <td v-for="day in 7" :key="day">
            {{ getDay(week, day) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import moment from 'moment'
//import _ from 'lodash'
@Component({})
export default class NDatePicker extends Vue {
  currentDate = moment()
  date = moment().toDate()

  // get date() {
  //   return moment(this.currentDate).format('ddd, MMM DD')
  // }
  get lastDateOfMonth() {
    return moment(this.date).endOf('month')
  }
  get firstDateOfMonth() {
    return moment(this.date).startOf('month')
  }
  // get firstDateOfWeek() {
  //   return this.firstDateOfMonth.day(1)
  // }
  // get lastDateOfWeek() {
  //   return this.lastDateOfMonth.day(7)
  // }
  // get dateInMonths() {
  //   const days = []
  //   let day = this.firstDateOfWeek

  //   while (day <= this.lastDateOfWeek) {
  //     days.push(day.toDate())
  //     day = day.clone().add(1, 'd')
  //   }
  //   return days
  // }
  get firstWeekOfMonth() {
    return this.firstDateOfMonth.isoWeek()
  }
  get weeksInMonths() {
    return this.lastDateOfMonth.isoWeek() - this.firstDateOfMonth.isoWeek() + 1
  }

  getDay(week: number, day: number) {
    const date = moment()
      .set('week', this.firstWeekOfMonth + week - 1)
      .day(day)
    return date.get('month') === this.date.getMonth() ? date.date() : ''
  }

  goToPreviousMonth() {
    this.date = moment(this.date)
      .subtract(1, 'month')
      .toDate()
  }
  goToNextMonth() {
    this.date = moment(this.date)
      .add(1, 'month')
      .toDate()
  }
  created() {}
  mounted() {
    console.log(this.weeksInMonths)
  }
}
</script>
<style>
.n-date-picker--data-table td,
.n-date-picker--data-table th {
  width: 35px;
}
</style>
