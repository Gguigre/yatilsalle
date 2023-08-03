export const getBookingLabel = (start, end) => {
  const formatTime = (date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return `Réserver de ${formatTime(start)} à ${formatTime(end)}`;
};
