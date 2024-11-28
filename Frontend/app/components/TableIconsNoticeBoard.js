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
  export default function TableIconsNoticeBoard({
    searchQuery,
    setSearchQuery,
    filteredData, // Use filteredData directly
  }) {
    // Export CSV
    const handleExportCSV = async () => {
      if (!filteredData || filteredData.length === 0) {
        Alert.alert("No data", "No data available for export.");
        return;
      }
  
      try {
        const csvContent = Papa.unparse(filteredData);
  
        const fileUri = `${FileSystem.documentDirectory}NoticeBoard.csv`;
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
    
  // Export Excel
  const handleExportExcel = async () => {
    if (!filteredData || filteredData.length === 0) {
      Alert.alert("No data", "No data available for export.");
      return;
    }

    try {
      const headers = [
        "No",
        "Submission Method",
        "Submission Type",
        "Brief Date",
        "Deadline",
        "Sales Person",
        "Pre Sales",
        "Sales Admin",
        "Remarks",
      ];

      const rows = filteredData.map((item, index) => [
        index + 1,
        item.submissionMethod || "N/A",
        item.submissionType || "N/A",
        item.briefDate || "N/A",
        item.deadline || "N/A",
        item.salesPerson || "N/A",
        item.preSales || "N/A",
        item.salesAdmin || "N/A",
        item.remarks || "N/A",
      ]);

      const sheetData = [headers, ...rows];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "NoticeBoard");

      const workbookOutput = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });
      const fileUri = `${FileSystem.documentDirectory}NoticeBoard.xlsx`;

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

  
  // Export PDF
  const handleExportPDF = async () => {
    if (!filteredData || filteredData.length === 0) {
      Alert.alert("No data", "No data available for export.");
      return;
    }

    try {
      const headers = `
        <tr>
          <th>No</th>
          <th>Submission Method</th>
          <th>Submission Type</th>
          <th>Brief Date</th>
          <th>Deadline</th>
          <th>Sales Person</th>
          <th>Pre Sales</th>
          <th>Sales Admin</th>
          <th>Remarks</th>
        </tr>
      `;

      const rows = filteredData
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.submissionMethod || "N/A"}</td>
            <td>${item.submissionType || "N/A"}</td>
            <td>${item.briefDate || "N/A"}</td>
            <td>${item.deadline || "N/A"}</td>
            <td>${item.salesPerson || "N/A"}</td>
            <td>${item.preSales || "N/A"}</td>
            <td>${item.salesAdmin || "N/A"}</td>
            <td>${item.remarks || "N/A"}</td>
          </tr>
        `
        )
        .join("");

      const htmlContent = `
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
            <h1>Notice Board</h1>
            <table>
              <thead>${headers}</thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
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


  // Print
  const handlePrint = async () => {
    if (!filteredData || filteredData.length === 0) {
      Alert.alert("No data", "No data available for printing.");
      return;
    }

    try {
      const headers = `
        <tr>
          <th>No</th>
          <th>Submission Method</th>
          <th>Submission Type</th>
          <th>Brief Date</th>
          <th>Deadline</th>
          <th>Sales Person</th>
          <th>Pre Sales</th>
          <th>Sales Admin</th>
          <th>Remarks</th>
        </tr>
      `;

      const rows = filteredData
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.submissionMethod || "N/A"}</td>
            <td>${item.submissionType || "N/A"}</td>
            <td>${item.briefDate || "N/A"}</td>
            <td>${item.deadline || "N/A"}</td>
            <td>${item.salesPerson || "N/A"}</td>
            <td>${item.preSales || "N/A"}</td>
            <td>${item.salesAdmin || "N/A"}</td>
            <td>${item.remarks || "N/A"}</td>
          </tr>
        `
        )
        .join("");

      const htmlContent = `
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
            <h1>Notice Board</h1>
            <table>
              <thead>${headers}</thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>
      `;

      await Print.printAsync({ html: htmlContent });
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
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportExcel}>
              <FontAwesome5
                name="file-excel"
                size={20}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportPDF}>
              <FontAwesome5
                name="file-pdf"
                size={20}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrint}>
              <Feather
                name="printer"
                size={20}
                color="white"
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
