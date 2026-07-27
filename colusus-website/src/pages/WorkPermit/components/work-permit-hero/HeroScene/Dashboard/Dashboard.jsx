import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard wp-glass">

      {/* CORE SIGNAL */}
      <div className="dashboard-core">

        <div className="core-top">
          <span className="core-badge">Live Signal</span>
          <span className="core-status">Active</span>
        </div>

        <div className="core-body">
          <div className="core-score">95%</div>

          <div className="core-text">
            <h3>Eligibility Signal High</h3>
            <p>System analyzing best work permit routes</p>
          </div>
        </div>

      </div>

      {/* SINGLE PATH */}
      <div className="dashboard-path">

        <div className="path-title">Recommended Path</div>

        <div className="path-card">

          <span className="path-flag">🇨🇦</span>

          <div className="path-info">
            <strong>Canada Work Permit</strong>
            <small>Best match for your profile</small>
          </div>

          <div className="path-dot"></div>

        </div>

      </div>

      {/* ACTION (NO FLOATING BUTTON FEEL) */}
      <div className="dashboard-action">

        <p>
          Unlock full immigration roadmap after assessment
        </p>

        <button className="dashboard-btn">
          Start Eligibility Assessment
        </button>

      </div>

    </div>
  );
};

export default Dashboard;