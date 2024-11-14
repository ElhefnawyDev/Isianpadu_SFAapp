// TaskCard.js

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you have installed @expo/vector-icons or use an equivalent icon library

const TaskCard = ({ time, title, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.circle} />
        <Text style={styles.time}>{time}</Text>
        <MaterialIcons name="more-horiz" size={20} color="#B0B0B0" style={styles.moreIcon} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,

    flexDirection: "column",
    width: "90%", // Adjust width to create padding on sides
    alignSelf: "center", // Center the card horizontally
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00C853", // Green color for the indicator
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: "#6B7280", // Light grey for time text
    flex: 1, // Allow time text to take remaining space
  },
  moreIcon: {
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937", // Darker text for header
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#9CA3AF", // Lighter grey for description
  },
});

export default TaskCard;
