import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TableDashboard from "./TableDashboard";
import { API_URL } from "../../env";

export default function TableTopWonClient({
  year,
  searchQuery,
  onFilteredDataChange,
}) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/sfa_tenderTable?selected_year=${year}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const { aggregatedData } = await res.json();
        console.log("Fetched Data:", aggregatedData); // Log the fetched data

        // Format and structure data for TableDashboard
        const formattedData = aggregatedData.map((client) => ({
          name: client.client_name,
          tenderNo: parseInt(client.tender_count, 10),
          costValue: formatCurrency(parseFloat(client.total_tender_cost)),
        }));

        setData(formattedData);
        setFilteredData(formattedData); // Set both data and filteredData initially
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

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

  return (
    <View style={{ flex: 1 }}>
      <TableDashboard
        type={1}
        data={filteredData}
        column={["Total Value Cost (RM)", "Total Number of Tender"]}
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
