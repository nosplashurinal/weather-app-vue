import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import WeatherDataBlock from "@/components/WeatherDataBlock.vue";
import Search from "@/components/Search.vue";
import { weatherData, geocodingResult } from "./sampleJson";
import flushPromises from "flush-promises";
import axios from "axios";

jest.mock("axios");

describe("App.vue", () => {
  const wrapper = mount(App);
  const className = "searchByCity";
  const labelName = "Search by City";

  it("renders an input to accept user search query", () => {
    const input = wrapper.find(`input[name='${className}']`);
    expect(input.exists()).toBeTruthy();
  });
  it("renders a label called `Search by City`", () => {
    const input = wrapper.find(`input[placeholder='${labelName}']`);
    const label = wrapper.find("label");
    expect(input.exists() || label.text() === labelName).toBeTruthy();
  });
  it("displays weather data when a city is searched", async () => {
    const searchQuery = "Chennai";
    const wrapper = mount(Search);
    axios.get.mockImplementation(url => {
      switch (url) {
        case "https://api.openweathermap.org/data/2.5/onecall":
          axios.get.mockResolvedValue({ data: weatherData });
        case `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json`:
          axios.get.mockResolvedValue({ data: geocodingResult });
      }
    });
    const input = wrapper.find(`input[name='${className}']`);
    const button = wrapper.find(`.${className}Button`);
    await input.setValue(searchQuery);
    await button.trigger("click");
    await flushPromises();
    expect(wrapper.findComponent(WeatherDataBlock).text()).toBe(
      weatherData.current.temp
    );
  });
});
