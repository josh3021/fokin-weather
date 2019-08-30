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
      condition: null,
      temp: null,
      humidity: null,
      temp_min: null,
      temp_max: null,
      icon: null,
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
      const {
        data: {
          weather: [{ main: condition, icon }],
          main: { temp, humidity, temp_min, temp_max }
        }
      } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=${api_key}&units=${units}`
      );

      this.setState({
        isLoading: false,
        condition,
        icon,
        temp: Math.round(temp),
        humidity: Math.round(humidity),
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max)
      });
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
      condition,
      icon,
      temp,
      humidity,
      temp_min,
      temp_max
    } = this.state;

    return isLoading ? (
      <Loading message={message} />
    ) : (
      <Weather
        condition={condition}
        icon={icon}
        temp={temp}
        humidity={humidity}
        temp_min={temp_min}
        temp_max={temp_max}
      />
    );
  }
}
