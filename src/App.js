import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import JSONPretty from "react-json-pretty";

class App extends Component {
  componentDidMount() {
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

export default inject("WeatherStore")(observer(App));
