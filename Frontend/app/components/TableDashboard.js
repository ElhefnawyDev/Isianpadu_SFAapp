import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Text, ScrollView, Dimensions } from "react-native";
import _ from "lodash";
import styles from "./Table.style";
import Feather from "@expo/vector-icons/Feather";

function TableDashboard({ data, totalSubmission, totalCost, column, type }) {
  const columns = useMemo(() => column || [], [column]);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentColumn, setCurrentColumn] = useState(columns[0] || ""); // Default to the first column
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const { width } = Dimensions.get('window'); // Get the screen width
  const isTablet = width >= 600; // Define a threshold for tablets (e.g., 600px)

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const sortTable = useCallback(
    (column) => {
      let newDirection;

      if (direction === "desc") {
        newDirection = "asc";
      } else if (direction === "asc") {
        newDirection = "none";
      } else {
        newDirection = "desc";
      }

      const sortedData = _.orderBy(
        tableData,
        [
          (item) => {
            if (column === "Client Name") {
              return item.name.toLowerCase();
            }
            return parseFloat(item[column]) || 0; // Dynamically access column data
          },
        ],
        [newDirection === "none" ? undefined : newDirection]
      );

      setSelectedColumn(column);
      setDirection(newDirection);
      setTableData(sortedData);
    },
    [direction, tableData]
  );

  const handleNavigate = (direction) => {
    const currentIndex = columns.indexOf(currentColumn);
    const newIndex =
      (currentIndex + (direction === "left" ? -1 : 1) + columns.length) %
      columns.length;
    setCurrentColumn(columns[newIndex]);
  };

  const toggleDropdown = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(tableData.length / itemsPerPage))
      return;
    setPage(newPage);
  };

  const renderTableHeader = useCallback(
    () => (
      <View style={styles.tableHeader}>
        {/* Client Name Header */}
        <TouchableOpacity onPress={() => sortTable("Client Name")}>
          <View>
            <Text style={[styles.columnHeaderName, { fontWeight: "bold" }]}>
              {type===1 ? "Client Name:" : "Top Category:"}
            </Text>
            {selectedColumn === "Client Name" && direction !== "none" && (
              <Feather
                name={direction === "desc" ? "arrow-down" : "arrow-up"}
                size={16}
                color="black"
                style={[arrowRotation, { marginLeft: 5 }]} // Add marginLeft to the arrow for fine control
              />
            )}
          </View>
        </TouchableOpacity>

        {/* Total Value Cost (RM) Header */}
        <TouchableOpacity onPress={() => sortTable("Total Value Cost (RM)")}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnHeaderTxt}>{currentColumn}</Text>
            {selectedColumn === "Total Value Cost (RM)" &&
              direction !== "none" && (
                <Feather
                  name={direction === "desc" ? "arrow-down" : "arrow-up"}
                  size={16}
                  color="black"
                  style={arrowRotation}
                />
              )}
          </View>
        </TouchableOpacity>

        {/* Navigation Header */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigate("left")}
          >
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigate("right")}
          >
            <Feather name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [currentColumn, direction, selectedColumn]
  );
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Table Header */}
        {renderTableHeader()}
  
        {/* Check if there is no data */}
        {tableData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No available data</Text>
          </View>
        ) : (
          /* Render Data Rows */
          paginatedData.map((item, index) => (
            <View key={index}>
              <View style={styles.rowContainer}>
                {/* Fixed Column for Client Name with truncated name */}
                <Text style={styles.columnRowTxtName}>
                  {isTablet ?item.name.length > 50
                    ? `${item.name.substring(0, 50)}...`
                    : item.name : item.name.length > 17
                    ? `${item.name.substring(0, 17)}...`
                    : item.name }
                </Text>
  
                {/* Dynamic Column for Cost/Tender */}
                <Text style={styles.columnRowTxt}>
                  {currentColumn === "Total Value Cost (RM)"
                    ? item.costValue
                    : item.tenderNo}
                </Text>
  
                {/* Button to Toggle Dropdown */}
                <View style={styles.navigationContainerChild}>
                  <TouchableOpacity onPress={() => toggleDropdown(index)}>
                    <Feather
                      name={expandedRow === index ? "eye-off" : "eye"}
                      size={24}
                      color="#807A7A"
                    />
                  </TouchableOpacity>
                </View>
              </View>
  
              {/* Dropdown Content */}
              {expandedRow === index && (
                <View style={styles.dropdownContainer}>
                  <View style={styles.detailColumn}>
                    <Text style={styles.labelText}>Client Name:</Text>
                    <Text style={styles.valueText}>{item.name}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                    <Text style={styles.labelText}>Total Value Cost RM:</Text>
                    <Text style={styles.valueText}>{item.costValue}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                    <Text style={styles.labelText}>Total Number of Tender:</Text>
                    <Text style={styles.valueText}>{item.tenderNo}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
  
        {/* Pagination Controls Below the Table */}
        {tableData.length > itemsPerPage && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={styles.pageButton}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Page {page} of {Math.ceil(tableData.length / itemsPerPage)}
            </Text>
            <TouchableOpacity
              onPress={() => handlePageChange(page + 1)}
              disabled={page === Math.ceil(tableData.length / itemsPerPage)}
              style={styles.pageButton}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {/* Total Submission and Total Cost */}
        {totalSubmission && totalCost ? (
          <View style={styles.dropdownContainer}>
            <View style={styles.detailColumn}>
              <Text style={styles.labelText}>Total Value of Cost:</Text>
              <Text style={styles.valueText}>{totalCost}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.labelText}>Total Number of Tender:</Text>
              <Text style={styles.valueText}>{totalSubmission}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
  
}

export default TableDashboard;
