import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TargetProgress from "./TargetProgress";
import Nav from "../components/nav";
import YearSelector from "../components/YearSelector";
import ManageStatusCard from "../components/ManageStatuscard";

const screenHeight = Dimensions.get("window").height;

export default function DashboardScreen() {
  const [selectedYear, setSelectedYear] = useState(2024);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      {/* Gradient for the top half */}
      <LinearGradient
        colors={["#405de5", "#263788"]}
        style={styles.gradientBackground}
      />

      {/* Solid color for the bottom half */}
      <View style={styles.solidBackground} />

      {/* Components placed at the top */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <YearSelector selectedYear={selectedYear} onYearSelect={handleYearSelect} />
          <ManageStatusCard year={selectedYear} status={1} />
        </View>

        <TargetProgress year={selectedYear} />
        <Nav selectedYear={selectedYear} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight / 2, // Covers top half of the screen
  },
  solidBackground: {
    position: "absolute",
    top: screenHeight / 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#263788", // Solid color for the bottom half
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40, // Adjust for spacing at the top
    paddingBottom:10
  },
  rowContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    width: "100%",
  },
});
