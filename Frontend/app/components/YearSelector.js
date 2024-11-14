import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons"; // For Ionicons

const YearSelector = ({ selectedYear, onYearSelect }) => {
  const [listVisible, setListVisible] = useState(false); // Controls visibility of the year list
  const animatedHeight = useRef(new Animated.Value(0)).current; // Animation reference for height

  // Example array of years to select from
  const years = Array.from({ length: 10 }, (_, i) => 2015 + i); // Years from 2006 to 2024

  const toggleYearList = () => {
    if (listVisible) {
      // Collapse the list
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setListVisible(false));
    } else {
      // Expand the list
      setListVisible(true);
      Animated.timing(animatedHeight, {
        toValue: 200, // Set this to max height for 4 items
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const selectYear = (year) => {
    onYearSelect(year); // Call the onYearSelect function passed from the parent
    toggleYearList(); // Collapse the list after selection
  };

  return (
    <View style={styles.container}>
      {/* Static container to hold the button and dropdown list */}
      <View style={styles.selectorContainer}>
        {/* Display the selected year and toggle year list visibility */}
        <TouchableOpacity onPress={toggleYearList} style={styles.yearButton}>
          <Text style={styles.yearText}>{selectedYear}</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectText}>Select a year</Text>
            {/* Conditional rendering of arrow icons */}
            <Ionicon
              name={listVisible ? "arrow-up" : "arrow-down"}
              size={20}
              color="white"
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Animated dropdown list */}
        <Animated.View style={[styles.yearList, { height: animatedHeight }]}>
          {/* ScrollView wrapped inside Animated.View */}
          <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => selectYear(year)}
                style={styles.yearOption}
              >
                <Text style={styles.optionText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  selectorContainer: {
    width: 150, // Fixed width for the selector container
    overflow: "hidden", // Ensures rounded corners apply to the dropdown as well
  },
  yearButton: {
    alignItems: "flex-start",
  },
  selectContainer: {
    flexDirection: "row", // Aligns the text and icon in a row
    alignItems: "center", // Align vertically to remove space between text and icon
    marginTop: 0, // Remove margin between "Select a year" and "Year"
  },
  yearText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  selectText: {
    fontSize: 16,
    color: "white",
    opacity: 0.7,
    marginRight: 5, // Space between text and arrow icon
  },
  arrowIcon: {
    marginLeft: 5, // Space between icon and text if needed
  },
  yearList: {
    width: "90%", // Ensure the dropdown matches button width
    backgroundColor: "#2e3789", // Dropdown background color
    borderBottomRightRadius: 8,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 8,
  },
  scrollView: {
    width: "100%",
    // Remove maxHeight here to let the animation work as expected.
  },
  yearOption: {
    paddingHorizontal: 10,
    paddingVertical: 10, // Add some padding to make each option more clickable
  },
  optionText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default YearSelector;
