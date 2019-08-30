import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#FFF176",
    paddingVertical: 100,
    paddingHorizontal: 20
  },
  mainText: {
    color: "#2C2C2C",
    fontSize: 25
  }
});
