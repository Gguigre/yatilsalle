import React, { useEffect, useState } from "react";
import "./App.css";
import { Room } from "./components/Room";
import { useGoogleAuthClient } from "./hooks/useGoogleAuth";
import { bookRoom } from "./services/bookRoom";
import { getResources } from "./services/getResources";
import { getTimeUntilNextBooking } from "./services/getTimeUntilNextBooking";
import { getUserEmail } from "./services/getUserEmail";

function App() {
  const [roomsByBuilding, setRoomsByBuilding] = useState({});
  const [userInfo, setUserInfo] = useState(null);

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
    console.log(response);
    handleCredentialResponse(response);
  };

  const googleAuthClient = useGoogleAuthClient(onGoogleAuthResponse);
  useEffect(() => {
    googleAuthClient.requestAccessToken();
  }, []);

  const onBook = async (roomEmail, start, end) => {
    if (userInfo) {
      const summary = `Résa ${userInfo.email.split("@")[0]}`;
      console.log({
        access_token: userInfo.access_token,
        roomEmail,
        start: start.toISOString(),
        end: end.toISOString(),
        summary,
      });
      await bookRoom(userInfo.access_token, roomEmail, start, end, summary);
      alert("Réservation effectuée !");
    }
  };

  return (
    <div className="App">
      <div id="buttonDiv"></div>
      {Object.entries(roomsByBuilding).map(([buildingId, rooms]) => (
        <div key={buildingId} className="building">
          <h1>{buildingId}</h1>
          {rooms.map((room) => (
            <Room key={room.resourceEmail} room={room} onBook={onBook} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
