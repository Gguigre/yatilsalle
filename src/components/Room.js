import React from "react";
import { formatTime } from "../utils/formatTime";
import { getBookingLabel } from "../utils/getBookingLabel";

export const Room = ({ room, onBook }) => {
  const freeTimeLabel =
    room.timeUntilNextBooking === Infinity
      ? "Libre toute la journée"
      : room.timeUntilNextBooking < 0 ? "Occupée"
      : `Prochain créneau dans : ${formatTime(
          room.timeUntilNextBooking
        )}`;

  const now = new Date();
  const minutes = now.getMinutes();

  let bookingStart, bookingEnd;
  if (minutes < 25) {
    bookingStart = new Date(now.setMinutes(0, 0, 0));
    bookingEnd = new Date(now.setMinutes(30, 0, 0));
  } else if (minutes < 55) {
    bookingStart = new Date(now.setMinutes(30, 0, 0));
    bookingEnd = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
  } else {
    bookingStart = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
    bookingEnd = new Date(now.setMinutes(30, 0, 0));
  }

  const bookingLabel =
    room.timeUntilNextBooking < 30
      ? null
      : getBookingLabel(bookingStart, bookingEnd);

  return (
    <div
      className="room"
      style={{
        backgroundColor:
          room.timeUntilNextBooking > 60
            ? "#4caf50"
            : room.timeUntilNextBooking > 30
            ? "#ffeb3b"
            : "#f44336",
      }}
    >
      <div className="room-info">
        <h2>{room.resourceName}</h2>
        <p>{room.resourceDescription}</p>
        <p>{freeTimeLabel}</p>
      </div>
      {bookingLabel && (
        <button
          onClick={() => {
            onBook(room.resourceEmail, bookingStart, bookingEnd);
          }}
          className="booking-button"
        >
          {bookingLabel}
        </button>
      )}
    </div>
  );
};
