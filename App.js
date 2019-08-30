import React from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import axios from "axios";

import Loading from "./Loading";
import { api_key, units } from "./key.json";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      latitude: null,
      longitude: null,
      errorMessage: null
    };

    this._requestPermissons = this._requestPermissons.bind(this);
    this._getCurrentPosition = this._getCurrentPosition.bind(this);
    this._getWeather = this._getWeather.bind(this);
  }

  _requestPermissons = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
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
              weather: [{ description: weather }],
              main: { temp, humidity, temp_min, temp_max }
            }
          }) => {
            console.log(
              `${weather}, ${temp}, ${humidity}, ${temp_min}, ${temp_max}`
            );
          }
        );
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      await this._getCurrentPosition();
      await this._getWeather();
    }
  }

  render() {
    let text = "Waiting to Get Location...";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.latitude && this.state.longitude) {
      text = `${this.state.latitude}, ${this.state.longitude}`;
    }
    // return <Loading text={text} />;
    return <Loading text={text} />;
  }
}
