import React from "react";
import { formatTime } from "../utils/formatTime";

export const Room = ({ room }) => {
  const freeTimeLabel =
    room.timeUntilNextBooking === Infinity
      ? "Libre toute la journée"
      : `Prochain créneau dans : ${formatTime(
          room.timeUntilNextBooking
        )} minutes`;

  return (
    <div
      className="room"
      style={{
        backgroundColor:
          room.timeUntilNextBooking > 60
            ? "green"
            : room.timeUntilNextBooking > 30
            ? "yellow"
            : "red",
      }}
    >
      <h2>{room.resourceName}</h2>
      <p>{room.resourceDescription}</p>
      <p>{freeTimeLabel}</p>
    </div>
  );
};
