import axios from "axios";

export const updateEvent = async (
  access_token,
  currentEvent,
  roomEmail
) => {
  const response = await axios.put(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${currentEvent.id}`,
    {
      start: currentEvent.start,
      end: currentEvent.end,
      attendees: [
        ...(currentEvent.attendees ?? []),
        {
          email: roomEmail,
          resource: true,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
