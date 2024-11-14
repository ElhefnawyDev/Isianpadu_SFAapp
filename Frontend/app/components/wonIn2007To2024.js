import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { API_URL } from "../../env";

const BarChartComponent = () => {
  const [data, setData] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/wonIn2007To2024`);
        const chartData = await response.json();
        setData(chartData.data);
        setSelectedBar(chartData.data[0]);
        setTotalProjects(chartData.totalProjects);
        setTotalAmount(chartData.totalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  const maxAmount = Math.max(...data.map((item) => item.amount));

  const getColorForValue = (value) => {
    const percentage = value / maxAmount;
    if (percentage <= 0.5) {
      const red = 255;
      const green = Math.floor(255 * (percentage * 2));
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const red = Math.floor(255 * (2 - percentage * 2));
      const green = 255;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  const barData = data.map((item) => ({
    value: item.amount / 1000000,
    label: item.year,
    frontColor: getColorForValue(item.amount),
    onPress: () => setSelectedBar(item),
  }));

  return (
    <View>
      <View style={styles.chartWrapper}>
        <View style={[styles.yAxis, { height: 210, bottom: 10 }]}>
          {[200, 150, 100, 50, 0].map((label) => (
            <Text key={label} style={styles.yAxisLabel}>
              RM {label}M
            </Text>
          ))}
        </View>
        <ScrollView
          horizontal
          style={styles.scrollableChart}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <BarChart
            data={barData}
            width={Math.max(Dimensions.get("window").width, data.length * 52)}
            height={200}
            maxValue={200}
            noOfSections={4}
            isAnimated
            barWidth={30}
            spacing={20}
            hideRules={false}
            rulesLength={Math.max(
              Dimensions.get("window").width,
              data.length * 60
            )}
            rulesColor="#d3d3d3"
            initialSpacing={20}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor="#d3d3d3"
            hideYAxisText={true}
            xAxisLabelStyle={styles.xAxisLabel}
            xAxisLabelTextStyle={{ fontSize: 12, color: "#333" }}
          />
        </ScrollView>
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Year:</Text>
          <Text style={styles.valueText}>{selectedBar?.year || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Amount:</Text>
          <Text style={styles.valueText}>
            RM {selectedBar ? selectedBar.amount.toLocaleString() : "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Total Projects:</Text>
          <Text style={styles.valueText}>{totalProjects}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Total Amount:</Text>
          <Text style={styles.valueText}>
            RM {totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: 340,
  },
  yAxis: {
    paddingRight: 8,
    justifyContent: "space-between",
  },
  yAxisLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  scrollableChart: {
    flex: 1,
    paddingLeft: 8,
  },
  detailContainer: {
    alignItems: "start",
    paddingTop: 30,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    color: "#808080",
  },
  valueText: {
    fontSize: 16,
    color: "black",
  },
  xAxisLabel: {
    fontSize: 10,
    color: "#333",
  },
});

export default BarChartComponent;
