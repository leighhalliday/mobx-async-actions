import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "mobx-react";
import WeatherStore from "./stores/WeatherStore";

const Root = (
  <Provider WeatherStore={WeatherStore}>
    <App />
  </Provider>
);

ReactDOM.render(Root, document.getElementById("root"));
registerServiceWorker();
