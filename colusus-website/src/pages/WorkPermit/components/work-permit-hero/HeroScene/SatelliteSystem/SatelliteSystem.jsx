import "./SatelliteSystem.css";

const SatelliteSystem = () => {
  return (
    <div className="satellite-system">

      {/* Satellite 1 */}
      <div className="satellite satellite-one">
        <div className="satellite-core"></div>
      </div>

      {/* Satellite 2 */}
      <div className="satellite satellite-two">
        <div className="satellite-core"></div>
      </div>

      {/* Satellite 3 */}
      <div className="satellite satellite-three">
        <div className="satellite-core"></div>
      </div>

    </div>
  );
};

export default SatelliteSystem;