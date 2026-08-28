import React from "react";


const OverviewStatCard = ({
  label,
  value,
  meta,
  metaType,
  icon: Icon,
  tone,
}) => {

  return (

    <article className="overviewStatCard">

      <div
        className={`overviewStatCard__icon overviewStatCard__icon--${tone}`}
      >
        <Icon />
      </div>


      <div className="overviewStatCard__body">

        <span className="overviewStatCard__label">
          {label}
        </span>

        <strong className="overviewStatCard__value">
          {value.toLocaleString()}
        </strong>

        <span
          className={`overviewStatCard__meta ${metaType
              ? `overviewStatCard__meta--${metaType}`
              : ""
            }`}
        >
          {meta}
        </span>

      </div>

    </article>

  );

};


export default OverviewStatCard;