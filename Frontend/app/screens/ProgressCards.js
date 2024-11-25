import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ProgressCard from "../components/ProgressCard";
import { API_URL } from "../../env.js";
function ProgressCards({ year }) {
  const [todaySubmission, setTodaySubmission] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [haedwareTender, setHaedwareTender] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [maintenanceTender, setMaintenanceTender] = useState(0);
  const [ictInfra, setIctInfra] = useState(0);
  const [mixedTender, setMixedTender] = useState(0);
  const [networkTender, setNetworkTender] = useState(0);
  const [softwareTender, setSoftwareTender] = useState(0);
  const [systemTender, setSystemTender] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/sfa_tender`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const info = await res.json();

        if (info.success && Array.isArray(info.tenders)) {
          const filteredData = info.tenders;

          // Total Today's Submission
          const todayDate = new Date().toISOString().split("T")[0];
          const todaySubmissionCount = filteredData.filter(
            (item) =>
              item.deadline === todayDate && item.display_notice_id === 1
          ).length;
          setTodaySubmission(todaySubmissionCount);
          console.log(todaySubmissionCount);

          // Total Submission
          const totalSubmissionCount = filteredData.filter(
            (item) =>
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setEntryCount(totalSubmissionCount);

          // Total Tender Entry
          const entryCount = filteredData.filter(
            (item) =>
              item.id_sfa_stages !== 1 &&
              item.id_sfa_stages !== 7 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setEntryCount(entryCount);

          // Total Won Tender
          const wonCount = filteredData.filter(
            (item) =>
              item.id_sfa_stages === 5 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setTotalWon(wonCount);

          // Total Application Tender
          const applicationCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 1 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setTotalApplication(applicationCount);

          // Total Mixed Tender
          const mixedTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 2 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setMixedTender(mixedTenderCount);

          // Total Hardware Tender
          const hardwareTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 3 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setHaedwareTender(hardwareTenderCount);

          // Total Maintenance Tender
          const maintenanceTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 4 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setMaintenanceTender(maintenanceTenderCount);

          // Total Network Tender
          const networkTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 5 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setNetworkTender(networkTenderCount);

          // Total ICT Infra Tender
          const ictInfraCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 6 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setIctInfra(ictInfraCount);

          // Total System Tender
          const systemTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 7 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setSystemTender(systemTenderCount);

          // Total Software Tender
          const softwareTenderCount = filteredData.filter(
            (item) =>
              item.id_sfa_tender_category === 8 &&
              item.delete_id === 0 &&
              new Date(item.deadline).getFullYear() === year
          ).length;
          setSoftwareTender(softwareTenderCount);
        } else {
          console.error("API returned data in unexpected format:", info);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);
  const ProgressCardData = [
    {
      title: "Total today's submission",
      num: todaySubmission,
      icon: "document-text",
      ids: 0,
    },
    {
      title: "Total Tender Entry",
      num: entryCount,
      icon: "enter-outline",
      ids: 1,
    },
    {
      title: "Total Won Tender",
      num: totalWon,
      icon: "bookmark-outline",
      ids: 2,
    },
    {
      title: "Total Hardware Tender",
      num: haedwareTender,
      icon: "hardware-chip-outline",
      ids: 3,
    },
    {
      title: "Total Application Tender",
      num: totalApplication,
      icon: "tv-outline",
      ids: 0,
    },
    {
      title: "Total Maintenance Tender",
      num: maintenanceTender,
      icon: "settings-outline",
      ids: 1,
    },
    {
      title: "Total ICT Infra Tender",
      num: ictInfra,
      icon: "globe-outline",
      ids: 2,
    },
    {
      title: "Total Mixed Tender",
      num: mixedTender,
      icon: "sync-outline",
      ids: 3,
    },
    {
      title: "Total Network Tender",
      num: networkTender,
      icon: "file-tray-stacked",
      ids: 0,
    },
    {
      title: "Total Software Tender",
      num: softwareTender,
      icon: "terminal-outline",
      ids: 1,
    },
    {
      title: "Total System Tender",
      num: systemTender,
      icon: "browsers-outline",
      ids: 2,
    },
  ];
  const areAllZero = ProgressCardData.every((item) => item.num === 0);

  return (
    <View>
      {areAllZero ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.textData}>No data available</Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {ProgressCardData.map((item, index) => (
            <View key={index} style={styles.gridItem}>

                <ProgressCard
                  title={item.title}
                  num={item.num}
                  icon={item.icon}
                  ids={item.ids}
                />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  gridItem: {
    width: "45%",
    height: 100,
    margin: 5,
  },
  emptyContainer: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    height:200,
    backgroundColor:"white",
    marginHorizontal: 10,
    borderRadius:25,
  },
  textData: {
    fontSize: 20, // Optional: Adjust font size for better readability
    textAlign: "center",
    color:"gray"
  },
});


export default ProgressCards;
