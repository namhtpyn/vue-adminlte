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
    <!-- <div class="v-time-picker-clock__container">
      <div class="v-time-picker-clock__ampm primary--text">
        <div class="v-picker__title__btn v-picker__title__btn--active">AM</div>
        <div class="v-picker__title__btn">PM</div>
      </div>
      <div class="v-time-picker-clock theme--light">
        <div class="v-time-picker-clock__inner">
          <div class="v-time-picker-clock__hand accent" style="transform: rotate(90deg) scaleY(1);"></div>
          <span class="v-time-picker-clock__item" style="left: 50%; top: 0%;"><span>12</span></span
          ><span class="v-time-picker-clock__item" style="left: 75%; top: 6.69873%;"><span>1</span></span
          ><span class="v-time-picker-clock__item" style="left: 93.3013%; top: 25%;"><span>2</span></span
          ><span class="v-time-picker-clock__item v-time-picker-clock__item--active accent" style="left: 100%; top: 50%;"
            ><span>3</span></span
          ><span class="v-time-picker-clock__item" style="left: 93.3013%; top: 75%;"><span>4</span></span
          ><span class="v-time-picker-clock__item" style="left: 75%; top: 93.3013%;"><span>5</span></span
          ><span class="v-time-picker-clock__item" style="left: 50%; top: 100%;"><span>6</span></span
          ><span class="v-time-picker-clock__item" style="left: 25%; top: 93.3013%;"><span>7</span></span
          ><span class="v-time-picker-clock__item" style="left: 6.69873%; top: 75%;"><span>8</span></span
          ><span class="v-time-picker-clock__item" style="left: 0%; top: 50%;"><span>9</span></span
          ><span class="v-time-picker-clock__item" style="left: 6.69873%; top: 25%;"><span>10</span></span
          ><span class="v-time-picker-clock__item" style="left: 25%; top: 6.69873%;"><span>11</span></span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Mixins } from 'vue-property-decorator'
import moment from 'moment'
import _ from 'lodash'
import NBase from './Base/NBase'
@Component({})
export default class NTimePicker extends Mixins(NBase) {
  @Model('input', { type: Date, required: true }) value!: Date
  @Prop({ type: Number, default: 1 }) stepHour!: number
  @Prop({ type: Number, default: 1 }) stepMinute!: number
  @Prop({ type: Number, default: 1 }) stepSecond!: number
  @Prop({ type: Boolean, default: false }) hideSecond!: number
  @Prop({ type: Boolean, default: false }) hideMinute!: number
  @Prop({ type: Boolean, default: false }) hideHour!: number

  get hour() {
    return moment(this.value).get('hour')
  }
  get minute() {
    return moment(this.value).get('minute')
  }
  get second() {
    return moment(this.value).get('second')
  }
  hours = _.range(0, 24, this.stepHour)
  minutes = _.range(0, 60, this.stepMinute)
  seconds = _.range(0, 60, this.stepSecond)
  mounted() {
    try {
      this.$el
        .querySelector('.n-time-picker--hour')
        .querySelector(`.n-time-picker--item[data-id="${this.hour}"]`)
        .scrollIntoView()
      this.$el
        .querySelector('.n-time-picker--minute')
        .querySelector(`.n-time-picker--item[data-id="${this.minute}"]`)
        .scrollIntoView()
      this.$el
        .querySelector('.n-time-picker--second')
        .querySelector(`.n-time-picker--item[data-id="${this.second}"]`)
        .scrollIntoView()
      // eslint-disable-next-line no-empty
    } catch {}
  }

  toTime(h: number, m: number, s: number) {
    const result = moment().startOf('day')
    if (!this.hideHour) result.add(h, 'hour')
    if (!this.hideMinute) result.add(m, 'minute')
    if (!this.hideSecond) result.add(s, 'second')
    return result.toDate()
  }
  setHour(h) {
    this.input(this.toTime(h, this.minute, this.second))
  }
  setMinute(m) {
    this.input(this.toTime(this.hour, m, this.second))
  }
  setSecond(s) {
    this.input(this.toTime(this.hour, this.minute, s))
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
