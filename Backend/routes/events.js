import express from "express";
import { PrismaClient } from "@prisma/client";

const eventCalendar = express.Router();
eventCalendar.use(express.json());
const prisma = new PrismaClient();

eventCalendar.get("/sfa_eventCalendar", async (req, res) => {
  try {
    const events = await prisma.sfa_calendar.findMany();

        // Transform event data
        const transformedEvents = events.map((event) => ({
            event_id: event.event_id,
            event_name: event.event_name,
            event_date: event.event_date.toISOString().split("T")[0], // format date as YYYY-MM-DD
            event_time: new Date(event.event_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }), // format time as HH:MM
            event_desc: event.event_desc,
          }));
    console.log(events);
    res.send({ success: true, events: transformedEvents });
    
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch sfa_calendar data" });
  }
});

export default eventCalendar;
