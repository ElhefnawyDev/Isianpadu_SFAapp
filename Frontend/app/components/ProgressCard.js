import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function ProgressCard({ title, num, icon, ids }) {
  // Define color based on ids
  const backgroundColor =
    ids == 0
      ? "#fff5d9"
      : ids == 1
      ? "#e7edff"
      : ids == 2
      ? "#ffe0eb"
      : "#dcfaf8";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <Ionicons
              name={icon}
              size={30}
              color={
                ids == 0
                  ? "#ffbb38"
                  : ids === 1
                  ? "#2c398a"
                  : ids == 2
                  ? "#ff82ac"
                  : "#16dbcc"
              }
            />
          </View>
          <Text style={styles.num}>{num}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "100%",
    height: 95,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 18,
  },
  title: {
    fontSize: 12,
    color: "#718ebf",
    textAlign: "left",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  num: {
    fontSize: 20,
    color: "black",
    fontWeight: "700",
    marginLeft: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

export default ProgressCard;
