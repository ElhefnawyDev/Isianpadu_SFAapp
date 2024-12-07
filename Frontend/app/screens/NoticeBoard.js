import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import TenderStageTable from "../components/TenderStageTables/TenderStageTable";
import { LinearGradient } from "expo-linear-gradient";
import TableIcons from "../components/TableIcons";
import StageSelector from "../components/TenderStageTables/TenderStageDropdown";
import NoticeBoardTable from "../components/NoticeBoardTable";
import TableIconsNoticeBoard from "../components/TableIconsNoticeBoard";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function TenderStageScreen() {
  const [searchQuery, setSearchQuery] = useState(""); // Shared search state
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data

  return (
    <View style={styles.container}>
      {/* Gradient for the top half */}
      <LinearGradient
        colors={["#405de5", "#263788"]}
        style={styles.gradientBackground}
      />

      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <TableIconsNoticeBoard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredData={filteredData} // Pass filteredData to TableIcons
          />
        </View>
      </View>

      {/* Solid color for the bottom half */}
      <View style={styles.solidBackground}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <NoticeBoardTable
            searchQuery={searchQuery}
            onFilteredDataChange={(data) => setFilteredData(data)}
          ></NoticeBoardTable>
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
    top: screenWidth<388? "13%":"12%",    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    zIndex: 20,
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
