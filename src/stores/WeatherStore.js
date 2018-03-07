import {
  configure,
  action,
  observable,
  runInAction,
  flow,
  decorate
} from "mobx";

// this is now `flow` from mobx
// import { asyncAction } from "mobx-utils";

// removed as of MobX 4
// useStrict(true);
configure({ enforceActions: true });

class WeatherStore {
  weatherData = {};

  loadWeather = city => {
    fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    )
      .then(response => response.json())
      .then(data => {
        this.setWeatherData(data);
      });
  };

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

  loadWeatherGenerator = function*(city) {
    const response = yield fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    );
    const data = yield response.json();
    this.weatherData = data;
  };
}

decorate(WeatherStore, {
  weatherData: observable,
  setWeatherData: action,
  loadWeatherGenerator: flow
});

export default new WeatherStore();
