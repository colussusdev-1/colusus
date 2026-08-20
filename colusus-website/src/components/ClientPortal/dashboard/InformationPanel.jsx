import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

import worldMapBg from "../../../assets/images/world-map-bg.png";
import { NetworkVisual } from "./dashboard.visuals";

const InformationPanel = ({ application }) => (
  <div className="colusus-panel information-panel">
    <div
      className="information-panel-map"
      style={{ backgroundImage: `url(${worldMapBg})` }}
    />

    <div className="panel-heading">
      <div>
        <span>LATEST INFORMATION</span>
        <h3>From Your Team</h3>
      </div>
    </div>

    <div className="information-card">
      <div className="information-top">
        <div className="information-title">
          <span />
          <strong>Application update</strong>
        </div>

        <small>
          {application.notes ? "Latest" : "Current"}
        </small>
      </div>

      <p>
        {application.notes ||
          "Thank you for your application. Our team will be in touch should we require any additional information."}
      </p>

      <NetworkVisual />
    </div>

    <Link
      to="/portal/updates"
      className="panel-action-link"
    >
      View all updates
      <HiOutlineArrowRight />
    </Link>
  </div>
);

export default InformationPanel;
