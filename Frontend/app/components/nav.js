import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ProgressCards from "../screens/ProgressCards";
import TableDashboard from "./TableDashboard";
import TableScreen from "./TableTopWonClient";
import ChartsScreen from "../screens/ChartsScreen";
import TableTop20Clients from "./TableTop20Client";
import TableTopWonClient from "./TableTopWonClient";
import TableTopProspectClients from "./TableTopProspectClient";
import TableTopCategory from "./TableTopCategory";
import TableTopWonCategory from "./TableTopWonCategory";
import TableTopProspectCategory from "./TableTopProspectCategory";
import Calendar from "../screens/calenderr";

const screenWidth = Dimensions.get("window").width;

const Nav = ({selectedYear}) => {
  const [selectedView, setSelectedView] = useState(null);

  const handlePressViw1 = () => setSelectedView("viw1");
  const handlePressViw2 = () => setSelectedView("viw2");
  const handlePressViw3 = () => setSelectedView("viw3");

  const getGreetingText = () => {
    switch (selectedView) {
      case "viw1":
        return (
          <View>
            <ProgressCards year={selectedYear} />
            <Text style={styles.headerText}>Charts</Text>
            <ChartsScreen selectedYear={selectedYear}/>
          </View>
        );
      case "viw2":
        return (
          <View>
            <Text style={styles.headerText}>Top 20 Clients</Text>
            <TableTop20Clients year={selectedYear} />
            <Text style={styles.headerText}>Top Client (Won)</Text>
            <TableTopWonClient year={selectedYear} />
            <Text style={styles.headerText}>Top Client (Prospect)</Text>
            <TableTopProspectClients year={selectedYear} />
            <Text style={styles.headerText}>Top Category</Text>
            <TableTopCategory year={selectedYear} />
            <Text style={styles.headerText}>Top Category (Prospect)</Text>
            <TableTopProspectCategory year={selectedYear} />
            <Text style={styles.headerText}>Top Category (Won)</Text>
            <TableTopWonCategory year={selectedYear} />
          </View>
        );
      case "viw3":
        return (
          <View>
            <Calendar />
          </View>
        );
      default:
        return <Text style={styles.text}>Hiiiiiiii</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, { width: screenWidth }]}>
        <TouchableOpacity
          style={[
            styles.viw1,
            selectedView === "viw2" && { borderBottomRightRadius: 15 },
            selectedView === "viw3" && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
          onPress={handlePressViw1}
        >
          {selectedView === "viw1" ? (
            <View style={styles.twoin1}>
              <View style={styles.inner}>
                <Text style={styles.textInside}>Analysis</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.unselectedText}>Analysis</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viw2,
            selectedView === "viw1" && { borderBottomLeftRadius: 15 },
            selectedView === "viw3" && { borderBottomRightRadius: 15 },
          ]}
          onPress={handlePressViw2}
        >
          {selectedView === "viw2" ? (
            <View style={styles.twoin1}>
              <View style={styles.inner}>
                <Text style={styles.textInside}>Tables</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.unselectedText}>Tables</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viw3,
            selectedView === "viw1" && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            selectedView === "viw2" && { borderBottomLeftRadius: 15 },
          ]}
          onPress={handlePressViw3}
        >
          {selectedView === "viw3" ? (
            <View style={styles.twoin1}>
              <View style={styles.inner}>
                <Text style={styles.textInside}>Events</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.unselectedText}>Events</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.contentbackground, { width: screenWidth }]}>
        <View style={styles.contentContainer}>{getGreetingText()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
  },
  twoin1: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    height: "100%",
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    backgroundColor: "white",
  },
  viw1: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#2f44a9",
    justifyContent: "center",
    alignItems: "center",
  },
  viw2: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#2f44a9",
    justifyContent: "center",
    alignItems: "center",
  },
  viw3: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#2f44a9",
    justifyContent: "center",
    alignItems: "center",
  },
  contentbackground: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingVertical: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  textInside: {
    color: "black",
    fontSize: 16,
  },
  unselectedText: {
    color: "white",
    fontSize: 16,
  },
  headerText: {
    color: "#737D93",
    fontSize: 15, // Larger font size for header
    textAlign: "start",
    paddingLeft: 15,
    paddingTop: 20,
  },
  chartsHeaderText: {
    color: "black",
    fontSize: 20, // Larger font size for header
    fontWeight: "bold", // Bold style for the header
    textAlign: "center",
    marginVertical: 20, // Space below the header
  },
  
});

export default Nav;
