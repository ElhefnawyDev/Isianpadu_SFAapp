import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RedStatusCard = () => {
  return (
    <View style={[styles.card, styles.redBackground]}>
      <Text style={styles.statusText}>
        YOU ARE ON <Text style={styles.redText}>Red</Text>
      </Text>
      
      {/* Container for "Keep It Up" and arrow in a row */}
      <View style={styles.rowContainer}>
        <Text style={styles.messageText}>Keep It Up</Text>
        <Text style={[styles.arrowText, styles.redText]}>↗</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  redBackground: {
    backgroundColor: '#2E3789', // Blue background similar to reference
  },
  statusText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  // Row container for aligning text and arrow icon
  rowContainer: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center', // Centers items vertically within the row
  },
  messageText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'white',
    marginRight: 5, // Adds space between text and arrow
  },
  redText: {
    color: 'red', // Red text
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RedStatusCard;
