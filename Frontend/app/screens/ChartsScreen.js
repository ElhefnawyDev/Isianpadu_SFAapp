// ChartsScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import BarChartComponent2 from '../components/Chart2';
import BarChartComponent from '../components/wonIn2007To2024';
import FunnelChart from '../components/Funnel';

export default function ChartsScreen({selectedYear}) {
  return (
    <ScrollView horizontal={true} style={styles.scrollContainer} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
      <View style={styles.chartItem}><BarChartComponent></BarChartComponent></View>
      <View style={styles.chartItem}><BarChartComponent2 year={selectedYear}/></View>
      <View style={styles.chartItem}><FunnelChart year={selectedYear}/></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  chartItem: {
    flex:1,
    width: 390,
    height: 400,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderRadius: 10,
  },
});
