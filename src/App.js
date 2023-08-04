import React, { useEffect, useState } from "react";
import "./App.css";
import { CurrentEvent } from "./components/CurrentEvent";
import { Room } from "./components/Room";
import { useGoogleAuthClient } from "./hooks/useGoogleAuth";
import { bookRoom } from "./services/bookRoom";
import { getCurrentEvents } from "./services/getCurrentEvents";
import { getResources } from "./services/getResources";
import { getTimeUntilNextBooking } from "./services/getTimeUntilNextBooking";
import { getUserEmail } from "./services/getUserEmail";

function App() {
  const [roomsByBuilding, setRoomsByBuilding] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const fetchCurrentEvents = async () => {
      const currentEvents = await getCurrentEvents(userInfo.access_token);
      const confirmedEvents = currentEvents.filter(
        (event) => event.status === "confirmed"
      );

      if (confirmedEvents.length > 0) {
        const currentEvent = confirmedEvents[0];
        setCurrentEvent(() => currentEvent);
      }
    };
    if (userInfo) {
      fetchCurrentEvents();
    }
  }, [userInfo]);

  const handleCredentialResponse = async (response) => {
    console.info('credentials', response)
    const { access_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    
    localStorage.setItem('token_expires_at', Date.now() + expires_in*1000);

    try {
      const userEmail = await getUserEmail(access_token);
      setUserInfo({ email: userEmail, access_token });
    } catch (error) {
      console.error(error);
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expires_at');
      googleAuthClient.requestAccessToken();

      return;
    }

    const resources = await getResources(access_token);
    const roomsWithAvailability = await Promise.all(
      resources.map(async (room) => {
        const timeUntilNextBooking = await getTimeUntilNextBooking(
          access_token,
          room
        );
        return { ...room, timeUntilNextBooking };
      })
    );

    roomsWithAvailability.sort(
      (a, b) => b.timeUntilNextBooking - a.timeUntilNextBooking
    );

    const roomsByBuilding = roomsWithAvailability.reduce((acc, room) => {
      if (!acc[room.buildingId]) {
        acc[room.buildingId] = [];
      }
      acc[room.buildingId].push(room);
      return acc;
    }, {});

    setRoomsByBuilding(roomsByBuilding);
  };

  const googleAuthClient = useGoogleAuthClient(handleCredentialResponse);
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const token_expires_at = localStorage.getItem('token_expires_at');


    // Vérifier si le token d'accès est toujours valide
    if (access_token && Date.now() < token_expires_at) {
      handleCredentialResponse({ access_token, expires_in: (token_expires_at - Date.now())/1000 });
    } else {
      // Supprimer le access_token du localStorage s'il a expiré
      console.warn('Access token expired REMOVING');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expires_at');
      googleAuthClient.requestAccessToken();
    }
  }, []);

  const onBook = async (roomEmail, start, end) => {
    if (userInfo) {
      const summary = `Résa ${userInfo.email.split("@")[0]}`;
      await bookRoom(userInfo.access_token, roomEmail, start, end, summary);
      alert("Réservation effectuée !");
    }
  };

  return (
    <div className="App">
      <div id="buttonDiv"></div>
      {currentEvent && <CurrentEvent currentEvent={currentEvent} />}
      <div className="buildings">
        {Object.entries(roomsByBuilding).map(([buildingId, rooms]) => (
          <div key={buildingId} className="building">
            <h1>{buildingId}</h1>
            {rooms.map((room) => (
              <Room key={room.resourceEmail} room={room} onBook={onBook} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
