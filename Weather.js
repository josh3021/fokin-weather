import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { conditionList } from "./weather.json";

export default function Weather({
  condition,
  temp,
  humidity,
  temp_min,
  temp_max
}) {
  return (
    <View style={styles.container}>
      <Text>
        {condition}, {temp}, {humidity}, {temp_max}, {temp_min}
      </Text>
    </View>
  );
}

Weather.propTypes = {
  condition: PropTypes.oneOf(conditionList).isRequired,
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
  }
});
