import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TargetProgress from "./TargetProgress";
import Nav from "../components/nav";
import YearSelector from "../components/YearSelector";
import ManageStatusCard from "../components/ManageStatuscard";

export default function DashboardScreen() {
  const [selectedYear, setSelectedYear] = useState(2024); // Track selected year

  // Function to handle year selection and update the state
  const handleYearSelect = (year) => {
    setSelectedYear(year); // Update the year when selected
  };

  return (
    <LinearGradient colors={["#405de5", "#263788"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Row container to hold YearSelector and ManageStatusCard */}
        <View style={styles.rowContainer}>
          {/* YearSelector and ManageStatusCard placed in a row */}
          <YearSelector
            selectedYear={selectedYear}
            onYearSelect={handleYearSelect}
          />
          
          <ManageStatusCard year={selectedYear} status={1} />
        </View>

        {/* Pass the selectedYear state to TargetProgress */}
        <TargetProgress year={selectedYear} />
        <Nav selectedYear={selectedYear} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',  // Aligns YearSelector and ManageStatusCard in a row
    alignContent: 'center',  // Centers items vertically in the row
    justifyContent: 'flex-end',  // Adds space between components in the row
    paddingHorizontal: 20,  // Adds horizontal padding around the row
    paddingTop: 10,  // Adds vertical padding around the row
    width: '100%',
  },

});
