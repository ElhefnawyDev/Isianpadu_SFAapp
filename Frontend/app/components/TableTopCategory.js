import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TableDashboard from "./TableDashboard";
import { API_URL } from "../../env";

export default function TableTopCategory({ year,searchQuery }) {
  const [data, setData] = useState([]);
  const [totalSubmission, setTotalSubmission] = useState(0);
  const [totalCost, setTotalCost] = useState("0");
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/top_category?selected_year=${year}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const { topCategoryData, totalSubmission, totalCost } =
          await res.json();

        // Handle totalCost by summing up parsed numbers in topCategoryData
        const sumCost = topCategoryData.reduce(
          (acc, curr) => acc + parseFloat(curr.total_tender_cost),
          0
        );

        // Format and structure data for TableDashboard
        const formattedData = topCategoryData.map((category) => ({
          name: category.tender_category,
          tenderNo: parseInt(category.tender_count, 10),
          costValue: formatCurrency(parseFloat(category.total_tender_cost)),
        }));

        setData(formattedData);
        setFilteredData(formattedData); // Set both data and filteredData initially

        setTotalSubmission(totalSubmission); // Set totalSubmission as received
        setTotalCost(formatCurrency(sumCost)); // Format the calculated total cost
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
  return (
    <View style={{ flex: 1 }}>
      <TableDashboard
        data={filteredData}
        totalSubmission={totalSubmission}
        totalCost={totalCost}
        column={[
          "Total Value Cost (RM)",
          "Total Number of Tender",
        ]}
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
