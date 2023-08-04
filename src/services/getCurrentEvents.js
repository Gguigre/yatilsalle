import axios from "axios";

export const getCurrentEvents = async (access_token) => {
  const now = new Date();
  const response = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${new Date(
      now.getTime() + 15 * 60 * 1000
    ).toISOString()}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const events = response.data.items;
  return events
};
