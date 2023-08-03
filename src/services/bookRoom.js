import axios from "axios";

export const bookRoom = async (access_token, room, start, end, summary) => {
  const response = await axios.post(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      start: { dateTime: start },
      end: { dateTime: end },
      summary: summary,
      attendees: [
        {
          email: room,
          resource: true,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};
