export const CurrentEvent = ({ currentEvent }) => {
  
  const room = currentEvent.attendees.filter((attendee) => attendee.resource)[0];

  return (
    <div className="current-event">
      <h2>Événement en cours : {JSON.stringify(currentEvent.summary)}</h2>
      <p>
        De {new Date(currentEvent.start.dateTime).toLocaleTimeString()} à{" "}
        {new Date(currentEvent.end.dateTime).toLocaleTimeString()}
      </p>
      <p>
      {room && ` ${room.displayName}`}
      </p>
    </div>
  );
};
