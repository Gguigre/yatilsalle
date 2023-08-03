import axios from "axios";

export const getTimeUntilNextBooking = async (access_token, room) => {
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours later
  
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/freeBusy",
      {
        timeMin: timeMin,
        timeMax: timeMax,
        items: [{ id: room.resourceEmail }],
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // Calculate time until next booking
    const busyTimes = response.data.calendars[room.resourceEmail].busy;
    if (busyTimes.length === 0) {
      // The room is free for the next 24 hours
      return Infinity;
    } else {
      // The room is booked, calculate time until next booking
      const nextBookingStart = new Date(busyTimes[0].start);
      return (nextBookingStart - now) / (60 * 1000); // Time until next booking in minutes
    }
  };