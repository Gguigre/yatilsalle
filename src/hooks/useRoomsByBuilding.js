import { useState } from "react";
import { getResources } from "../services/getResources";
import { getTimeUntilNextBooking } from "../services/getTimeUntilNextBooking";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

export const useRoomsByBuilding = () => {
  const [roomsByBuilding, setRoomsByBuilding] = useState({});

  const handleCredentialResponse = async (response) => {
    const { access_token } = response;
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

  useGoogleAuth(handleCredentialResponse);

  return roomsByBuilding;
};
