import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons"; // For icons
const StageSelector = ({ initialStage = "Prospect", onStageSelect }) => {
    const [selectedStage, setSelectedStage] = useState(initialStage);
    const [listVisible, setListVisible] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
  
    const stages = [
      "Prospect",
      "Potential",
      "Best Few",
      "Commitment To Buy",
      "Won",
      "Unsuccessful",
      "Dropped",
    ];
  
    const toggleStageList = () => {
      if (listVisible) {
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => setListVisible(false));
      } else {
        setListVisible(true);
        Animated.timing(animatedHeight, {
          toValue: Math.min(stages.length * 50, 300),
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    };
  
    const selectStage = (stage) => {
      setSelectedStage(stage);
      onStageSelect(stage); // Pass the selected stage back to the parent
      toggleStageList();
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleStageList} style={styles.selectorButton}>
          <Text style={styles.selectedText}>{selectedStage}</Text>
          <View style={styles.subTextContainer}>
            <Text style={styles.subText}>Select a stage </Text>
            <Ionicon
              name={listVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="white"
            />
          </View>
        </TouchableOpacity>
  
        {listVisible && (
          <Animated.View style={[styles.dropdown, { height: animatedHeight }]}>
            <ScrollView nestedScrollEnabled>
              {stages.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  onPress={() => selectStage(stage)}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{stage}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      zIndex: 20, // Ensure the dropdown appears above other components
      marginVertical: 10,
    },
    selectorButton: {
      alignItems: "flex-start",
      width: 180,
    },
    selectedText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 1,
    },
    subTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    subText: {
      color: "white",
      fontSize: 15,
      opacity: 1,
    },
    dropdown: {
      position: "absolute", // Ensures dropdown is above other elements
      top: 40, // Positions dropdown below the button
      left: 0,
      width: 220,
      backgroundColor: "#ffffff",
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 5,
      zIndex: 30, // Ensure dropdown is above other components
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5, // For Android shadow
    },
    dropdownItem: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderBottomColor: "#ddd",
      borderBottomWidth: 1,
    },
    dropdownItemText: {
      fontSize: 16,
      color: "#333",
    },
  });
  
  export default StageSelector;
  