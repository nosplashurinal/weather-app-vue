<template>
  <div class="root-container">
    <div class="bg" v-bind:style="{ backgroundImage: `url(${bg})` }"></div>
    <div class="overlay"></div>
    <div class="title">
      <span>weather</span>
      <span>in your city</span>
    </div>
    <div class="search-container" v-bind:class="{ resultActive: showResults }">
      <transition name="ease">
        <Search
          v-bind:showLoading="isLoadingResults"
          v-bind:isError="isError"
          v-on:on-key-press="onClickSearch"
          v-on:on-change="onInputChange"
        />
      </transition>
      <transition name="ease">
        <div class="results-container" v-if="showResults">
          <WeatherDataBlock v-bind="weatherData" />
        </div>
      </transition>
    </div>
    <div class="toaster">
      <transition name="ease">
        <div v-if="showToaster && loginSuccess">Login successful!</div>
        <div v-if="showToaster && registrationSuccess">
          Registration successful!
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Search from "./components/Search.vue";
import WeatherDataBlock from "./components/WeatherDataBlock.vue";
import { getWeatherDataForCity, getCoordinatesFromCityName } from "./apis";

export default {
  name: "app",
  components: {
    Search,
    WeatherDataBlock,
  },
  data() {
    return {
      results: [],
      showResults: false,
      isError: false,
      searchQuery: null,
      isLoadingResults: false,
      units: "metric",
      weatherData: undefined,
      bg: "https://s3.ap-south-1.amazonaws.com/excelanto/static/bg.jpg",
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      showToaster: false,
    };
  },
  watch: {
    async searchQuery() {
      this.showResults = false;
      this.isLoadingResults = true;
      this.fetchWeatherDataForCity(this.searchQuery);
    },
    weatherData() {
      this.isLoadingResults = false;
      this.showResults = true;
      this.changeBackgroundImage();
    },
  },
  methods: {
    timeDifferenceBetwenNowAndDate(d) {
      const date = new Date(d * 1000);
      const now = new Date();
      return (now.getTime() - date.getTime()) / (1000 * 60);
    },
    onInputChange() {
      if (this.isError) this.isError = false;
    },
    parseApiResponse({
      place,
      timezone_offset,
      current: { temp, dt, weather, humidity, wind_speed },
      daily,
    }) {
      const today = new Date().getDay();
      return {
        current: {
          place,
          temp,
          timezone_offset,
          icon: weather[0].icon,
          description: weather[0].description,
          date: dt,
          humidity,
          wind: wind_speed,
        },
        daily: daily.map(({ weather, temp: { min, max } }, index) => {
          return {
            day: (parseInt(today) + index) % 7,
            icon: weather[0].icon,
            min: Math.round(min),
            max: Math.round(max),
          };
        }),
      };
    },
    parseStoredWeatherData(data) {
      return {
        name: data.name,
        country: data.country,
        humidity: data.humidity,
        temp: data.temp,
        wind: data.wind,
        icon: data.icon,
        description: data.description,
        date: data.date,
      };
    },
    onClickSearch(e) {
      this.searchQuery = e;
    },
    async fetchWeatherDataForCity(searchQuery) {
      try {
        const { place, coordinates } = await getCoordinatesFromCityName(
          searchQuery
        );
        const weatherData = await getWeatherDataForCity(coordinates);
        const formattedData = this.parseApiResponse({
          ...weatherData,
          place,
        });
        this.weatherData = formattedData;
      } catch (e) {
        this.isLoadingResults = false;
        this.isError = true;
      }
    },
    changeBackgroundImage() {
      var newImg = new Image();
      newImg.onload = () => (this.bg = newImg.src);
      newImg.src = `https://loremflickr.com/1920/1080/${this.weatherData.description}`;
    },
  },
};
</script>

<style lang="scss" src="@/styles/app.scss"></style>
