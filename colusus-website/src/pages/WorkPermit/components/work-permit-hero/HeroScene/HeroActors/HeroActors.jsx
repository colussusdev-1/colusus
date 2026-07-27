import "./HeroActors.css";

const HeroActors = () => {

  // TEMP STATIC STATE (later becomes real data)
  const score = 95;

  return (
    <div className="hero-actors">

      {/* ======================================================
          CENTRAL INTELLIGENCE PULSE (TIED TO SCORE)
      ====================================================== */}
      <div className="actor actor-core-pulse">
        <div className="core-ring"></div>
        <div className="core-dot"></div>

        <div className="core-label">
          {score}% Eligibility Signal
        </div>
      </div>

      {/* ======================================================
          ROUTE SYSTEM (ACTIVE PATH VISUALIZATION)
      ====================================================== */}
      <div className="actor-routes">

        <div className="route route-canada"></div>
        <div className="route route-germany"></div>
        <div className="route route-uk"></div>

        <div className="route-beacon"></div>

      </div>

      {/* ======================================================
          DATA FLOW PARTICLES (NOW ORBIT-LINKED FEEL)
      ====================================================== */}
      <div className="actor-flow">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>

      {/* ======================================================
          ACTION NODE (NOW STATE-AWARE)
      ====================================================== */}
     

    </div>
  );
};

export default HeroActors;