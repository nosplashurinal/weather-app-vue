import { get } from "axios";
import { MAP_BOX_TOKEN } from "./constants/tokens";

export const getWeatherDataForCity = async coordinates => {
  const [lon, lat] = coordinates;
  try {
    const { data } = await get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely,alerts&appid=21352579031f021db7a3779caba706a9`
    );
    return data;
  } catch ({ message }) {
    throw message;
  }
};

export const getCoordinatesFromCityName = async searchQuery => {
  try {
    const { data } = await get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?limit=1&types=place&fuzzyMatch=false&autocomplete=false&access_token=${MAP_BOX_TOKEN}`
    );
    return {
      place: data.features[0].place_name,
      coordinates: data.features[0].geometry.coordinates
    };
  } catch ({ message }) {
    throw message;
  }
};
