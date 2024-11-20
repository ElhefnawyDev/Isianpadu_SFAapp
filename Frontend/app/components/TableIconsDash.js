import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import Papa from "papaparse";
import { API_URL } from "../../env";

export default function TableIconsDash({
  year,
  searchQuery,
  setSearchQuery,
  tableNo,
}) {
  const [data, setData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [formattedData2, setFormattedData2] = useState([]);
  const [formattedData3, setFormattedData3] = useState([]);
  const [formattedData4, setFormattedData4] = useState([]);
  const [formattedData5, setFormattedData5] = useState([]);
  const [formattedData6, setFormattedData6] = useState([]);
  const [totalSubmission, setTotalSubmission] = useState(0);
  const [totalCost, setTotalCost] = useState("0");
  console.log(tableNo);
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      if (tableNo === 1) {
        try {
          const res = await fetch(
            `${API_URL}/top20_clients?selected_year=${year}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const { top20Clients } = await res.json();

          // Format data for export
          const formatted = top20Clients.map((client, index) => ({
            no: index + 1,
            name: client.client_name,
            tenderNo: parseInt(client.tender_count, 10),
            costValue: formatCurrency(parseFloat(client.total_tender_cost)),
          }));

          setData(top20Clients);
          setFormattedData(formatted);
        } catch (error) {
          console.error("Error fetching data:", error);
          Alert.alert("Error", "Failed to fetch data.");
        }
      } else if (tableNo === 2) {
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
          const formatted = aggregatedData.map((client) => ({
            name: client.client_name,
            tenderNo: parseInt(client.tender_count, 10),
            costValue: formatCurrency(parseFloat(client.total_tender_cost)),
          }));

          console.log("Formatted Data test:", formattedData); // Log the formatted data
          setData(formattedData);
          setFormattedData2(formatted);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else if (tableNo === 3) {
        try {
          const res = await fetch(
            `${API_URL}/top_client_prospect?selected_year=${year}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const { topClientProspect } = await res.json();
          console.log("Top 20:", topClientProspect); // Log the fetched data

          // Format and structure data for TableDashboard
          const formattedData = topClientProspect.map((client) => ({
            name: client.client_name,
            tenderNo: parseInt(client.tender_count, 10),
            costValue: formatCurrency(parseFloat(client.total_tender_cost)),
          }));

          console.log("Formatted Top:", formattedData); // Log the formatted data
          setData(formattedData);
          setFormattedData3(formattedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else if (tableNo === 4) {
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
          setFormattedData4(formattedData);

          setTotalSubmission(totalSubmission); // Set totalSubmission as received
          setTotalCost(formatCurrency(sumCost)); // Format the calculated total cost
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else if (tableNo === 5) {
        try {
          const res = await fetch(
            `${API_URL}/top_category_Prospect?selected_year=${year}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const {
            categoryProspectData,
            totalCategoryProspectCount,
            totalCost,
          } = await res.json();

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
          setFormattedData5(formattedData);
          setTotalSubmission(totalCategoryProspectCount); // set totalSubmission
          setTotalCost(formatCurrency(sumCost)); // format and set totalCost
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          const res = await fetch(
            `${API_URL}/top_category_won?selected_year=${year}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const { categoryWonData, totalWonCount, totalCost } =
            await res.json();

          // Calculate totalCost from data if needed
          const sumCost = categoryWonData.reduce(
            (acc, curr) => acc + parseFloat(curr.total_tender_value),
            0
          );

          // Format data for TableDashboard
          const formattedData = categoryWonData.map((category) => ({
            name: category.tender_category,
            tenderNo: parseInt(category.tender_count, 10),
            costValue: formatCurrency(parseFloat(category.total_tender_value)),
          }));

          setData(formattedData);
          setFormattedData6(formattedData);
          setTotalSubmission(totalWonCount); // set totalSubmission
          setTotalCost(formatCurrency(sumCost)); // format and set totalCost
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [year]);

  // Currency formatter
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    }).format(num);

  // Export handlers
  const handleExportCSV = async () => {
    try {
      const csvContent = Papa.unparse(
        tableNo === 1
          ? formattedData
          : tableNo === 2
          ? formattedData2
          : tableNo === 3
          ? formattedData3
          : tableNo === 4
          ? formattedData4
          : tableNo === 5
          ? formattedData5
          : formattedData6
      );
      const fileUri = `${FileSystem.documentDirectory}top20_clients.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Share CSV File",
          UTI: "public.comma-separated-values-text",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      Alert.alert("Error", "Failed to export CSV.");
    }
  };
  const handleExportExcel = async () => {
    if (!formattedData || formattedData.length === 0) {
      Alert.alert("No data", "No data available for export.");
      return;
    }

    try {
      const headers = [
        "No",
        "Client Name",
        "Number of Tenders",
        "Total Value (RM)",
      ];
      if (tableNo === 1) {
        const rows = formattedData.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 2) {
        const rows = formattedData2.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 3) {
        const rows = formattedData3.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 4) {
        const rows = formattedData4.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 5) {
        const rows = formattedData5.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else {
        const rows = formattedData6.map((row) => [
          row.no,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      }

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Top20Clients");

      const workbookOutput = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });
      const fileUri = `${FileSystem.documentDirectory}top20_clients.xlsx`;

      await FileSystem.writeAsStringAsync(fileUri, workbookOutput, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Share Excel File",
          UTI: "com.microsoft.excel.xlsx",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      Alert.alert("Error", "Failed to export Excel.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const tableHTML = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <h1>Top 20 Clients - ${year}</h1>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Client Name</th>
                  <th>Number of Tenders</th>
                  <th>Total Value (RM)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  tableNo === 1
                    ? formattedData
                        .map(
                          (row) =>
                            `<tr>
                        <td>${row.no}</td>
                        <td>${row.name}</td>
                        <td>${row.tenderNo}</td>
                        <td>${row.costValue}</td>
                      </tr>`
                        )
                        .join("")
                    : tableNo === 2
                    ? formattedData2
                        .map(
                          (row) =>
                            `<tr>
                          <td>${row.no}</td>
                          <td>${row.name}</td>
                          <td>${row.tenderNo}</td>
                          <td>${row.costValue}</td>
                        </tr>`
                        )
                        .join("")
                    : tableNo === 3
                    ? formattedData3
                        .map(
                          (row) =>
                            `<tr>
                              <td>${row.no}</td>
                              <td>${row.name}</td>
                              <td>${row.tenderNo}</td>
                              <td>${row.costValue}</td>
                            </tr>`
                        )
                        .join("")
                    : tableNo === 4
                    ? formattedData4
                        .map(
                          (row) =>
                            `<tr>
                                  <td>${row.no}</td>
                                  <td>${row.name}</td>
                                  <td>${row.tenderNo}</td>
                                  <td>${row.costValue}</td>
                                </tr>`
                        )
                        .join("")
                    : tableNo === 5
                    ? formattedData5
                        .map(
                          (row) =>
                            `<tr>
                                      <td>${row.no}</td>
                                      <td>${row.name}</td>
                                      <td>${row.tenderNo}</td>
                                      <td>${row.costValue}</td>
                                    </tr>`
                        )
                        .join("")
                    : formattedData6
                        .map(
                          (row) =>
                            `<tr>
                                          <td>${row.no}</td>
                                          <td>${row.name}</td>
                                          <td>${row.tenderNo}</td>
                                          <td>${row.costValue}</td>
                                        </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: tableHTML });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      Alert.alert("Error", "Failed to export PDF.");
    }
  };
  const handlePrint = async () => {
    try {
      const tableHTML = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <h1>Top 20 Clients - ${year}</h1>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Client Name</th>
                  <th>Number of Tenders</th>
                  <th>Total Value (RM)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  tableNo === 1
                    ? formattedData
                        .map(
                          (row) =>
                            `<tr>
                        <td>${row.no}</td>
                        <td>${row.name}</td>
                        <td>${row.tenderNo}</td>
                        <td>${row.costValue}</td>
                      </tr>`
                        )
                        .join("")
                    : tableNo === 2
                    ? formattedData2
                        .map(
                          (row) =>
                            `<tr>
                          <td>${row.no}</td>
                          <td>${row.name}</td>
                          <td>${row.tenderNo}</td>
                          <td>${row.costValue}</td>
                        </tr>`
                        )
                        .join("")
                    : tableNo === 3
                    ? formattedData3
                        .map(
                          (row) =>
                            `<tr>
                              <td>${row.no}</td>
                              <td>${row.name}</td>
                              <td>${row.tenderNo}</td>
                              <td>${row.costValue}</td>
                            </tr>`
                        )
                        .join("")
                    : tableNo === 4
                    ? formattedData4
                        .map(
                          (row) =>
                            `<tr>
                                  <td>${row.no}</td>
                                  <td>${row.name}</td>
                                  <td>${row.tenderNo}</td>
                                  <td>${row.costValue}</td>
                                </tr>`
                        )
                        .join("")
                    : tableNo === 5
                    ? formattedData5
                        .map(
                          (row) =>
                            `<tr>
                                      <td>${row.no}</td>
                                      <td>${row.name}</td>
                                      <td>${row.tenderNo}</td>
                                      <td>${row.costValue}</td>
                                    </tr>`
                        )
                        .join("")
                    : formattedData6
                        .map(
                          (row) =>
                            `<tr>
                                          <td>${row.no}</td>
                                          <td>${row.name}</td>
                                          <td>${row.tenderNo}</td>
                                          <td>${row.costValue}</td>
                                        </tr>`
                        )
                        .join("")
                }
              </tbody>
            </table>
          </body>
        </html>
      `;
      // Print the HTML content
      await Print.printAsync({ html: tableHTML });
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("Error", "Failed to print the content.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={handleExportCSV}>
            <FontAwesome5
              name="file-csv"
              size={20}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportExcel}>
            <FontAwesome5
              name="file-excel"
              size={20}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportPDF}>
            <FontAwesome5
              name="file-pdf"
              size={20}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrint}>
            <Feather
              name="printer"
              size={20}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    height: 40,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 35,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    elevation: 2,
  },
});
