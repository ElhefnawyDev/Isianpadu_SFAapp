import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Speedometer from "../components/Speedometer";
import { API_URL } from "../../env.js";
import { Feather } from "@expo/vector-icons"; // Feather icon library
import { apiClient } from "../../apiClient.js";

const ShowMoreLessButton = ({ isGridView, onPress }) => {
  
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconAndText}>
        <Feather
          name={isGridView ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>
          {isGridView ? "Show Less" : "Show More"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function TargetProgress({ year }) {
  const [isGridView, setIsGridView] = useState(false);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true); // New state
  const [totalTenderValue, setTotalTenderValue] = useState(0);
  const [minTarget, setMinTarget] = useState(0);
  const [minTargetFiveYear, setMinTargetFiveYear] = useState(0);
  const [totalTenderFiveYear, setTotalTenderFiveYear] = useState(0);
  const [yearlyTargetFiveYear, setYearlyTargetFiveYear] = useState(0);
  const [yearlyTarget, setYearlyTarget] = useState(0);
  const [gridItemWidth, setGridItemWidth] = useState(170); // State for dynamic grid item width

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = Dimensions.get("window").width;
      setIsShowMoreVisible(screenWidth < 768); // Hide the button for larger screens
      
      // Dynamically adjust the gridItem width based on screen size
      if (screenWidth < 388) {
        setGridItemWidth(150); // Smaller width for small screens
      } else {
        setGridItemWidth(170); // Default width for larger screens
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoTender = await apiClient(
          `/tenderProgressRouter?selected_year=${year}`
        );

     

  

        // Retrieve minimum target and target value for the selected year
        const targetData = infoTender.data;
        if (targetData) {
          const minTargetValue = parseFloat(targetData.min_target) || 0;
          const totalTenderValue =
            parseFloat(targetData.total_tender_value) || 0;
          const yearTarget = parseFloat(targetData.yearly_target) || 0;
          const minTargetFiveYear =
            parseFloat(targetData.min_target_5_years) || 0;
          const totalTenderFiveYear =
            parseFloat(targetData.total_tender_value_5_years) || 0;
          const yearlyTargetFiveYear =
            parseFloat(targetData.yearly_target_5_years) || 0;
          setMinTarget(Number(minTargetValue.toFixed(2)));
          setTotalTenderValue(Number(totalTenderValue.toFixed(2)));
          console.log(totalTenderValue);
          setYearlyTarget(Number(yearTarget.toFixed(2)));
          setMinTargetFiveYear(Number(minTargetFiveYear.toFixed(2)));
          setTotalTenderFiveYear(Number(totalTenderFiveYear.toFixed(2)));
          setYearlyTargetFiveYear(Number(yearlyTargetFiveYear.toFixed(2)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

  const speedometerData = [
    {
      title: `Minimum Target ${year}`,
      current: totalTenderValue,
      target: minTarget,
    },
    {
      title: `Target ${year}`,
      current: totalTenderValue,
      target: yearlyTarget,
    },
    {
      title: "Minimum Target in 5 years(2021-2025)",
      current: totalTenderFiveYear,
      target: minTargetFiveYear,
    },
    {
      title: "Target in 5 years(2021-2025)",
      current: totalTenderFiveYear,
      target: yearlyTargetFiveYear,
    },
  ];
  const filteredSpeedometerData = speedometerData.filter((item) => {
    // Exclude items if their target is 0 and match specific titles
    return !(
      (item.title === `Minimum Target ${year}` ||
        item.title === `Target ${year}`) &&
      item.target === 0
    );
  });

  return (
    <View style={styles.container}>
      {isGridView ? (
        <View style={styles.gridContainer}>
          {filteredSpeedometerData.map((item, index) => (
            <View
              key={index}
              style={[styles.gridItem, { width: gridItemWidth }]} // Dynamically set the width
            >
              <Speedometer
                key={item.id}
                title={item.title}
                current={item.current}
                target={item.target}
              />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {filteredSpeedometerData.map((item, index) => (
            <View key={index} style={styles.item}>
              <Speedometer
                key={item.id}
                title={item.title}
                current={item.current}
                target={item.target}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {isShowMoreVisible && ( // Conditionally render the button
        <View style={styles.containerShowMore}>
          <ShowMoreLessButton
            isGridView={isGridView}
            onPress={() => setIsGridView(!isGridView)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  containerShowMore: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  item: {
    width: 170,
    marginHorizontal: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  gridItem: {
    height: 170,
    margin: 10,
  },
  button: {
    borderRadius: 8,
    paddingTop: 20,
    alignItems: "center",
  },
  iconAndText: {
    alignItems: "center",
  },
  icon: {},
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});

export default TargetProgress;
