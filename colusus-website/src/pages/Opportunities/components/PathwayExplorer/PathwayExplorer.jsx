import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineArrowRight,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineUsers,
} from "react-icons/hi";
import "./PathwayExplorer.css";

const PathwayExplorer = ({ country }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const opportunities = country?.opportunities || [];

  const categories = useMemo(() => {
    const found = new Set();
    opportunities.forEach((item) => {
      if (item?.category) found.add(String(item.category));
    });
    return ["All", ...found];
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => (
    activeCategory === "All"
      ? opportunities
      : opportunities.filter((item) => String(item?.category) === activeCategory)
  ), [opportunities, activeCategory]);

  const getCategoryIcon = (category) => {
    const value = String(category || "").toLowerCase();
    if (/study|education|student|training|apprenticeship/.test(value)) {
      return <HiOutlineAcademicCap />;
    }
    if (/residen|settlement|pr/.test(value)) return <HiOutlineHome />;
    return <HiOutlineBriefcase />;
  };

  const openPathway = (opportunity) => {
    if (!opportunity?.slug || !country?.slug) return;
    navigate(`/opportunities/${country.slug}/${opportunity.slug}`);
  };

  const handleCardKeyDown = (event, opportunity) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPathway(opportunity);
    }
  };

  const getPositionTitle = (position) => {
    if (typeof position === "string") return position;
    return position?.title || position?.name || position?.position ||
      position?.role || position?.sector || "";
  };

  const getPositionCount = (item) => {
    for (const key of ["positionsCount", "vacanciesCount", "numberOfPositions"]) {
      if (typeof item?.[key] === "number") return item[key];
    }
    if (!Array.isArray(item?.positions)) return null;
    const count = item.positions.reduce((total, position) => {
      if (Array.isArray(position?.roles)) return total + position.roles.length;
      if (Array.isArray(position?.courses)) return total + position.courses.length;
      return total + (getPositionTitle(position) ? 1 : 0);
    }, 0);
    return count || null;
  };

  const getSectors = (item) => {
    const arrays = [
      item?.sectors, item?.industries, item?.fields, item?.trainingCategories,
    ].filter(Array.isArray).flat();

    const sectors = arrays.map((entry) => {
      if (typeof entry === "string") return entry;
      return entry?.name || entry?.title || entry?.label ||
        entry?.category || entry?.sector || "";
    }).filter(Boolean);

    if (!sectors.length && Array.isArray(item?.positions)) {
      item.positions.forEach((position) => {
        if (position && typeof position === "object") {
          const sector = position.category || position.sector;
          if (sector) sectors.push(sector);
        }
      });
    }
    return [...new Set(sectors)];
  };

  const getOutcomes = (item) => [
    ...new Set([
      ...(Array.isArray(item?.benefits) ? item.benefits : []),
      ...(Array.isArray(item?.highlights) ? item.highlights : []),
    ].filter((value) => typeof value === "string" && value.trim())),
  ].slice(0, 2);

  const getStatus = (item) => {
    const status = String(item?.status || item?.applicationStatus || "").trim();
    if (status) return status.replace(/[_-]+/g, " ");
    return item?.active === true ? "Open" : "";
  };

  return (
    <section className="pathway-explorer" id="pathways">
      <div className="pathway-explorer__container">
        <header className="pathway-explorer__header">
          <div className="pathway-explorer__heading">
            <span className="pathway-explorer__eyebrow">
              <HiOutlineSparkles /> Explore your options
            </span>
            <h2>Find your<span> pathway.</span></h2>
            <p>
              Compare the routes available in <strong>{country?.name}</strong>
              {" "}and choose the direction that fits your goals.
            </p>
          </div>
          <div className="pathway-explorer__count">
            <strong>{opportunities.length}</strong><span>available</span>
          </div>
        </header>

        {categories.length > 1 && (
          <div className="pathway-explorer__filters" role="tablist" aria-label="Pathway categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={activeCategory === category ? "is-active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryIcon(category)}<span>{category}</span>
              </button>
            ))}
          </div>
        )}

        <div className="pathway-explorer__grid">
          {filteredOpportunities.map((opportunity, index) => {
            const title = opportunity?.title || opportunity?.name || "Migration Pathway";
            const description = opportunity?.description || opportunity?.summary ||
              opportunity?.shortDescription ||
              "Explore this pathway and discover its requirements, benefits and next steps.";
            const location = opportunity?.location || country?.name || "";
            const duration = opportunity?.duration || opportunity?.timeline || "";
            const image = opportunity?.image;
            const positionCount = getPositionCount(opportunity);
            const sectors = getSectors(opportunity).slice(0, 4);
            const outcomes = getOutcomes(opportunity);
            const status = getStatus(opportunity);
            const featured = Boolean(opportunity?.featured || opportunity?.isFeatured);
            const isTraining = /training|apprenticeship/i.test(
              `${opportunity?.category || ""} ${title}`
            );

            return (
              <article
                className="pathway-card"
                key={opportunity?.id || opportunity?.slug || index}
                role="button"
                tabIndex={0}
                aria-label={`View ${title} pathway`}
                onClick={() => openPathway(opportunity)}
                onKeyDown={(event) => handleCardKeyDown(event, opportunity)}
              >
                <div className="pathway-card__image">
                  {image ? (
                    <img
                      src={image}
                      alt={`${title} — ${country?.name || "destination"}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="pathway-card__image-fallback" aria-hidden="true">
                      {getCategoryIcon(opportunity?.category)}
                    </div>
                  )}
                  <div className="pathway-card__image-overlay" />
                  <div className="pathway-card__image-top">
                    <span className="pathway-card__category">
                      {opportunity?.category || "Opportunity"}
                    </span>
                    <span className="pathway-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {featured && (
                    <span className="pathway-card__featured">
                      <HiOutlineSparkles /> Featured
                    </span>
                  )}
                  {status && (
                    <span className={`pathway-card__status ${/open|active|available/i.test(status) ? "is-open" : "is-other"
                      }`}>
                      <span />{status}
                    </span>
                  )}
                  <div className="pathway-card__image-icon">
                    {getCategoryIcon(opportunity?.category)}
                  </div>
                </div>

                <div className="pathway-card__body">
                  <h3>{title}</h3>
                  <p className="pathway-card__description">{description}</p>

                  <div className="pathway-card__meta">
                    {location && <span><HiOutlineLocationMarker />{location}</span>}
                    {duration && <span><HiOutlineClock />{duration}</span>}
                    {positionCount !== null && (
                      <span><HiOutlineUsers />{positionCount}+ roles</span>
                    )}
                  </div>

                  {sectors.length > 0 && (
                    <div className="pathway-card__sectors">
                      {sectors.map((sector) => <span key={sector}>{sector}</span>)}
                    </div>
                  )}

                  {outcomes.length > 0 && (
                    <div className="pathway-card__outcomes">
                      {outcomes.map((outcome) => (
                        <span key={outcome} title={outcome}>
                          <HiOutlineCheckCircle />{outcome}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pathway-card__footer">
                    <span>{isTraining ? "View programme" :
                      positionCount ? "View vacancies" : "View pathway"}</span>
                    <span className="pathway-card__arrow" aria-hidden="true">
                      <HiOutlineArrowRight />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="pathway-explorer__empty">
            <HiOutlineBriefcase />
            <strong>More pathways are coming</strong>
            <span>We're expanding the opportunities available for this destination.</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default PathwayExplorer;
