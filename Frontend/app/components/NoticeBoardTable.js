import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, TextInput } from "react-native";
import TableTenderStage from "./TenderStageTables/TableTenderStage";
import { API_URL } from "../../env";
import TableNoticeBoard from "./TableNoticeBoard";

export default function NoticeBoardTable({ searchQuery }) {
  const [data, setData] = useState([]); // Data for the table
  const [data2, setData2] = useState([]); // Data for the table
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [error, setError] = useState(null); // Error handling state
  const [totalTenderValueWon, setTotalTenderValueWon] = useState("0");

  const columnsMapping = {
    1: [
      { displayName: "Submission Method", dataKey: "subm_method" },
      { displayName: "Submission Type", dataKey: "subm_type" },
      { displayName: "Brief Date", dataKey: "brief_date" },
      { displayName: "Deadline", dataKey: "deadline" },
      { displayName: "Sales Person", dataKey: "name" },
      { displayName: "Pre sales", dataKey: "status" },
      { displayName: "Sales Admin", dataKey: "status" },
      { displayName: "Remarks", dataKey: "remarks" },
    ],
  };

  const [columns, setColumns] = useState(columnsMapping[1]); // Default to stage 1 columns

  // Fetch data dynamically based on selected stage
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_URL}/notices`); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Notices:", data.notices);
        setData(data);
        setFilteredData(data); // Set both data and filteredData initially

        // Handle the fetched data here, e.g., set state
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
  });

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
