import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import TaskCard from "../components/taskCard.js"; // Adjust the path if needed
import { API_URL } from "../../env.js";
import { Dimensions } from 'react-native';

const Calendar = () => {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/sfa_eventCalendar`);
        const data = await response.json();
        console.log("API Response:", data);

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
      }
    };

    fetchEvents();
  }, []);

  // Handle date selection
  const onDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedEvents(events[date] || []); // Get events for the selected date or empty array if none
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <RNCalendar
          onDayPress={(day) => onDateSelect(day.dateString)}
          markedDates={{
            ...Object.keys(events).reduce((acc, date) => {
              acc[date] = { marked: true, dotColor: "blue" };
              return acc;
            }, {}),
            [selectedDate]: { selected: true, selectedColor: "#00adf5", selectedTextColor: "#ffffff" },
          }}
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
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

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
});

export default Calendar;
