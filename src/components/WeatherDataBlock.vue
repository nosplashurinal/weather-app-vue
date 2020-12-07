<template>
  <div class="weather-data-block">
    <div class="city">{{ `${this.current.place}.` }}</div>
    <div class="main-block">
      <div class="body-block">
        <img
          class="icon-large"
          :src="`http://openweathermap.org/img/w/${this.current.icon}.png`"
          alt="weather_icon"
        />
        <span class="weather-info">
          <div class="description">
            {{ capitalizeFirstLetters(this.current.description) }}
          </div>
          <span class="temperature-block">
            <span v-if="isCelcius">{{ Math.floor(this.current.temp) }}</span>
            <span v-else>{{ celciusToFahrenheit(this.current.temp) }}</span>
            <span class="active">{{ `&deg;${isCelcius ? "C" : "F"}` }}</span>
            <i class="v-line"></i>
            <span v-on:click="toggleUnit()">{{
              `&deg;${isCelcius ? "F" : "C"}`
            }}</span>
          </span>
        </span>
      </div>
    </div>
    <ul class="forecast-block-container">
      <li
        class="forecast-block"
        v-for="item in fiveDayForecast"
        :key="item.date"
      >
        <span>{{ getNameOfDay(item.day) }}</span>
        <img
          class="weather-icon-small"
          :src="`http://openweathermap.org/img/w/${item.icon}.png`"
          alt="weather_icon"
        />
        <div class="temperature-forecast-block">
          <span v-if="isCelcius">{{ `${item.max}&deg;` }}</span>
          <span v-else>{{ `${celciusToFahrenheit(item.max)}&deg;` }}</span>
          <span v-if="isCelcius">{{ `${item.min}&deg;` }}</span>
          <span v-else>{{ `${celciusToFahrenheit(item.min)}&deg;` }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import days from "../utils/days";

export default {
  name: "WeatherDataBlock",
  data() {
    return {
      isCelcius: true,
    };
  },
  props: {
    current: {
      type: Object,
    },
    daily: {
      type: Array,
    },
  },
  computed: {
    fiveDayForecast: function() {
      return this.daily.filter((item, index) => index < 5);
    },
  },
  methods: {
    getNameOfDay(day) {
      return days[day];
    },
    celciusToFahrenheit(value) {
      return Math.floor((value * 9) / 5 + 32);
    },
    toggleUnit() {
      this.isCelcius = !this.isCelcius;
    },
    capitalizeFirstLetters(string) {
      return string
        .split(" ")
        .reduce(
          (string, item) =>
            string + " " + item.charAt(0).toUpperCase() + item.slice(1),
          ""
        );
    },
  },
};
</script>
<style lang="scss" src="@/styles/weatherDataBlock.scss"></style>
