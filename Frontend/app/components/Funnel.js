import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { API_URL } from "../../env";
import { apiClient } from '../../apiClient';
const formatCurrency = (num) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(num);
};


const FunnelChart = ({ year= 2024, setVisibility }) => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiClient(`/funnelRouter?selected_year=${year}`);
      

      const formattedData = data?.dataPoints?.map((item) => ({
        label: item.label,
        Total_Value: item.Total_Value,
        percentage: parseFloat(item.percentage),
        color: getColorByLabel(item.label),
      })) || [];

      setFunnelData(formattedData);
      setVisibility(formattedData.length > 0); 
    } catch (error) {
      console.error('Error fetching data:', error);
      setVisibility(false); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const getColorByLabel = (label) => {
    const colorMapping = {
      Prospect: '#6D78AD',
      Potential: '#51CDA0',
      'Best Few': '#df7870',
      'Commitment To Buy': '#499CA3',
      Won: '#af7f9b',
    };
    return colorMapping[label] || '#000000'; 
  };

  const handleStagePress = (stage) => {
    Alert.alert(
      stage.label,
      `Percentage: ${stage.percentage}%\nTotal Tender Value: ${formatCurrency(
        parseFloat(stage.Total_Value)
      )}`,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!funnelData.length) {
    return null; // No data, return null to hide the component
  }

  const baseHeight = 500;
  const containerHeight = 0.6 * baseHeight;
  const funnelWidth = 350;

  const stageHeights = funnelData.map(
    (stage) => (stage.percentage / 100) * (baseHeight * 0.6)
  );
  let accumulatedHeight = 0;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (funnelData.length === 0) {
    return null; // Return null if there's no data
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          width: funnelWidth,
          height: containerHeight,
        }}
      >
        <MaskedView
          style={{ height: "100%", width: "100%" }}
          maskElement={
            <Svg height={baseHeight} width={funnelWidth}>
              <Polygon
                points={`
                  0,0
                  ${funnelWidth},0
                  ${funnelWidth * 0.7},${baseHeight * 0.4}
                  ${funnelWidth * 0.7},${baseHeight * 0.6}
                  ${funnelWidth * 0.3},${baseHeight * 0.6}
                  ${funnelWidth * 0.3},${baseHeight * 0.4}
                  0,0
                `}
                fill="black"
                stroke="none"
              />
            </Svg>
          }
        >
          <View style={{ flex: 1 }}>
            {funnelData.map((stage, index) => {
              const stageStyle = {
                height: stageHeights[index],
                backgroundColor: stage.color,
                width: "100%",
                position: "absolute",
                top: accumulatedHeight,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.8,
              };
              accumulatedHeight += stageHeights[index];
              return (
                <TouchableOpacity
                  key={index}
                  style={stageStyle}
                  onPress={() => handleStagePress(stage)}
                >
                  <Text style={styles.stageLabel}>
                    {stage.label} ({stage.percentage}%)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </MaskedView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  stageLabel: {
    color: '#fff',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

export default FunnelChart;
