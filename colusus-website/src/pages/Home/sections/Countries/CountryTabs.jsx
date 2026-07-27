import { useEffect, useRef, useState } from "react";

const tabs = [
  "All",
  "Most Popular",
  "Most Affordable",
];

const CountryTabs = ({
  activeTab = "All",
  setActiveTab = () => {},
}) => {
  const containerRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });

  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return;

      const activeButton = containerRef.current.querySelector(
        ".country-tab.active"
      );

      if (!activeButton) return;

      setIndicatorStyle({
        width: `${activeButton.offsetWidth}px`,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      });
    };

    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="country-tabs"
    >
      <span
        className="tab-indicator"
        style={indicatorStyle}
      />

      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`country-tab ${
            activeTab === tab ? "active" : ""
          }`}
          onClick={() => {
            if (typeof setActiveTab === "function") {
              setActiveTab(tab);
            }
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CountryTabs;