import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { API_URL } from "../../env";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import Papa from "papaparse";

// Map stage number to columns
const columnsMapping = {
  1: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  2: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  3: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  4: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  5: [
    { displayName: "No", dataKey: "no" },
    { displayName: "LOA Date", dataKey: "loaDate" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  6: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
  7: [
    { displayName: "No", dataKey: "no" },
    { displayName: "Tender Name", dataKey: "tenderShortname" },
    { displayName: "Client", dataKey: "clientName" },
    { displayName: "Category", dataKey: "tenderCategory" },
    { displayName: "Expected Close Date", dataKey: "deadline" },
    { displayName: "Total Tender Value (RM)", dataKey: "tenderValue" },
    { displayName: "Total Tender Cost (RM)", dataKey: "tenderCost" },
    { displayName: "Margin %", dataKey: "marginPercentage" },
    { displayName: "Margin Value (RM)", dataKey: "marginValue" },
    { displayName: "Sales Person", dataKey: "salesPerson" },
    { displayName: "Status", dataKey: "status" },
  ],
};

export default function TableIcons({ selectedStage, searchQuery, setSearchQuery, filteredData }) {
  
  const handleExportPDF = async () => {
    try {
      const data = filteredData || []; // Use filteredData instead of fetching

      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }

      const currentColumns = columnsMapping[selectedStage] || columnsMapping[1];

      // Process data dynamically
      const processedData = data.map((item, index) => {
        const tenderValue = parseFloat(
          item.tenderValue?.replace(/,/g, "") || 0
        );
        const tenderCost = parseFloat(item.tenderCost?.replace(/,/g, "") || 0);
        const marginValue = currentColumns.some(
          (col) => col.dataKey === "marginValue"
        )
          ? tenderValue - tenderCost
          : null;
        const marginPercentage = currentColumns.some(
          (col) => col.dataKey === "marginPercentage"
        )
          ? tenderValue !== 0
            ? (marginValue / tenderValue) * 100
            : 0
          : null;

        return {
          no: index + 1,
          ...item,
          marginValue: marginValue
            ? marginValue.toLocaleString("en-MY", {
                style: "currency",
                currency: "MYR",
              })
            : null,
          marginPercentage:
            marginPercentage !== null
              ? `${marginPercentage.toFixed(2)}%`
              : null,
          loaDate: item.loaDate
            ? new Date(item.loaDate).toLocaleDateString("en-GB")
            : "Please Update",
        };
      });

      // Generate HTML for the PDF
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
            <h1>Tender Stage: ${
              selectedStage == 1
                ? "Prospect"
                : selectedStage == 2
                ? "Potential"
                : selectedStage == 3
                ? "Best Few"
                : selectedStage == 4
                ? "Commitment To Buy"
                : selectedStage == 5
                ? "Won"
                : selectedStage == 6
                ? "Unsuccessful"
                : "Dropped"
            }</h1>
            <table>
              <thead>
                <tr>
                  ${currentColumns
                    .map((col) => `<th>${col.displayName}</th>`)
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${processedData
                  .map(
                    (row) =>
                      `<tr>${currentColumns
                        .map((col) => `<td>${row[col.dataKey] || "N/A"}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Generate and share the PDF
      const { uri } = await Print.printToFileAsync({ html: tableHTML });
      console.log("Generated PDF URI:", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing is not available on this device!");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = filteredData || []; // Use filteredData instead of fetching

      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }

      // Prepare data for CSV
      const currentColumns = columnsMapping[selectedStage] || columnsMapping[1];

      const processedData = data.map((item, index) => {
        const tenderValue = parseFloat(
          item.tenderValue?.replace(/,/g, "") || 0
        );
        const tenderCost = parseFloat(item.tenderCost?.replace(/,/g, "") || 0);
        const marginValue = currentColumns.some(
          (col) => col.dataKey === "marginValue"
        )
          ? tenderValue - tenderCost
          : null;
        const marginPercentage = currentColumns.some(
          (col) => col.dataKey === "marginPercentage"
        )
          ? tenderValue !== 0
            ? (marginValue / tenderValue) * 100
            : 0
          : null;

        return {
          no: index + 1,
          tenderShortname: item.tenderShortname || "N/A",
          clientName: item.clientName || "N/A",
          tenderCategory: item.tenderCategory || "N/A",
          deadline: item.deadline || "N/A",
          tenderValue: tenderValue.toLocaleString("en-MY", {
            minimumFractionDigits: 2,
          }),
          tenderCost: tenderCost.toLocaleString("en-MY", {
            minimumFractionDigits: 2,
          }),
          marginValue:
            marginValue !== null
              ? marginValue.toLocaleString("en-MY", {
                  style: "currency",
                  currency: "MYR",
                })
              : "N/A",
          marginPercentage:
            marginPercentage !== null
              ? `${marginPercentage.toFixed(2)}%`
              : "N/A",
          loaDate: item.loaDate
            ? new Date(item.loaDate).toLocaleDateString("en-GB")
            : "Please Update",
          salesPerson: item.salesPerson || "Not Specified",
          status: item.status || "N/A",
        };
      });

      // Convert the data to CSV
      const csvContent = Papa.unparse({
        fields: currentColumns.map((col) => col.displayName), // Headers
        data: processedData.map((row) =>
          currentColumns.map((col) => row[col.dataKey] || "N/A")
        ), // Rows
      });

      // Save the CSV file
      const fileUri = `${FileSystem.documentDirectory}tenders.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the CSV file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Share CSV File",
          UTI: "public.comma-separated-values-text",
        });
      } else {
        alert("Sharing is not available on this device!");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const data = filteredData || []; // Use filteredData instead of fetching
  
      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }
  
      // Prepare data for Excel
      const currentColumns = columnsMapping[selectedStage] || columnsMapping[1];
      const headers = currentColumns.map((col) => col.displayName);
  
      // Add row numbers dynamically for the "No" column
      const rows = data.map((item, index) =>
        currentColumns.map((col) =>
          col.dataKey === "no" ? index + 1 : item[col.dataKey] || "N/A"
        )
      );
  
      const sheetData = [headers, ...rows]; // Combine headers and rows
  
      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tenders");
  
      // Write the workbook to binary
      const workbookOutput = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });
  
      // Save to file system
      const fileUri = `${FileSystem.documentDirectory}tenders.xlsx`;
  
      await FileSystem.writeAsStringAsync(fileUri, workbookOutput, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Share Excel File",
          UTI: "com.microsoft.excel.xlsx",
        });
      } else {
        alert("Sharing is not available on this device!");
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Failed to export Excel.");
    }
  };
  
  const handlePrint = async () => {
    try {
      const data = filteredData || []; // Use filteredData instead of fetching
  
      if (data.length === 0) {
        alert("No data available for the current view!");
        return;
      }
  
      // Add numbering dynamically to each row
      const numberedData = data.map((item, index) => ({
        no: index + 1, // Add the "No" field
        ...item, // Include the rest of the row data
      }));
  
      // Prepare printable HTML content
      const currentColumns = columnsMapping[selectedStage] || columnsMapping[1];
  
      const headers = currentColumns
        .map((col) => `<th>${col.displayName}</th>`)
        .join("");
  
      const rows = numberedData
        .map(
          (item) =>
            `<tr>${currentColumns
              .map((col) => `<td>${item[col.dataKey] || "N/A"}</td>`)
              .join("")}</tr>`
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
            <h1>Tender Stage: ${
              selectedStage == 1
                ? "Prospect"
                : selectedStage == 2
                ? "Potential"
                : selectedStage == 3
                ? "Best Few"
                : selectedStage == 4
                ? "Commitment To Buy"
                : selectedStage == 5
                ? "Won"
                : selectedStage == 6
                ? "Unsuccessful"
                : "Dropped"
            }</h1>
            <table>
              <thead>
                <tr>
                  ${headers}
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </body>
        </html>
      `;
  
      // Print the content
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print the content.");
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Search Bar with Icons */}
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
    width: "100%",
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
    height:35,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
});
