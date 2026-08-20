import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import worldMapBg from "../../../assets/images/world-map-bg.png";
import { JourneyVisual } from "./dashboard.visuals";

const JourneyPanel = ({
  application,
  journeyStages,
  status,
}) => (
  <div className="colusus-panel journey-panel">
    <div className="panel-heading">
      <div>
        <span>YOUR JOURNEY</span>
        <h3>Application Progress</h3>
      </div>

      <Link to={`/portal/applications/${application._id}`}>
        Details
        <HiOutlineArrowRight />
      </Link>
    </div>

    <p className="panel-description">
      Track your application journey and see what's been completed.
    </p>

    <div
      className="journey-panel-map"
      style={{ backgroundImage: `url(${worldMapBg})` }}
    >
      <div className="journey-map-label">
        <span />
        LIVE JOURNEY
      </div>

      <div className="journey-map-caption">
        <span>Global route</span>
        <strong>{application.destinationCountry}</strong>
      </div>

      <JourneyVisual />
    </div>

    <div className="timeline">
      {journeyStages.map((stage, index) => (
        <div
          key={stage.key}
          className={`timeline-item
            ${stage.completed ? "completed" : ""}
            ${stage.current ? "current" : ""}
            ${stage.upcoming ? "upcoming" : ""}
          `}
        >
          {index < journeyStages.length - 1 && (
            <span className="timeline-line" />
          )}

          <div className="timeline-marker">
            {stage.completed ? (
              <HiOutlineCheckCircle />
            ) : stage.current ? (
              <span />
            ) : (
              <b>{index + 1}</b>
            )}
          </div>

          <div className="timeline-content">
            <div className="timeline-title">
              <strong>{stage.label}</strong>

              {stage.current && <span>Current</span>}
            </div>

            <p>
              {stage.current
                ? status.description
                : stage.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default JourneyPanel;
