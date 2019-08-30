import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";
import images from "./assets/icon";

import { conditionList } from "./weather.json";

export default class Weather extends React.Component {
  constructor(props) {
    super(props);

    state = {
      icon: null
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (prevState.icon !== nextProps.icon) {
  //     console.log(`./img/${nextProps.icon}@2x.png`);
  //     return { icon: nextProps.icon };
  //   }

  //   return null;
  // }

  render() {
    const { condition, icon, temp, humidity, temp_max, temp_min } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={images[icon]} fadeDuration={0} style={styles.icon} />
        </View>
        <View style={styles.infoContainer}>
          <Text>
            Weather: {condition}, Temp: {temp}°C, Humidity: {humidity}%, Temp
            Max:{temp_max}°C, Temp Min: {temp_min}°C
          </Text>
        </View>
      </View>
    );
  }
}

Weather.propTypes = {
  condition: PropTypes.oneOf(conditionList).isRequired,
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  temp_min: PropTypes.number.isRequired,
  temp_max: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center"
  },
  infoContainer: {
    flex: 2
  },
  icon: {
    width: 75,
    height: 75
  }
});
