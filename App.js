import React from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import axios from "axios";

import Loading from "./Loading";
import Weather from "./Weather";
import { api_key, units } from "./key.json";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      weather: null,
      temp: null,
      humidity: null,
      temp_min: null,
      temp_max: null,
      latitude: null,
      longitude: null,
      message: "Loading Weather Data.."
    };

    this._requestPermissons = this._requestPermissons.bind(this);
    this._getCurrentPosition = this._getCurrentPosition.bind(this);
    this._getWeather = this._getWeather.bind(this);
  }

  _requestPermissons = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        message: "Permission to access location was denied"
      });
    }

    return;
  };

  _getCurrentPosition = async () => {
    await this._requestPermissons();
    const {
      coords: { latitude: latitude, longitude: longitude }
    } = await Location.getCurrentPositionAsync();
    this.setState({ latitude, longitude });
  };

  _getWeather = async () => {
    try {
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=${api_key}&units=${units}`
        )
        .then(
          ({
            data: {
              weather: [{ main: weather }],
              main: { temp, humidity, temp_min, temp_max }
            }
          }) => {
            this.setState({
              isLoading: false,
              weather,
              temp,
              humidity,
              temp_min,
              temp_max
            });
          }
        );
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        message:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      await this._getCurrentPosition();
      await this._getWeather();
    }
  }

  render() {
    const {
      isLoading,
      message,
      weather,
      temp,
      humidity,
      temp_min,
      temp_max
    } = this.state;

    return isLoading ? (
      <Loading message={message} />
    ) : (
      <Weather
        weather={weather}
        temp={temp}
        humidity={humidity}
        temp_min={temp_min}
        temp_max={temp_max}
      />
    );
  }
}
