import worldMapBg from "../../../assets/images/world-map-bg.png";
import journeyGlobe from "../../../assets/images/colusus-journey-globe.png";
import documentReview from "../../../assets/images/colusus-document-review.png";
import australiaSydney from "../../../assets/images/australia-sydney.png";
import worldNetwork from "../../../assets/images/colusus-world-network.png";

export const DashboardBackground = () => (
  <>
    <div
      className="colusus-dashboard-background"
      style={{ backgroundImage: `url(${worldMapBg})` }}
    />

    <div className="colusus-dashboard-glow glow-one" />
    <div className="colusus-dashboard-glow glow-two" />
  </>
);

export const JourneyVisual = () => (
  <div className="journey-visual" aria-hidden="true">
    <div className="journey-visual-vignette" />

    <img
      src={journeyGlobe}
      alt=""
      className="journey-globe-image"
    />

    <div className="journey-route-glow" />

    <span className="journey-live-node node-a" />
    <span className="journey-live-node node-b" />

    <span className="journey-aircraft">✈</span>
  </div>
);

export const ReviewVisual = () => (
  <div className="review-visual" aria-hidden="true">
    <div className="review-visual-glow" />

    <img
      src={documentReview}
      alt=""
      className="document-review-image"
    />
  </div>
);

export const NetworkVisual = () => (
  <div className="network-visual" aria-hidden="true">
    <img
      src={worldNetwork}
      alt=""
      className="world-network-image"
    />

    <div className="network-live-label">
      <span />
      GLOBAL NETWORK
    </div>
  </div>
);

export const DestinationVisual = () => (
  <div className="destination-visual" aria-hidden="true">
    <img
      src={australiaSydney}
      alt=""
      className="australia-sydney-image"
    />

    <div className="destination-overlay">
      <span>Destination</span>
      <strong>Australia</strong>
    </div>
  </div>
);
