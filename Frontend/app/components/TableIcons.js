import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

export default function TableIcons() {
  return (
    <View style={styles.container}>

      {/* Search Bar with Icons */}
      <View style={styles.searchContainer}>
        <View style={styles.iconGroup}>
          <MaterialIcons name="content-copy" size={20} color="white" style={styles.icon} />
          <FontAwesome5 name="file-csv" size={20} color="white" style={styles.icon} />
          <FontAwesome5 name="file-excel" size={20} color="white" style={styles.icon} />
          <FontAwesome5 name="file-pdf" size={20} color="white" style={styles.icon} />
          <Feather name="printer" size={20} color="white" style={styles.icon} />
        </View>
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#ccc" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    
    height: 40,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#ffffff', // White background
    borderRadius: 25, // Fully rounded corners
    borderWidth: 0, // No visible border
    shadowColor: '#000', // Optional for slight shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // For Android shadow
  },
});