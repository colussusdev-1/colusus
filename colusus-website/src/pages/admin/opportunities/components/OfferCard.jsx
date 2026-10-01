import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiEdit3,
  FiMapPin,
  FiMoreHorizontal,
  FiPower,
  FiStar,
  FiTrash2,
} from "react-icons/fi";

import {
  formatSalary,
  getCountryName,
  getOpportunityCategory,
  getOpportunityId,
  getOpportunityImage,
  getOpportunityLocation,
  getOpportunityTitle,
  getOpportunityType,
} from "../utils/offer.helpers";

import "./OfferCard.css";

function OfferCard({
  offer,
  onEdit,
  onView,
  onToggleActive,
  onToggleFeatured,
  onDeactivate,
  actionLoading = "",
  accent = {
    surface: "#f1f6fb",
    border: "#dce8f3",
    accent: "#4c78a4",
  },
  variant = "grid",
}) {
  const id = getOpportunityId(offer);

  const title = getOpportunityTitle(offer);
  const country = getCountryName(offer);
  const category = getOpportunityCategory(offer);
  const type = getOpportunityType(offer);
  const location = getOpportunityLocation(offer);
  const salary = formatSalary(offer?.salary);
  const image = getOpportunityImage(offer);

  const active = offer?.active !== false;
  const featured = offer?.featured === true;

  const activeLoading =
    actionLoading === `active:${id}`;

  const featuredLoading =
    actionLoading === `featured:${id}`;

  const deactivateLoading =
    actionLoading === `deactivate:${id}`;

  const workflowStatus = String(
    offer?.status ||
    offer?.approvalStatus ||
    offer?.workflowStatus ||
    ""
  ).toUpperCase();

  const needsApproval =
    workflowStatus === "PENDING_APPROVAL" ||
    workflowStatus === "PENDING_REVIEW" ||
    workflowStatus === "PENDING";

  const needsChanges =
    workflowStatus === "CHANGES_REQUESTED" ||
    workflowStatus === "REVIEW_REQUIRED";

  const attentionState = needsApproval
    ? "Needs approval"
    : needsChanges
      ? "Needs changes"
      : !active
        ? "Inactive"
        : null;

  const handleMenuAction = () => {
    if (active) {
      onDeactivate?.(offer);
      return;
    }

    onToggleActive?.(offer);
  };

  const cardStyle = {
    "--offer-accent-surface": accent.surface,
    "--offer-accent-border": accent.border,
    "--offer-accent": accent.accent,
  };

  const renderMenu = () => (
    <div className="offer-card__menu">
      <button
        type="button"
        className="offer-card__menu-trigger"
        aria-label={`More actions for ${title}`}
        title="More actions"
      >
        <FiMoreHorizontal />
      </button>

      <div className="offer-card__menu-panel">
        <div className="offer-card__menu-heading">
          Offer actions
        </div>

        <button
          type="button"
          onClick={() =>
            onEdit?.(offer)
          }
        >
          <FiEdit3 />
          <span>Edit offer</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onView?.(offer)
          }
        >
          <FiArrowUpRight />
          <span>View public offer</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onToggleFeatured?.(offer)
          }
          disabled={featuredLoading}
        >
          <FiStar />
          <span>
            {featured
              ? "Remove featured"
              : "Mark featured"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleMenuAction}
          disabled={
            activeLoading ||
            deactivateLoading
          }
        >
          <FiPower />
          <span>
            {active
              ? "Deactivate offer"
              : "Publish offer"}
          </span>
        </button>

        {active && (
          <button
            type="button"
            className="offer-card__menu-danger"
            onClick={() =>
              onDeactivate?.(
                offer
              )
            }
            disabled={
              deactivateLoading
            }
          >
            <FiTrash2 />
            <span>
              Deactivate
            </span>
          </button>
        )}
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="offer-card__badges">
      <span
        className={`offer-card__status ${active
            ? "offer-card__status--active"
            : "offer-card__status--inactive"
          }`}
      >
        <span className="offer-card__status-dot" />
        {active
          ? "Published"
          : "Inactive"}
      </span>

      {featured && (
        <span className="offer-card__featured">
          <FiStar />
          Featured
        </span>
      )}

      {needsApproval && (
        <span className="offer-card__attention">
          Review
        </span>
      )}

      {needsChanges && (
        <span className="offer-card__attention offer-card__attention--changes">
          Changes
        </span>
      )}
    </div>
  );

  const renderImage = () => (
    <div className="offer-card__image">
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
        />
      ) : (
        <FiBriefcase />
      )}
    </div>
  );

  const renderMeta = () => (
    <div className="offer-card__details">
      {type && type !== "—" && (
        <div className="offer-card__detail">
          <FiBriefcase />
          <span>{type}</span>
        </div>
      )}

      {location &&
        location !== "—" && (
          <div className="offer-card__detail">
            <FiMapPin />
            <span>
              {location}
            </span>
          </div>
        )}
    </div>
  );

  const renderFooterState = () => (
    <div className="offer-card__footer-state">
      {active ? (
        <>
          <span className="offer-card__live-dot">
            <FiCheck />
          </span>

          <span>
            Live in catalogue
          </span>
        </>
      ) : (
        <>
          <span className="offer-card__offline-dot">
            <FiPower />
          </span>

          <span>
            Not visible publicly
          </span>
        </>
      )}
    </div>
  );

  /* =====================================================
     LIST
  ===================================================== */

  if (variant === "list") {
    return (
      <article
        className={[
          "offer-card",
          "offer-card--list",
          !active
            ? "offer-card--inactive"
            : "",
          attentionState
            ? "offer-card--attention"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={cardStyle}
      >
        <div className="offer-card__list-main">
          {renderImage()}

          <div className="offer-card__list-content">
            <div className="offer-card__list-heading">
              <div className="offer-card__country">
                <span>
                  {country}
                </span>

                {category &&
                  category !==
                  "Uncategorized" && (
                    <>
                      <span className="offer-card__separator">
                        ·
                      </span>

                      <span>
                        {
                          category
                        }
                      </span>
                    </>
                  )}
              </div>

              <h3 className="offer-card__title">
                {title}
              </h3>

              {renderMeta()}
            </div>
          </div>
        </div>

        <div className="offer-card__list-salary">
          <span>Salary</span>

          <strong>
            {salary !== "—"
              ? salary
              : "Not specified"}
          </strong>
        </div>

        <div className="offer-card__list-status">
          {renderStatus()}
        </div>

        <div className="offer-card__list-actions">
          <button
            type="button"
            className="offer-card__edit"
            onClick={() =>
              onEdit?.(offer)
            }
          >
            <FiEdit3 />
            Edit
          </button>

          <button
            type="button"
            className="offer-card__view"
            onClick={() =>
              onView?.(offer)
            }
          >
            View
            <FiArrowUpRight />
          </button>

          {renderMenu()}
        </div>
      </article>
    );
  }

  /* =====================================================
     KANBAN
  ===================================================== */

  if (variant === "kanban") {
    return (
      <article
        className={[
          "offer-card",
          "offer-card--kanban",
          !active
            ? "offer-card--inactive"
            : "",
          attentionState
            ? "offer-card--attention"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={cardStyle}
      >
        <div className="offer-card__kanban-head">
          {renderImage()}

          <div className="offer-card__kanban-head-right">
            {renderMenu()}
          </div>
        </div>

        <div className="offer-card__kanban-body">
          <div className="offer-card__country">
            <span>
              {country}
            </span>

            {category &&
              category !==
              "Uncategorized" && (
                <>
                  <span className="offer-card__separator">
                    ·
                  </span>

                  <span>
                    {category}
                  </span>
                </>
              )}
          </div>

          <h3 className="offer-card__title">
            {title}
          </h3>

          {renderMeta()}

          <div className="offer-card__kanban-salary">
            <span>Salary</span>

            <strong>
              {salary !== "—"
                ? salary
                : "Not specified"}
            </strong>
          </div>
        </div>

        <div className="offer-card__kanban-footer">
          {renderStatus()}

          <button
            type="button"
            className="offer-card__view"
            onClick={() =>
              onView?.(offer)
            }
          >
            View
            <FiArrowUpRight />
          </button>
        </div>
      </article>
    );
  }

  /* =====================================================
     GRID
  ===================================================== */

  return (
    <article
      className={[
        "offer-card",
        "offer-card--grid",
        !active
          ? "offer-card--inactive"
          : "",
        attentionState
          ? "offer-card--attention"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={cardStyle}
    >
      <div className="offer-card__grid-head">
        {renderImage()}

        <div className="offer-card__grid-head-right">
          {renderStatus()}
          {renderMenu()}
        </div>
      </div>

      <div className="offer-card__grid-body">
        <div className="offer-card__country">
          <span>
            {country}
          </span>

          {category &&
            category !==
            "Uncategorized" && (
              <>
                <span className="offer-card__separator">
                  ·
                </span>

                <span>
                  {category}
                </span>
              </>
            )}
        </div>

        <h3 className="offer-card__title">
          {title}
        </h3>

        {renderMeta()}

        {salary !== "—" && (
          <div className="offer-card__salary">
            <span>Salary</span>

            <strong>
              {salary}
            </strong>
          </div>
        )}
      </div>

      <div className="offer-card__grid-footer">
        {renderFooterState()}

        <div className="offer-card__actions">
          <button
            type="button"
            className="offer-card__edit"
            onClick={() =>
              onEdit?.(offer)
            }
          >
            <FiEdit3 />
            Edit
          </button>

          <button
            type="button"
            className="offer-card__view"
            onClick={() =>
              onView?.(offer)
            }
          >
            View
            <FiArrowUpRight />
          </button>
        </div>
      </div>
    </article>
  );
}

export default OfferCard;