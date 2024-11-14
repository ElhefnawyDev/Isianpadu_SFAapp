// ChartsScreen.js
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import BarChartComponent2 from "../components/Chart2";
import BarChartComponent from "../components/wonIn2007To2024";
import FunnelChart from "../components/Funnel";

export default function ChartsScreen({ selectedYear }) {
  return (
    <ScrollView
      horizontal={true}
      style={styles.scrollContainer}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={styles.chartItem}>
        <Text style={styles.chartsHeaderText}>
          Win In 2007 - {selectedYear}
        </Text>
        <BarChartComponent></BarChartComponent>
      </View>
      <View style={styles.chartItem}>
        <Text style={styles.chartsHeaderText}>Win In {selectedYear}</Text>

        <BarChartComponent2 year={selectedYear} />
      </View>
      <View style={styles.chartItem}>
        <Text style={styles.funnelHeaderText}>
          Sales Funnel - {selectedYear}
        </Text>

        <FunnelChart year={selectedYear} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "row",
    padding: 10,
  },
  chartItem: {
    flex: 1,
    width: 390,
    height: 450,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderRadius: 10,
  },
  chartsHeaderText: {
    color: "black",
    fontSize: 20, // Larger font size for header
    fontWeight: "bold", // Bold style for the header
    textAlign: "center",
    marginBottom: 20,
  },
  funnelHeaderText: {
    color: "black",
    fontSize: 20, // Larger font size for header
    fontWeight: "bold", // Bold style for the header
    textAlign: "center",
    marginBottom:50,
  },
});
