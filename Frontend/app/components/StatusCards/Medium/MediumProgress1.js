import React from 'react';
import { View, Text, StyleSheet ,Image} from 'react-native';
import { useFonts } from 'expo-font';



const MediumProgress1 = () => {
  const [fontsLoaded] = useFonts({
    'FuzzyBubbles-Regular': require('../../../assets/fonts/FuzzyBubbles-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return null; // or some loading indicator
  }
  return (
    <View style={[styles.card, styles.greenBackground]}>
      <Text style={{fontSize: 15, color:'white', textTransform:'capitalize' }}>
      You're <Text style={styles.greenText}>halfway </Text>
      there,🚀</Text>
      <View style={styles.rowContainer}>
        <Text style={{ fontFamily: 'FuzzyBubbles-Regular', fontSize: 15, color:'white' }}>keep pushing!</Text>
    
      </View>
        </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    width:204,
  },
  rowContainer:{
    flexDirection: 'row'
  },
  greenBackground: {
    backgroundColor: '#2E3789', // Blue background similar to reference
  },
  statusText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'white',
  },
  greenText: {
    color: 'orange', // Green text
  },
  arrowText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 10,
  },
  arrowImage: {
    position: 'absolute', // Allows absolute positioning within the card
bottom:-5,   
left:55,    
    // marginLeft:60,
    // marginBottom:1,
  },
});

export default MediumProgress1;
