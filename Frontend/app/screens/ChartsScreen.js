import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import BarChartComponent2 from "../components/Chart2";
import BarChartComponent from "../components/wonIn2007To2024";
import FunnelChart from "../components/Funnel";

export default function ChartsScreen({ selectedYear }) {
  const [isFunnelVisible, setFunnelVisible] = useState(true);

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
      {isFunnelVisible && ( // Show only if visible
        <View style={styles.chartItem}>
          <Text style={styles.funnelHeaderText}>
            Sales Funnel - {selectedYear}
          </Text>
          <FunnelChart
            year={selectedYear}
            setVisibility={setFunnelVisible} // Pass setVisibility to FunnelChart
          />
        </View>
      )}
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  funnelHeaderText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },
});
