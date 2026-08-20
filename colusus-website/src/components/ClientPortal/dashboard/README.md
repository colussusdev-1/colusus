# Colusus Client Dashboard — Componentized

Replace the existing `src/pages/Client/ClientDashboard.jsx` with the provided page file.

Copy the `src/components/client/dashboard/` directory into your project at the same path.

The existing `ClientDashboard.css` remains the page-level stylesheet and does not need to be split in this pass.

## Resulting structure

src/
├── pages/
│   └── Client/
│       └── ClientDashboard.jsx
└── components/
    └── client/
        └── dashboard/
            ├── ActiveApplicationHero.jsx
            ├── ApplicationHistory.jsx
            ├── DashboardContentGrid.jsx
            ├── DashboardIntro.jsx
            ├── DashboardMetrics.jsx
            ├── DashboardStates.jsx
            ├── InformationPanel.jsx
            ├── JourneyPanel.jsx
            ├── NextStepPanel.jsx
            ├── SecurityStrip.jsx
            ├── dashboard.constants.js
            ├── dashboard.utils.js
            └── dashboard.visuals.jsx
