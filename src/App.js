import React, { useEffect, useState } from "react";
import "./App.css";
import { Room } from "./components/Room";
import { useGoogleAuthClient } from "./hooks/useGoogleAuth";
import { bookRoom } from "./services/bookRoom";
import { getResources } from "./services/getResources";
import { getTimeUntilNextBooking } from "./services/getTimeUntilNextBooking";
import { getUserEmail } from "./services/getUserEmail";
import { getCurrentEvents } from "./services/getCurrentEvents";
import { CurrentEvent } from "./components/CurrentEvent";
import { updateEvent } from "./services/updateEvent";

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
        console.log(confirmedEvents);
        const currentEvent = confirmedEvents[0];
        setCurrentEvent(() => currentEvent);
      }
    };
    if (userInfo) {
      fetchCurrentEvents();
    }
  }, [userInfo]);

  const handleCredentialResponse = async (response) => {
    const { access_token } = response;

    const userEmail = await getUserEmail(access_token);
    setUserInfo({ email: userEmail, access_token });

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

  const onGoogleAuthResponse = (response) => {
    handleCredentialResponse(response);
  };

  const googleAuthClient = useGoogleAuthClient(onGoogleAuthResponse);
  useEffect(() => {
    googleAuthClient.requestAccessToken();
  }, []);

  const onBook = async (roomEmail, start, end) => {
    if (userInfo) {
      const summary = `Résa ${userInfo.email.split("@")[0]}`;
      // if (currentEvent) {
      //   await updateEvent(
      //     userInfo.access_token,
      //     currentEvent,
      //     roomEmail
      //   );
      //   alert("Événement mis à jour avec la nouvelle salle !");
      // } else {
      await bookRoom(userInfo.access_token, roomEmail, start, end, summary);
      alert("Réservation effectuée !");
      // }
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
