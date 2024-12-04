import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import TenderStageTable from "../components/TenderStageTables/TenderStageTable";
import { LinearGradient } from "expo-linear-gradient";
import TableIcons from "../components/TableIcons";
import StageSelector from "../components/TenderStageTables/TenderStageDropdown";
const screenHeight = Dimensions.get("window").height;

export default function TenderStageScreen() {
  const [searchQuery, setSearchQuery] = useState(""); // Shared search state
  const [selectedStage, setSelectedStage] = useState("Prospect"); // Default selected stage
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data

  const stageMapping = {
    Prospect: 1,
    Potential: 2,
    "Best Few": 3,
    "Commitment To Buy": 4,
    Won: 5,
    Unsuccessful: 6,
    Dropped: 7,
  };

  const stageNumber = stageMapping[selectedStage]; // Map the selected stage to its corresponding stage number

  const handleStageSelect = (stage) => {
    setSelectedStage(stage); // Update the selected stage
  };

  return (
    <View style={styles.container}>
      {/* Gradient for the top half */}
      <LinearGradient
        colors={["#405de5", "#263788"]}
        style={styles.gradientBackground}
      />

      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          {/* Stage Selector */}
          <StageSelector
            initialStage={selectedStage}
            onStageSelect={handleStageSelect}
          />
          {/* Table Icons */}
          <TableIcons
            selectedStage={stageNumber}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredData={filteredData} // Pass filteredData to TableIcons
          />
        </View>
      </View>

      {/* Solid color for the bottom half */}
      <View style={styles.solidBackground}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Tender Stage Table */}
          <TenderStageTable
            searchQuery={searchQuery}
            selectedStage={stageNumber}
            onFilteredDataChange={(data) => setFilteredData(data)} // Update filteredData state
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight / 2,
    zIndex: 1,
  },
  solidBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: "18%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    zIndex: 1,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 40,
    zIndex: 10,
  },
  rowContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "80%",
    height: 90,
    marginBottom: 50,
    zIndex: 20,
  },
});
