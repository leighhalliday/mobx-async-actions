import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import JSONPretty from "react-json-pretty";

@inject("WeatherStore")
@observer
class App extends Component {
  componentDidMount() {
    this.props.WeatherStore.loadWeather("Toronto, ON, Canada");
    this.props.WeatherStore.loadWeatherRunInThen("Toronto, ON, Canada");
    this.props.WeatherStore.loadWeatherRunInAsync("Toronto, ON, Canada");
    this.props.WeatherStore.loadWeatherGenerator("Toronto, ON, Canada");
  }

  render() {
    return (
      <div className="App">
        <JSONPretty json={this.props.WeatherStore.weatherData} />
      </div>
    );
  }
}

export default App;
