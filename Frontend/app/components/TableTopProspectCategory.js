import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import TableDashboard from "./TableDashboard";
import { API_URL } from "../../env";

export default function TableTopProspectCategory({ year }) {
  const [data, setData] = useState([]);
  const [totalSubmission, setTotalSubmission] = useState(0);
  const [totalCost, setTotalCost] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/top_category_Prospect?selected_year=${year}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const { categoryProspectData, totalCategoryProspectCount, totalCost } =
          await res.json();

        // Calculate totalCost from data if needed
        const sumCost = categoryProspectData.reduce(
          (acc, curr) => acc + parseFloat(curr.total_tender_cost),
          0
        );

        // Format data for TableDashboard
        const formattedData = categoryProspectData.map((category) => ({
          name: category.tender_category,
          tenderNo: parseInt(category.tender_count, 10),
          costValue: formatCurrency(parseFloat(category.total_tender_cost)),
        }));

        setData(formattedData);
        setTotalSubmission(totalCategoryProspectCount); // set totalSubmission
        setTotalCost(formatCurrency(sumCost)); // format and set totalCost
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

  return (
    <View style={{ flex: 1 }}>
      <TableDashboard
        data={data}
        totalSubmission={totalSubmission}
        totalCost={totalCost}
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
