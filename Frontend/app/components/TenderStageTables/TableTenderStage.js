import React, { useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Text, ScrollView,Dimensions } from "react-native";
import _ from "lodash";
import styles from "../Table.style";
import Feather from "@expo/vector-icons/Feather";
const stages = [
  "Prospect",
  "Potential",
  "Best Few",
  "Commitment To Buy",
  "Won",
  "Unsuccessful",
  "Dropped",
];

function TableTenderStage({ columns, data, itemsPerPage = 5, totalTenderValueWon, stage }) {
  // Map column names to keys
  const columnKeyMap = columns.reduce((map, col) => {
    map[col.displayName] = col.dataKey;
    return map;
  }, {});

  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentColumn, setCurrentColumn] = useState(columns[0].displayName);
  const [page, setPage] = useState(1);
  const { width } = Dimensions.get('window'); // Get the screen width
  const isTablet = width >= 600; // Define a threshold for tablets (e.g., 600px)

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
        data,
        [(item) => parseFloat(item[columnKeyMap[column]]) || 0],
        [newDirection === "none" ? undefined : newDirection]
      );

      setSelectedColumn(column);
      setDirection(newDirection);
    },
    [direction, data, columnKeyMap]
  );

  const handleNavigate = (direction) => {
    const currentIndex = columns.findIndex(
      (col) => col.displayName === currentColumn
    );
    const newIndex =
      (currentIndex + (direction === "left" ? -1 : 1) + columns.length) %
      columns.length;
    setCurrentColumn(columns[newIndex].displayName);
  };

  const toggleDropdown = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(data.length / itemsPerPage)) return;
    setPage(newPage);
  };

  const renderTableHeader = useCallback(
    () => (
      <View style={styles.tableHeader}>
        <TouchableOpacity onPress={() => sortTable("Client")}>
          <View>
            <Text style={[styles.columnHeaderName, { fontWeight: "bold" }]}>
              Tender Name
            </Text>
            {selectedColumn === "Client" && direction !== "none" && (
              <Feather
                name={direction === "desc" ? "arrow-down" : "arrow-up"}
                size={16}
                color="black"
                style={[styles.arrowRotation, { marginLeft: 5 }]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sortTable(currentColumn)}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnHeaderTxt}>{currentColumn}</Text>
            {selectedColumn === currentColumn && direction !== "none" && (
              <Feather
                name={direction === "desc" ? "arrow-down" : "arrow-up"}
                size={16}
                color="black"
                style={styles.arrowRotation}
              />
            )}
          </View>
        </TouchableOpacity>

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
    [currentColumn, direction, selectedColumn, columns]
  );

  return (
    <View style={styles.container}>
      {renderTableHeader()}

      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No available data</Text>
        </View>
      ) : (
        paginatedData.map((item, index) => (
          <View key={index}>
            <View style={styles.rowContainer}>
              <Text style={styles.columnRowTxtName}>
                {isTablet ?item.tenderShortname.length > 50
                  ? `${item.tenderShortname.substring(0, 50)}...`
                  : item.tenderShortname : item.tenderShortname.length > 17
                  ? `${item.tenderShortname.substring(0, 17)}...`
                  : item.tenderShortname}
              </Text>

              <Text style={styles.columnRowTxt}>
                {columnKeyMap[currentColumn] &&
                item[columnKeyMap[currentColumn]] !== undefined
                  ? item[columnKeyMap[currentColumn]]
                  : "N/A"}
              </Text>

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

            {expandedRow === index && (
              <View style={styles.dropdownContainer}>
                {columns.map((col, colIndex) => (
                  <View key={colIndex} style={styles.detailColumn}>
                    <Text style={styles.labelText}>{col.displayName}:</Text>
                    <Text style={styles.dropdownText}>
                      {item[col.dataKey] || "N/A"}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))
      )}

      {data.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>
            Page {page} of {Math.ceil(data.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            onPress={() => handlePageChange(page + 1)}
            disabled={page === Math.ceil(data.length / itemsPerPage)}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.dropdownContainer}>
        <View style={styles.detailColumn}>
          <Text style={styles.labelText}>Total Tender Value {stages[stage-1]}:</Text>
          <Text style={styles.valueText}>{totalTenderValueWon}</Text>
        </View>
      </View>
    </View>
  );
}

export default TableTenderStage;
