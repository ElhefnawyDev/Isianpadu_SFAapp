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
  filteredData,
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
 

  // Export handlers
  const handleExportCSV = async () => {
    try {
      const data = filteredData || []; // Use filteredData instead of fetching
      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }

      const csvContent = Papa.unparse(
        tableNo === 1
          ? data
          : tableNo === 2
          ? data
          : tableNo === 3
          ? data
          : tableNo === 4
          ? data
          : tableNo === 5
          ? data
          : data
      );
      const fileUri = `${FileSystem.documentDirectory}Top_Clients_Categories.csv`;
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
    const data = filteredData || []; // Use filteredData instead of fetching

    if (data.length === 0) {
      alert("No data available for the current view!");
      return;
    }

    try {
      const headers = [
        "No",
        "Client Name",
        "Number of Tenders",
        "Total Value (RM)",
      ];
      let rows = []; // Declare rows here

      if (tableNo === 1) {
        rows = data.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 2) {
        rows = data.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 3) {
        rows = formattedData3.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 4) {
        rows = formattedData4.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else if (tableNo === 5) {
        rows = formattedData5.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      } else {
        rows = formattedData6.map((row, index) => [
          index + 1,
          row.name,
          row.tenderNo,
          row.costValue,
        ]);
      }

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TopClientsCategories");

      const workbookOutput = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });
      const fileUri = `${FileSystem.documentDirectory}Top_Clients_Categories.xlsx`;

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
      const data = filteredData || []; // Use filteredData instead of fetching
      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }
      // Process data dynamically

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
            <h1>${tableNo === 1 ? "Top 20 Clients" : tableNo === 2 ? "Top Client (Won)" : tableNo === 3 ? "Top Client (Prospect)" : tableNo === 4 ? "Top Category" :  tableNo === 5 ? "Top Category (Prospect)" : "Top Category (Won)"} - ${year}</h1>
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
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                        <td>${index + 1}</td>
                        <td>${row.name}</td>
                        <td>${row.tenderNo}</td>
                        <td>${row.costValue}</td>
                      </tr>`
                        )
                        .join("")
                    : tableNo === 2
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                          <td>${index + 1}</td>
                          <td>${row.name}</td>
                          <td>${row.tenderNo}</td>
                          <td>${row.costValue}</td>
                        </tr>`
                        )
                        .join("")
                    : tableNo === 3
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                              <td>${index + 1}</td>
                              <td>${row.name}</td>
                              <td>${row.tenderNo}</td>
                              <td>${row.costValue}</td>
                            </tr>`
                        )
                        .join("")
                    : tableNo === 4
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                                  <td>${index + 1}</td>
                                  <td>${row.name}</td>
                                  <td>${row.tenderNo}</td>
                                  <td>${row.costValue}</td>
                                </tr>`
                        )
                        .join("")
                    : tableNo === 5
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                                      <td>${index + 1}</td>
                                      <td>${row.name}</td>
                                      <td>${row.tenderNo}</td>
                                      <td>${row.costValue}</td>
                                    </tr>`
                        )
                        .join("")
                    : data
                        .map(
                          (row, index) =>
                            `<tr>
                                          <td>${index + 1}</td>
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
      const data = filteredData || []; // Use filteredData instead of fetching
      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }
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
            <h1>${tableNo === 1 ? "Top 20 Clients" : tableNo === 2 ? "Top Client (Won)" : tableNo === 3 ? "Top Client (Prospect)" : tableNo === 4 ? "Top Category" :  tableNo === 5 ? "Top Category (Prospect)" : "Top Category (Won)"} - ${year}</h1>
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
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                        <td>${index + 1}</td>
                        <td>${row.name}</td>
                        <td>${row.tenderNo}</td>
                        <td>${row.costValue}</td>
                      </tr>`
                        )
                        .join("")
                    : tableNo === 2
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                          <td>${index + 1}</td>
                          <td>${row.name}</td>
                          <td>${row.tenderNo}</td>
                          <td>${row.costValue}</td>
                        </tr>`
                        )
                        .join("")
                    : tableNo === 3
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                              <td>${index + 1}</td>
                              <td>${row.name}</td>
                              <td>${row.tenderNo}</td>
                              <td>${row.costValue}</td>
                            </tr>`
                        )
                        .join("")
                    : tableNo === 4
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                                  <td>${index + 1}</td>
                                  <td>${row.name}</td>
                                  <td>${row.tenderNo}</td>
                                  <td>${row.costValue}</td>
                                </tr>`
                        )
                        .join("")
                    : tableNo === 5
                    ? data
                        .map(
                          (row, index) =>
                            `<tr>
                                      <td>${index + 1}</td>
                                      <td>${row.name}</td>
                                      <td>${row.tenderNo}</td>
                                      <td>${row.costValue}</td>
                                    </tr>`
                        )
                        .join("")
                    : data
                        .map(
                          (row, index) =>
                            `<tr>
                                          <td>${index + 1}</td>
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
