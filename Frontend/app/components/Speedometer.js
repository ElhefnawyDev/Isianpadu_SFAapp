import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import RNSpeedometer from "react-native-speedometer"; // Ensure this package is correctly installed

function Speedometer({ title, current, target }) {
  const [boxSize, setBoxSize] = useState(170); // Initial box size
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true); // New state

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = Dimensions.get("window").width;
      setIsShowMoreVisible(screenWidth < 400); // Hide the button for large screens
      // Adjust box size based on screen width
      if (screenWidth < 500) {
        setBoxSize(160); // Smaller size for screens less than 500px
      } else {
        setBoxSize(170); // Default size for larger screens
      }
    };

    updateDimensions(); // Initial check

    // Listen for dimension changes
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.box, { width: boxSize, height: boxSize }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.speedometerWrapper}>
          <RNSpeedometer value={(current / target) * 100} size={120} maxValue={100} allowedDecimals={2} />
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#171724",
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

export default Speedometer;
