import { useStrict, action, observable, runInAction } from "mobx";
import { asyncAction } from "mobx-utils";
useStrict(true);

class WeatherStore {
  @observable weatherData = {};

  loadWeather = city => {
    fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    )
      .then(response => response.json())
      .then(data => {
        this.setWeatherData(data);
      });
  };

  @action
  setWeatherData = data => {
    this.weatherData = data;
  };

  loadWeatherRunInThen = city => {
    fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    )
      .then(response => response.json())
      .then(data => {
        runInAction(() => {
          this.weatherData = data;
        });
      });
  };

  loadWeatherRunInAsync = async city => {
    const response = await fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    );
    const data = await response.json();

    runInAction(() => {
      this.weatherData = data;
    });
  };

  loadWeatherGenerator = asyncAction(function*(city) {
    const response = yield fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    );
    const data = yield response.json();
    this.weatherData = data;
  });
}

export default new WeatherStore();
