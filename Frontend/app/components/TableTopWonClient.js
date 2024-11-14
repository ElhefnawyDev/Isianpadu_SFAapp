import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TableDashboard from "./TableDashboard";
import { API_URL } from "../../env";

export default function TableTopWonClient({ year }) {
  const [data, setData] = useState([]);
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

        console.log("Formatted Data:", formattedData); // Log the formatted data
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

  return (
    <View style={{ flex: 1 }}>
      <TableDashboard data={data} />
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
