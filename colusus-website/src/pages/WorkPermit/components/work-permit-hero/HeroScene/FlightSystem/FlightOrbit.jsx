import FlightPlane from "./FlightPlane";
import FlightGlow from "./FlightGlow";
import FlightShadow from "./FlightShadow";

const FlightOrbit = () => {
  return (
    <div className="flight-orbit">

      <FlightGlow />

      <FlightShadow />

      <FlightPlane />

    </div>
  );
};

export default FlightOrbit;