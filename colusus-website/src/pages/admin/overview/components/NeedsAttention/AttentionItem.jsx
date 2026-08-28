import React from "react";

import {
  HiOutlineArrowRight,
} from "react-icons/hi";


const AttentionItem = ({
  icon: Icon,
  tone,
  title,
  description,
  onClick,
}) => {

  return (

    <button
      type="button"
      className="attentionItem"
      onClick={onClick}
    >

      <div
        className={`attentionItem__icon attentionItem__icon--${tone}`}
      >
        <Icon />
      </div>


      <div className="attentionItem__content">

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>


      <div className="attentionItem__arrow">

        <HiOutlineArrowRight />

      </div>

    </button>

  );

};


export default AttentionItem;