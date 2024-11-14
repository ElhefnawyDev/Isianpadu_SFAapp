import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, TouchableOpacity, FlatList, Text } from "react-native";
import _ from "lodash";
import styles from "./Table.style";
import Feather from "@expo/vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";

function TableDashboard({ data, totalSubmission, totalCost }) {
  const columns = useMemo(
    () => ["Total Value Cost (RM)", "Total Number of Tender"],
    []
  );

  const fixedColumn = useMemo(() => ["Client Name"], []);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentColumn, setCurrentColumn] = useState(columns[0]);
  const [expandedRow, setExpandedRow] = useState(null); // State to track expanded row
  const [page, setPage] = useState(1); // Track the current page
  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const sortTable = useCallback(
    (column) => {
      let newDirection;

      // Toggle through three states: 'desc', 'asc', 'none'
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
              return item.name.toLowerCase(); // Alphabetical sorting
            }
            return column === "Total Value Cost (RM)"
              ? parseFloat(item.costValue) // Numeric sorting
              : parseInt(item.tenderNo); // Numeric sorting
          },
        ],
        [newDirection === "none" ? undefined : newDirection] // Ensure sorting only if it's not 'none'
      );

      setSelectedColumn(column);
      setDirection(newDirection);
      setTableData(sortedData);
    },
    [direction, tableData]
  );

  const arrowRotation = useMemo(() => ({}), [direction]);

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

  // Pagination Logic
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
              Client Name
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
          <TouchableOpacity onPress={() => handleNavigate("left")}>
            <Feather name="arrow-left-circle" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate("right")}>
            <Feather name="arrow-right-circle" size={30} color="black" />
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
  
        {/* Render Data Rows */}
        {paginatedData.map((item, index) => (
          <View key={index}>
            <View style={styles.rowContainer}>
              {/* Fixed Column for Client Name with truncated name */}
              <Text style={styles.columnRowTxtName}>
                {item.name.length > 17
                  ? `${item.name.substring(0, 17)}...`
                  : item.name}
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
                    color="black"
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
        ))}
  
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
