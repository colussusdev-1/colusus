import "./GlobeScene.css";

const GlobeScene = () => {
  return (
    <div className="globe-scene">

      {/* Ambient Glow */}
      <div className="globe-ambient"></div>

      {/* ======================================
          GLOBE
      ======================================= */}
      <div className="globe-shell">

        {/* Atmosphere */}
        <div className="globe-atmosphere"></div>

        {/* Globe Core */}
        <div className="globe-core"></div>

        {/* Continents */}
        <div className="globe-continents"></div>

        {/* Grid */}
        <div className="globe-grid"></div>

        {/* Reflection */}
        <div className="globe-reflection"></div>

        {/* Moving Light Sweep */}
        <div className="globe-sweep"></div>

      </div>

    </div>
  );
};

export default GlobeScene;