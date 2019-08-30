import React from "react";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Loading from "./Loading";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      errorMessage: null
    };

    this._requestPermissons = this._requestPermissons.bind(this);
    this._getCurrentPosition = this._getCurrentPosition.bind(this);
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

  componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getCurrentPosition();
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
