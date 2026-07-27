import "./FlightSystem.css";

import FlightOrbit from "./FlightOrbit";
import FlightTrail from "./FlightTrail";

const FlightSystem = () => {
  return (
    <div className="flight-system">

      {/* Orbit + Plane */}
      <FlightOrbit />

      {/* Engine trail */}
      <FlightTrail />

    </div>
  );
};

export default FlightSystem;