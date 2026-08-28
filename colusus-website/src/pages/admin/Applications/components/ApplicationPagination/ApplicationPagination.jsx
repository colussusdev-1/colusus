import React from "react";

import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";

import "./ApplicationPagination.css";


const ApplicationPagination = ({
  currentPage,
  totalPages,
  totalResults,
  startResult,
  endResult,
  onPageChange,
}) => {

  if (totalResults === 0) {

    return null;

  }


  const pages = [];


  /*
  |--------------------------------------------------------------------------
  | SIMPLE PAGE GENERATION
  |--------------------------------------------------------------------------
  */

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {

    if (
      totalPages <= 7 ||
      page === 1 ||
      page === totalPages ||
      Math.abs(
        page - currentPage
      ) <= 1
    ) {

      pages.push(page);

    }

  }


  const uniquePages = [
    ...new Set(pages),
  ];


  return (

    <div className="applicationPagination">

      <span className="applicationPagination__summary">

        Showing{" "}

        <strong>
          {startResult}
        </strong>

        {" "}to{" "}

        <strong>
          {endResult}
        </strong>

        {" "}of{" "}

        <strong>
          {totalResults}
        </strong>

        {" "}applications

      </span>


      <div className="applicationPagination__controls">

        <button
          type="button"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          aria-label="Previous page"
        >

          <HiOutlineChevronLeft />

        </button>


        {uniquePages.map(
          (page, index) => {

            const previousPage =
              uniquePages[index - 1];


            const needsEllipsis =
              previousPage &&
              page - previousPage > 1;


            return (

              <React.Fragment
                key={page}
              >

                {needsEllipsis && (

                  <span className="applicationPagination__ellipsis">
                    ...
                  </span>

                )}


                <button
                  type="button"
                  className={
                    page ===
                      currentPage
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    onPageChange(
                      page
                    )
                  }
                >
                  {page}
                </button>

              </React.Fragment>

            );

          }
        )}


        <button
          type="button"
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          aria-label="Next page"
        >

          <HiOutlineChevronRight />

        </button>

      </div>

    </div>

  );

};


export default ApplicationPagination;