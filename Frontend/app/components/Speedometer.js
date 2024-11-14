// Speedometer.js
import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import RNSpeedometer from "react-native-speedometer"; // Ensure this package is correctly installed

function Speedometer({ title, current, target }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.speedometerWrapper}>
          <RNSpeedometer value={(current / target) * 100} size={120} maxValue={100}     allowedDecimals={2} />
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.descriptionTarget}>{formatCurrency(target)}</Text>

          <Text style={styles.descriptionCurrent}>
            {formatCurrency(current)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const formatCurrency = (num) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(num);
};

const styles = StyleSheet.create({
  // Ensure styles are defined correctly
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#171724",
    width: 170,
    height: 170,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 12,
    paddingBottom: 35,
    color: "white",
    textAlign: "center",
  },
  speedometerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 55,
  },
  descriptionWrapper: {
    alignItems: "center",
  },
  descriptionCurrent: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  descriptionTarget: {
    fontSize: 13,
    color: "white",
    textDecorationLine: "underline",
  },
});

export default Speedometer; // Ensure this is a default export
