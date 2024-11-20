import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search..."
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 8,
    borderRadius: 5,
  },
});
