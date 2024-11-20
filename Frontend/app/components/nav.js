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
import TableIconsDash from "./TableIconsDash";

const screenWidth = Dimensions.get("window").width;

const Nav = ({ selectedYear }) => {
  const [selectedView, setSelectedView] = useState("viw1"); // Set "viw1" as the default view
  const [searchQuery, setSearchQuery] = useState(""); // Shared search state
  const [searchQuery2, setSearchQuery2] = useState(""); // Shared search state
  const [searchQuery3, setSearchQuery3] = useState(""); // Shared search state
  const [searchQuery4, setSearchQuery4] = useState(""); // Shared search state
  const [searchQuery5, setSearchQuery5] = useState(""); // Shared search state
  const [searchQuery6, setSearchQuery6] = useState(""); // Shared search state

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
            <ChartsScreen selectedYear={selectedYear} />
          </View>
        );
      case "viw2":
        return (
          <View>
            <Text style={styles.headerText}>Top 20 Clients</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tableNo={1}
            />
            <TableTop20Clients year={selectedYear} searchQuery={searchQuery} />
            <Text style={styles.headerText}>Top Client (Won)</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery2}
              setSearchQuery={setSearchQuery2}
              tableNo={2}
            />
            <TableTopWonClient year={selectedYear} searchQuery={searchQuery2} />
            <Text style={styles.headerText}>Top Client (Prospect)</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery3}
              setSearchQuery={setSearchQuery3}
              tableNo={3}
            />
            <TableTopProspectClients
              year={selectedYear}
              searchQuery={searchQuery3}
            />
            <Text style={styles.headerText}>Top Category</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery4}
              setSearchQuery={setSearchQuery4}
              tableNo={4}
            />
            <TableTopCategory year={selectedYear} searchQuery={searchQuery4} />
            <Text style={styles.headerText}>Top Category (Prospect)</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery5}
              setSearchQuery={setSearchQuery5}
              tableNo={5}
            />
            <TableTopProspectCategory
              year={selectedYear}
              searchQuery={searchQuery5}
            />
            <Text style={styles.headerText}>Top Category (Won)</Text>
            <TableIconsDash
              year={selectedYear}
              searchQuery={searchQuery6}
              setSearchQuery={setSearchQuery6}
              tableNo={6}
            />
            <TableTopWonCategory
              year={selectedYear}
              searchQuery={searchQuery6}
            />
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
    backgroundColor: "#f3f4f6",
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
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 52,
    backgroundColor: "#f3f4f6",
  },
  viw1: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#263788",
    justifyContent: "center",
    alignItems: "center",
  },
  viw2: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#263788",
    justifyContent: "center",
    alignItems: "center",
  },
  viw3: {
    width: "33.3%",
    height: "100%",
    backgroundColor: "#263788",
    justifyContent: "center",
    alignItems: "center",
  },
  contentbackground: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  text: {
    color: "#263788",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  textInside: {
    color: "#263788",
    fontSize: 16,
    fontWeight: "bold",
  },
  unselectedText: {
    color: "#f3f4f6",
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
