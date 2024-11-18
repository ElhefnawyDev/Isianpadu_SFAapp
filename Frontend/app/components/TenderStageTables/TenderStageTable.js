import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import TableTenderStage from "./TableTenderStage";
import { API_URL } from "../../../env";

export default function TableStageTable({ selectedStage }) {
  const [data, setData] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error handling state

  const columnsMapping = {
    1: [
      { displayName: "Client", dataKey: "clientName" },
      { displayName: "Category", dataKey: "tenderCategory" },
      { displayName: "Expected Close Date", dataKey: "deadline" },
      { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
      { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
      { displayName: "Sales Person", dataKey: "salesPerson" },
      { displayName: "Status", dataKey: "status" },
    ],
    2: [
      { displayName: "Client", dataKey: "clientName" },
      { displayName: "Category", dataKey: "tenderCategory" },
      { displayName: "Expected Close Date", dataKey: "deadline" },
      { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
      { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
      { displayName: "Margin Value (RM)", dataKey: "marginValue" },
      { displayName: "Margin %", dataKey: "marginPercentage" },
      { displayName: "Sales Person", dataKey: "salesPerson" },
      { displayName: "Status", dataKey: "status" },
    ],
    5: [
      { displayName: "Client", dataKey: "clientName" },
      { displayName: "Category", dataKey: "tenderCategory" },
      { displayName: "Expected Close Date", dataKey: "deadline" },
      { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
      { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
      { displayName: "Margin Value (RM)", dataKey: "marginValue" },
      { displayName: "Margin %", dataKey: "marginPercentage" },
      { displayName: "LOA Date", dataKey: "loaDate" },
      { displayName: "Sales Person", dataKey: "salesPerson" },
      { displayName: "Status", dataKey: "status" },
    ],
  };

  const [columns, setColumns] = useState(columnsMapping[1]); // Default to stage 1 columns

  // Fetch data dynamically based on selected stage
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${API_URL}/tender_stages?sfaStage=${selectedStage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result && result.data) {
          // Process data for specific stages
          const processedData = result.data.map((item) => {
            const tenderValue = parseFloat(item.tenderValue.replace(/,/g, "")) || 0;
            const tenderCost = parseFloat(item.tenderCost.replace(/,/g, "")) || 0;
            const marginValue = tenderValue - tenderCost;
            const marginPercentage = tenderValue !== 0 ? (marginValue / tenderValue) * 100 : 0;

            return {
              ...item,
              marginValue: formatCurrency(marginValue.toFixed(2)),
              marginPercentage: `${marginPercentage.toFixed(2)}%`,
              loaDate: item.loaDate
                ? new Date(item.loaDate).toLocaleDateString("en-GB")
                : "Please Update",
            };
          });

          setData(processedData);
          setColumns(columnsMapping[selectedStage] || columnsMapping[1]); // Update columns based on stage
        } else {
          throw new Error("Unexpected API response format.");
        }
      } catch (err) {
        console.error("Error fetching table data:", err);
        setError(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTableData();
  }, [selectedStage]); // Re-fetch when the selected stage changes

  // Render loading, error, or the table
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: "red", textAlign: "center" }}>Error: {error}</Text>;
  }

  return (
    <View>
      <Text></Text>
      <TableTenderStage columns={columns} data={data} itemsPerPage={5} />
    </View>
  );
}

// Currency formatter
const formatCurrency = (num) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(num);
};