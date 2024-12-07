import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import GreenStatusCard from "./StatusCards/High/greenProgress";
import GreenStatusCard2 from "./StatusCards/High/greenProgress2";
import GreenStatusCard3 from "./StatusCards/High/greenProgress3";
import MediumProgress1 from "./StatusCards/Medium/MediumProgress1";
import LowProgress1 from "./StatusCards/low/LowProgress1";
import LowProgress2 from "./StatusCards/low/LowProgress2";
import LowProgress3 from "./StatusCards/low/LowProgress3";
import { API_URL } from "../../env";
import MediumProgress2 from "./StatusCards/Medium/MediumProgress2";
import MediumProgress3 from "./StatusCards/Medium/MediumProgress3";
import { apiClient } from "../../apiClient";

const ManageStatusCard = ({ year }) => {
  const [statusColor, setStatusColor] = useState(null);
  const [randomComponent, setRandomComponent] = useState(1);
  const [totalTenderValue, setTotalTenderValue] = useState(0);
  const [yearlyTarget, setYearlyTarget] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoTender = await apiClient(
          `/tenderProgressRouter?selected_year=${year}`
        );


      
        const targetData = infoTender.data;
        if (targetData) {
          const yearlyTarget = parseFloat(targetData.yearly_target) || 0;
          const totalTenderValue = parseFloat(targetData.total_tender_value) || 0;

          setYearlyTarget(yearlyTarget);
          setTotalTenderValue(totalTenderValue);
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
      const currentStatus = (totalTenderValue / yearlyTarget) * 100;
      const randomChoice = Math.floor(Math.random() * 3) + 1; // Generate random number between 1 and 3

      if (currentStatus < 33) {
        setStatusColor("red");
      } else if (currentStatus >= 33 && currentStatus < 66) {
        setStatusColor("blue");
      } else if (currentStatus >= 66) {
        setStatusColor("green");
      } else {
        setStatusColor(null);
      }

      setRandomComponent(randomChoice); // Update random choice for component selection
    } else {
      setStatusColor(null);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [yearlyTarget, totalTenderValue]);

  const renderComponent = () => {
    if (statusColor === "red") {
      return randomComponent === 1 ? <LowProgress1 /> : randomComponent === 2 ? <LowProgress2 /> : <LowProgress3 />;
    } else if (statusColor === "blue") {
      return randomComponent === 1 ? <MediumProgress1 /> : randomComponent === 2 ? <MediumProgress2 /> : <MediumProgress3 />;
    } else if (statusColor === "green") {
      return randomComponent === 1 ? <GreenStatusCard /> : randomComponent === 2 ? <GreenStatusCard2 /> : <GreenStatusCard3 />;
    } else {
      return null;
    }
  };

  return <View>{renderComponent()}</View>;
};

export default ManageStatusCard;
