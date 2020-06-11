<template>
  <div style="height:200px; display:flex">
    <div v-if="!hideHour" style="width:90px; text-align:center; flex-direction: column; display:flex">
      <div>Giờ</div>
      <div class="n-time-picker--hour" style="overflow:auto;">
        <div
          class="n-time-picker--item"
          :class="{ active: v === hour }"
          v-for="v in hours"
          :key="v"
          :data-id="v"
          @click="setHour(v)"
        >
          {{ v }}
        </div>
      </div>
    </div>
    <div v-if="!hideMinute" style="width:90px; text-align:center; flex-direction: column; display:flex">
      <div>Phút</div>
      <div class="n-time-picker--minute" style="overflow:auto;">
        <div
          class="n-time-picker--item"
          :class="{ active: v === minute }"
          v-for="v in minutes"
          :key="v"
          :data-id="v"
          @click="setMinute(v)"
        >
          {{ v }}
        </div>
      </div>
    </div>
    <div v-if="!hideSecond" style="width:90px; text-align:center; flex-direction: column; display:flex">
      <div>Giây</div>
      <div class="n-time-picker--second" style="overflow:auto;">
        <div
          class="n-time-picker--item"
          :class="{ active: v === second }"
          v-for="v in seconds"
          :key="v"
          :data-id="v"
          @click="setSecond(v)"
        >
          {{ v }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, ModelVar, Vue } from '@namhoang/vue-property-decorator'
import moment from 'moment'
import _ from 'lodash'
@Component({})
export default class NTimePicker extends Vue {
  @ModelVar('input', 'value', { type: [Date, String] }) vValue!: Date | string
  @Prop({ type: Number, default: 1 }) stepHour!: number
  @Prop({ type: Number, default: 1 }) stepMinute!: number
  @Prop({ type: Number, default: 1 }) stepSecond!: number
  @Prop({ type: Boolean, default: false }) hideSecond!: number
  @Prop({ type: Boolean, default: false }) hideMinute!: number
  @Prop({ type: Boolean, default: false }) hideHour!: number

  get hour() {
    return moment(this.vValue).get('hour')
  }
  get minute() {
    return moment(this.vValue).get('minute')
  }
  get second() {
    return moment(this.vValue).get('second')
  }
  hours = _.range(0, 24, this.stepHour)
  minutes = _.range(0, 60, this.stepMinute)
  seconds = _.range(0, 60, this.stepSecond)
  mounted() {
    this.scrollIntoViewIfNeeded()
  }
  scrollIntoViewIfNeeded() {
    try {
      ;(this.$el as any)
        .querySelector('.n-time-picker--hour')
        .querySelector(`.n-time-picker--item[data-id="${this.hour}"]`)
        .scrollIntoViewIfNeeded()
      ;(this.$el as any)
        .querySelector('.n-time-picker--minute')
        .querySelector(`.n-time-picker--item[data-id="${this.minute}"]`)
        .scrollIntoViewIfNeeded()
      ;(this.$el as any)
        .querySelector('.n-time-picker--second')
        .querySelector(`.n-time-picker--item[data-id="${this.second}"]`)
        .scrollIntoViewIfNeeded()
      // eslint-disable-next-line no-empty
    } catch {}
  }

  toTime(h: number, m: number, s: number) {
    const result = moment().startOf('day')
    if (!this.hideHour) result.add(h, 'hour')
    if (!this.hideMinute) result.add(m, 'minute')
    if (!this.hideSecond) result.add(s, 'second')
    return result.toDate().toISOString()
  }
  setHour(h) {
    this.vValue = this.toTime(h, this.minute, this.second)
  }
  setMinute(m) {
    this.vValue = this.toTime(this.hour, m, this.second)
  }
  setSecond(s) {
    this.vValue = this.toTime(this.hour, this.minute, s)
  }
}
</script>

<style>
.n-time-picker--item {
  cursor: pointer;
}
.n-time-picker--item:hover {
  background-color: rgb(230, 230, 230);
}
.n-time-picker--item.active {
  background-color: rgb(206, 206, 206);
}
</style>
