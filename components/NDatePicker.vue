<template>
  <div class="n-date-picker">
    <div></div>
    <div class="n-date-picker--toolbar">
      <n-btn @click.stop="goToPreviousMonth" class="n-date-picker--button">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
      </n-btn>
      <div>{{ monthText }}</div>
      <n-btn @click.stop="goToNextMonth" class="n-date-picker--button">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
      </n-btn>
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
        <tr v-for="(week, weekIndex) in datesInMonth" :key="weekIndex">
          <td v-for="(day, dayIndex) in week" :key="dayIndex">
            <n-btn class="n-date-picker--date-button" :class="dateBtnClass(day)" v-if="!!day" @click.stop="dateSelected(day)">{{
              day.format('D')
            }}</n-btn>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, ModelVar } from '@namhoang/vue-property-decorator'
import moment, { Moment } from 'moment'
import _ from 'lodash'
//import _ from 'lodash'
@Component({})
export default class NDatePicker extends Vue {
  @ModelVar('input', 'value', { type: String }) vValue!: string
  vCurrentDate = moment().toDate()
  vDate = moment(this.vValue).toDate()

  get monthText() {
    return moment(this.vDate).format('MMMM YYYY')
  }
  get firstDateOfMonth() {
    return moment(this.vDate).startOf('month')
  }
  get datesInMonth() {
    const dates = _.range(0, 6).map(week =>
      _.range(0, 7).map(day => {
        const date = moment(this.firstDateOfMonth)
          .add(week, 'week')
          .startOf('isoWeek')
          .add(day, 'day')
        if (date.isSame(this.firstDateOfMonth, 'month')) return date
        return null
      })
    )
    return dates
  }
  goToPreviousMonth() {
    this.vDate = moment(this.vDate)
      .subtract(1, 'month')
      .toDate()
  }
  goToNextMonth() {
    this.vDate = moment(this.vDate)
      .add(1, 'month')
      .toDate()
  }
  dateBtnClass(date: Moment) {
    return {
      current: date.isSame(moment(this.vCurrentDate), 'day'),
      active: date.isSame(moment(this.vValue), 'day')
    }
  }
  dateSelected(date: Moment) {
    this.vValue = date.format('YYYY-MM-DD')
  }
}
</script>
<style>
.n-date-picker {
  width: 249px;
}
.n-date-picker--toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.n-date-picker--data-table td,
.n-date-picker--data-table th {
  width: 35px;
  text-align: center;
}
.n-date-picker--data-table .n-date-picker--date-button,
.n-date-picker--toolbar .n-date-picker--button {
  border-radius: 40px;
  font-size: 11px;
  width: 30px;
  height: 30px;
  padding: 8px 0px 0px 0px;
  text-align: center;
  margin-top: 1px;
  border: unset;
  background-color: transparent;
}
.n-date-picker--toolbar .n-date-picker--button {
  padding: 8px 0px 0px 0px;
}
.n-date-picker--data-table .n-date-picker--date-button:hover {
  background-color: #f4f4f4;
}
.n-date-picker--data-table .n-date-picker--date-button.active {
  background-color: #3c8dbc;
  color: #ffffff !important;
  font-weight: bold;
}
.n-date-picker--data-table .n-date-picker--date-button.current {
  box-shadow: inset 0px 0px 0px 1px #2489c0;
  color: #2489c0;
}
</style>
