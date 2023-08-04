import axios from "axios";

export const getResources = async (access_token) => {
    console.info("Retrieving resources...");
    const response = await axios.get(
      "https://admin.googleapis.com/admin/directory/v1/customer/my_customer/resources/calendars",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.info("Resources retrieved : ", response.data);
  
    // Filtrer pour ne garder que les salles de conférence
    const conferenceRooms = response.data.items.filter(
      (item) => item.capacity > 0
    );
  
    return conferenceRooms;
  };