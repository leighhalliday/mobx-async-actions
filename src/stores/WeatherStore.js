import {
  configure, // set some global mobx config settings
  action,
  observable,
  runInAction, // inlining an action within another function
  flow, // using generators and yield to run in action
  decorate // not needing to use decorators to decorate functions
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
        this.setWeather(data);
      });
  };

  setWeather = data => {
    this.weatherData = data;
  };

  loadWeatherInline = city => {
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

  loadWeatherAsync = async city => {
    const response = await fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    );
    const data = await response.json();

    runInAction(() => {
      this.weatherData = data;
    });
  };

  loadWeatherGenerator = flow(function*(city) {
    const response = yield fetch(
      `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
    );
    const data = yield response.json();
    this.weatherData = data;
  });
}

decorate(WeatherStore, {
  weatherData: observable,
  setWeather: action
});

export default new WeatherStore();
