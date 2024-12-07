import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import TableTenderStage from "./TenderStageTables/TableTenderStage";
import { API_URL } from "../../env";
import TableNoticeBoard from "./TableNoticeBoard";
import { apiClient } from "../../apiClient";

export default function NoticeBoardTable({
  searchQuery,
  onFilteredDataChange,
}) {
  const [data, setData] = useState([]); // Data for the table
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [error, setError] = useState(null); // Error handling state
  const [totalTenderValueWon, setTotalTenderValueWon] = useState("0");

  const columnsMapping = {
    1: [
      { displayName: "Submission Method", dataKey: "submissionMethod" },
      { displayName: "Submission Type", dataKey: "submissionType" },
      { displayName: "Brief Date", dataKey: "briefDate" },
      { displayName: "Deadline", dataKey: "deadline" },
      { displayName: "Sales Person", dataKey: "salesPerson" },
      { displayName: "Pre-Sales", dataKey: "preSales" },
      { displayName: "Sales Admin", dataKey: "salesAdmin" },
      { displayName: "Remarks", dataKey: "remarks" },
    ],
  };

  const [columns, setColumns] = useState(columnsMapping[1]); // Default to stage 1 columns

  // Fetch data dynamically based on selected stage
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const result = await apiClient(`/notices`);
          setData(result.notices);
          setFilteredData(result.notices); // Initialize filtered data with all data
          console.log("Fetched notices:", result.notices);

      } catch (error) {
        console.error("Error fetching notices:", error);
        setError(error.message);
      }
    };

    fetchNotices();
  }, []);

  // Filter data based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data); // If search query is empty, show all data
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredData(
        data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(query)
          )
        )
      );
    }
  }, [searchQuery, data]);

  // Emit filtered data to the parent component
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData);
    }
  }, [filteredData, onFilteredDataChange]);

  if (error) {
    return (
      <Text style={{ color: "red", textAlign: "center" }}>Error: {error}</Text>
    );
  }

  return (
    <View>
      <Text></Text>
      {/* Remove or replace the empty Text */}
      <TableNoticeBoard
        columns={columns}
        data={filteredData}
        itemsPerPage={5}
        totalTenderValueWon={formatCurrency(parseInt(totalTenderValueWon))}
      />
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
