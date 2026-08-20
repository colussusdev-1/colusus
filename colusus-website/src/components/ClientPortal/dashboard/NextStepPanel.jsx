import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineUpload,
} from "react-icons/hi";

import {
  ReviewVisual,
  DestinationVisual,
} from "./dashboard.visuals";

const NextStepPanel = ({
  application,
  status,
}) => {
  const documentRequest =
    application.status === "DOCUMENT_REQUEST";

  return (
    <div className="colusus-panel next-step-panel">
      <div className="panel-heading">
        <div>
          <span>NEXT STEP</span>
          <h3>What happens next?</h3>
        </div>
      </div>

      <div
        className={`next-step-card ${
          documentRequest ? "attention" : ""
        }`}
      >
        <div className="next-step-icon">
          {documentRequest ? (
            <HiOutlineUpload />
          ) : (
            <HiOutlineClock />
          )}
        </div>

        <div className="next-step-copy">
          <strong>{status.nextTitle}</strong>

          <p>{status.nextDescription}</p>
        </div>

        <ReviewVisual />
        <DestinationVisual />
      </div>

      <div className="next-step-notice">
        <span>i</span>

        <p>
          You will be notified when there is an update
          to your application.
        </p>
      </div>

      <Link
        to={
          documentRequest
            ? "/portal/documents"
            : `/portal/applications/${application._id}`
        }
        className="panel-action-link"
      >
        {documentRequest
          ? "Review Documents"
          : "View Application"}

        <HiOutlineArrowRight />
      </Link>
    </div>
  );
};

export default NextStepPanel;
