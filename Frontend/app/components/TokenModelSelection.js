import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // For dropdown icon (make sure to install this)


const TokenModelSelector = ({modelSelected, tokenCount, RequestsLeft, onSelectedPlanChange }) => {
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [modalVisible, setModalVisible] = useState(false);

  const plans = [
    { label: 'Free', value: 'Free' },
    { label: 'Paid', value: 'Paid' },
  ];
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan.label);
    setModalVisible(false);
    if (onSelectedPlanChange) {
      onSelectedPlanChange(plan.label); // Notify the parent of the change
    }
  };
  return (
    <View style={styles.container}>
        {modelSelected === "Pro" &&
        <View style={styles.row}>
        {tokenCount !== null ? (
          <Text style={styles.tokenCount}>{selectedPlan==="Free" ? "Requests Left: ": "Token Count: "}{selectedPlan==="Free" ? RequestsLeft : tokenCount}</Text>
        ) : (
          <Text style={styles.tokenCount}>Loading Token Count...</Text>
        )}

        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>{selectedPlan}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="white" />
        </TouchableOpacity>

        {/* Custom Modal for Dropdown */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={plans}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handlePlanChange(item)}

                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
        }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenCount: {
    fontSize: 16,
    marginRight: 20,  // Increased space between token count and dropdown
    color: 'white',
  },
  // Custom Styled Dropdown Button
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',  // Blue background
    borderRadius: 30,  // Rounded corners
    paddingHorizontal: 20,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dropdownText: {
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
  // Modal for Dropdown
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContent: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TokenModelSelector;