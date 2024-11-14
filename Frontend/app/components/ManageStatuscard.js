import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import GreenStatusCard from "./StatusCards/High/greenProgress";
import MediumProgress1 from "./StatusCards/Medium/MediumProgress1";
import LowProgress1 from "./StatusCards/low/LowProgress1";
import { API_URL } from "../../env";

const ManageStatusCard = ({ year }) => {
  const [statusColor, setStatusColor] = useState(null);
  const [totalTenderValue, setTotalTenderValue] = useState(0);
  const [yearlyTarget, setYearlyTarget] = useState(0);

  // Use useEffect to fetch data and check status whenever the year prop changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOne = await fetch(
          `${API_URL}/tenderProgressRouter?selected_year=${year}`
        );

        if (!resOne.ok) {
          throw new Error(`HTTP error! Status: ${resOne.status}`);
        }

        const infoTender = await resOne.json();

        // Retrieve minimum target and target value for the selected year
        const targetData = infoTender.data;
        if (targetData) {
          const yearlyTarget = parseFloat(targetData.yearly_target) || 0;
          const totalTenderValue =
            parseFloat(targetData.total_tender_value) || 0;

          setYearlyTarget(yearlyTarget);
          setTotalTenderValue(totalTenderValue);

          console.log("Yearly Target: ", yearlyTarget);
          console.log("Total Tender Value: ", totalTenderValue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

  // Function to calculate and check the progress percentage
  const checkStatus = () => {
    if (totalTenderValue && yearlyTarget) {
      const currentStatus = (totalTenderValue / yearlyTarget) * 100; // Calculate progress percentage
      
      console.log(`Calculated Progress: ${currentStatus}%`);

      // Check the progress and set the corresponding color
      if (currentStatus < 33) {
        setStatusColor("red"); // Low progress (below 33%)
      } else if (currentStatus >= 33 && currentStatus < 66) {
        setStatusColor("blue"); // Medium progress (33% to 65%)
      } else if (currentStatus >= 66) {
        setStatusColor("green"); // High progress (66% and above)
      } else {
        setStatusColor(null); // Default to null if the value is unexpected
      }
    } else {
      setStatusColor(null); // Handle missing or invalid data
    }
  };

  useEffect(() => {
    checkStatus(); // Call checkStatus whenever `yearlyTarget` or `totalTenderValue` changes
  }, [yearlyTarget, totalTenderValue]);

  return (
    <View>
      {statusColor === "red" && <LowProgress1 />}
      {statusColor === "blue" && <MediumProgress1 />}
      {statusColor === "green" && <GreenStatusCard />}
    </View>
  );
};

export default ManageStatusCard;
