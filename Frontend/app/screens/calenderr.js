import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import TaskCard from "../components/taskCard.js"; // Adjust the path if needed
import { API_URL } from "../../env.js";
import { Dimensions } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext"; // Import AuthContext

const Calendar = () => {
  const [events, setEvents] = useState({});
  const [deadlines, setDeadlines] = useState({}); // State to hold deadlines
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const { userInfo } = useContext(AuthContext); // Access userInfo from AuthContext

  // Fetch existing calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true); // Set loading to true
      try {
        const response = await fetch(`${API_URL}/sfa_eventCalendar`);
        const data = await response.json();

        if (data.success) {
          // Transform the events into a suitable format for the calendar
          const formattedEvents = data.events.reduce((acc, event) => {
            const date = event.event_date; // Assuming date is already in YYYY-MM-DD format
            const eventItem = {
              time: event.event_time, // Use the string format as it is
              title: event.event_name,
              description: event.event_desc,
            };

            if (acc[date]) {
              acc[date].push(eventItem);
            } else {
              acc[date] = [eventItem];
            }
            return acc;
          }, {});

          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, []);

  // Fetch tender deadlines for the current user
  useEffect(() => {
    const fetchTenderDeadlines = async () => {
      if (!userInfo?.user?.user_id) return; // Ensure user_id exists
      setIsLoading(true); // Set loading to true

      try {
        const response = await fetch(`${API_URL}/sfa_tender`);
        const data = await response.json();

        if (data.success) {
          const currentUserId = userInfo.user.id_profile;

          // Filter tenders for the current user and format deadlines
          const tenderDeadlines = data.tenders.reduce((acc, tender) => {
            if (
              tender.id_adm_profileSP === currentUserId &&
              tender.deadline && // Ensure deadline is not null
              tender.deadline !== "null" // Ensure deadline is not "null" as a string
            ) {
              const date = tender.deadline.split("T")[0]; // Extract YYYY-MM-DD
              const eventItem = {
                time: "Deadline", // Label for tender deadlines
                title: tender.tender_shortname,
                description: `Tender deadline: ${tender.deadline}`,
              };

              if (acc[date]) {
                acc[date].push(eventItem);
              } else {
                acc[date] = [eventItem];
              }
            } else {
              console.warn("Skipping tender with invalid deadline:", tender);
            }
            return acc;
          }, {});

          setDeadlines(tenderDeadlines); // Set deadlines separately from events
        }
      } catch (error) {
        console.error("Failed to fetch tenders:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchTenderDeadlines();
  }, [userInfo]);

  // Handle date selection
  const onDateSelect = (date) => {
    setSelectedDate(date);

    // Combine events and deadlines for the selected date
    const combinedEvents = [...(events[date] || []), ...(deadlines[date] || [])];
    setSelectedEvents(combinedEvents);
  };

  // Generate marked dates for the calendar
  const markedDates = {
    ...Object.keys(events).reduce((acc, date) => {
      acc[date] = { marked: true, dotColor: "blue" }; // Blue for regular events
      return acc;
    }, {}),
    ...Object.keys(deadlines).reduce((acc, date) => {
      acc[date] = { marked: true, dotColor: "red" }; // Red for deadlines
      return acc;
    }, {}),
    ...(selectedDate
      ? { [selectedDate]: { selected: true, selectedColor: "#00adf5", selectedTextColor: "#ffffff" } }
      : {}),
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00adf5" style={styles.loader} />
      ) : (
        <>
          <View style={styles.calendarContainer}>
            <RNCalendar
              onDayPress={(day) => onDateSelect(day.dateString)}
              markedDates={markedDates} // Use marked dates
              theme={{
                calendarBackground: "#f5f7fa",
                dayTextColor: "#000000",
                monthTextColor: "#333333",
                arrowColor: "#00adf5",
                todayTextColor: "#00adf5",
              }}
              style={{
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
          <View style={styles.eventContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((item, index) => (
                  <TaskCard
                    key={index}
                    time={item.time}
                    title={item.title}
                    description={item.description}
                  />
                ))
              ) : (
                <Text style={styles.noEventText}>No events for this date</Text>
              )}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    width: screenWidth,
  },
  calendarContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    margin: 10,
  },
  eventContainer: {
    flex: 1,
    padding: 10,
  },
  noEventText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20, // Add some padding to the bottom if needed
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Calendar;
