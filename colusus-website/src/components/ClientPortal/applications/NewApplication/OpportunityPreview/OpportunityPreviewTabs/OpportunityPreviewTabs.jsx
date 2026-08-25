import "./OpportunityPreviewTabs.css";


const OpportunityPreviewTabs = ({
    activeTab = "overview",
    onChange,
}) => {

    const tabs = [
        {
            id: "overview",
            label: "Overview",
        },
        {
            id: "eligibility",
            label: "Eligibility",
        },
        {
            id: "requirements",
            label: "Requirements",
        },
        {
            id: "benefits",
            label: "Benefits",
        },
        {
            id: "pricing",
            label: "Pricing",
        },
        {
            id: "process",
            label: "Application Process",
        },
    ];


    const handleChange = (tabId) => {

        if (typeof onChange === "function") {
            onChange(tabId);
        }

    };


    return (
        <nav
            className="opportunity-preview-tabs"
            aria-label="Pathway information"
            role="tablist"
        >

            {tabs.map((tab) => {

                const isActive =
                    activeTab === tab.id;


                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={
                            `opportunity-preview-panel-${tab.id}`
                        }
                        tabIndex={
                            isActive
                                ? 0
                                : -1
                        }
                        className={
                            isActive
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleChange(tab.id)
                        }
                    >

                        {tab.label}

                    </button>
                );

            })}

        </nav>
    );
};


export default OpportunityPreviewTabs;