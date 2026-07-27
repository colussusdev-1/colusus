import "./HeroContent.css";

const HeroContent = ({ onStartAssessment }) => {
  return (
    <section className="wp-hero-content">

      <div className="wp-hero-card">

        {/* Badge */}
        <div className="wp-hero-badge">
          <span className="badge-dot"></span>
          AI Powered Study Permit Platform
        </div>

        {/* Heading */}
        <div className="hero-copy">

          <h1 className="wp-hero-title">
            Study Abroad
            <span>With Confidence</span>
          </h1>

          <p className="wp-hero-subtitle">
            Get personalized university recommendations, instant eligibility
            analysis and a complete visa roadmap all in one intelligent
            platform.
          </p>

        </div>

        {/* Stats */}
        <div className="wp-hero-stats">

          <div className="hero-stat">
            <strong>20+</strong>
            <span>Countries</span>
          </div>

          <div className="hero-stat">
            <strong>95%</strong>
            <span>AI Accuracy</span>
          </div>

          <div className="hero-stat">
            <strong>24/7</strong>
            <span>Assessment</span>
          </div>

        </div>

        {/* CTA */}
        <div className="wp-hero-actions">

          <button
            className="wp-btn hero-primary-btn"
            onClick={onStartAssessment}
          >
            Check Eligibility
          </button>

          <button className="wp-btn hero-secondary-btn">
            Book Consultation
          </button>

        </div>

        {/* Footer */}
        <div className="wp-hero-footer">

          <div className="hero-users">

            <div className="user-avatar"></div>
            <div className="user-avatar"></div>
            <div className="user-avatar"></div>

          </div>

          <span>
            Trusted by students beginning their international education journey.
          </span>

        </div>

      </div>

    </section>
  );
};

export default HeroContent;