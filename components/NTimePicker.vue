<template>
  <div style="width: 290px;">
    <div class="v-time-picker-clock__container">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({})
export default class NTimePicker extends Vue {}
</script>

<style>
.v-time-picker-clock__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.v-time-picker-clock__ampm {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 10px;
}
.v-time-picker-clock {
  border-radius: 100%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
  padding-top: 100%;
  flex: 1 0 auto;
}
.v-time-picker-clock__inner {
  position: absolute;
  bottom: 27px;
  left: 27px;
  right: 27px;
  top: 27px;
}
.v-time-picker-clock__hand {
  height: calc(50% - 4px);
  width: 2px;
  bottom: 50%;
  left: calc(50% - 1px);
  transform-origin: center bottom;
  position: absolute;
  will-change: transform;
  z-index: 1;
}
.v-time-picker-clock__item {
  align-items: center;
  border-radius: 100%;
  cursor: default;
  display: flex;
  font-size: 16px;
  justify-content: center;
  height: 40px;
  position: absolute;
  text-align: center;
  width: 40px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transform: translate(-50%, -50%);
}
</style>
