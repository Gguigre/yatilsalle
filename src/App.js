import React from "react";
import "./App.css";
import { Room } from "./components/Room";
import { useRoomsByBuilding } from "./hooks/useRoomsByBuilding";

function App() {
  const roomsByBuilding = useRoomsByBuilding();

  return (
    <div className="App">
      <div id="buttonDiv"></div>
      {Object.entries(roomsByBuilding).map(([buildingId, rooms]) => (
        <div key={buildingId} className="building">
          <h1>{buildingId}</h1>
          {rooms.map((room) => (
            <Room key={room.resourceEmail} room={room} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
