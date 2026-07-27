import "./HeroScene.css";

import GlobeScene from "./GlobeScene/GlobeScene";
import OrbitSystem from "./GlobeScene/OrbitSystem/OrbitSystem";
import SatelliteSystem from "./SatelliteSystem/SatelliteSystem";
import FlightSystem from "./FlightSystem/FlightSystem";
import HeroActors from "./HeroActors/HeroActors";
import Dashboard from "./Dashboard/Dashboard";

const HeroScene = () => {
  return (
    <section className="hero-scene">

      <div className="hero-stage">

        {/* ======================================
            GLOBE VISUAL STACK
        ======================================= */}
        <div className="globe-stage">

          {/* Base Globe */}
          <GlobeScene />

          {/* Orbit Rings */}
          <OrbitSystem />

          {/* Satellites */}
          <SatelliteSystem />

          {/* Flights */}
          <FlightSystem />

          {/* Floating Labels / Actors */}
          <HeroActors />

        </div>

        {/* ======================================
            LIVE DASHBOARD
        ======================================= */}
        <div className="dashboard-stage">
          <Dashboard />
        </div>

      </div>

    </section>
  );
};

export default HeroScene;