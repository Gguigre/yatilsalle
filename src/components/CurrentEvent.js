export const CurrentEvent = ({ currentEvent }) => {
  console.log(currentEvent);
  return (
    <div className="current-event">
      <h2>Événement en cours : {JSON.stringify(currentEvent.summary)}</h2>
      <p>
        {/* De {new Date(currentEvent.start.dateTime).toLocaleTimeString()} à{" "}
        {new Date(currentEvent.end.dateTime).toLocaleTimeString()} */}
      </p>
    </div>
  );
};
