import { useEffect, useMemo, useState } from "react";

import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi";

import OpportunityCard from "../OpportunityCard/OpportunityCard";

import "./OpportunityGrid.css";


const DESKTOP_PAGE_SIZE = 6;
const MOBILE_PAGE_SIZE = 4;


const OpportunityGrid = ({
  opportunities = [],
  loading = false,
  onSelect,
}) => {

  const [currentPage, setCurrentPage] = useState(1);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= 650
      : false
  );


  /* ============================================================
     RESPONSIVE PAGE SIZE
  ============================================================ */

  const pageSize = isMobile
    ? MOBILE_PAGE_SIZE
    : DESKTOP_PAGE_SIZE;


  /* ============================================================
     RESPONSIVE LISTENER
  ============================================================ */

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth <= 650
      );

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  /* ============================================================
     RESET PAGE WHEN FILTER RESULTS CHANGE
  ============================================================ */

  useEffect(() => {

    setCurrentPage(1);

  }, [opportunities]);


  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalPages = Math.ceil(
    opportunities.length / pageSize
  );


  const visibleOpportunities = useMemo(() => {

    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    return opportunities.slice(
      startIndex,
      endIndex
    );

  }, [
    opportunities,
    currentPage,
    pageSize,
  ]);


  /* ============================================================
     PAGE CHANGE
  ============================================================ */

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {

    return (

      <section
        className="opportunity-grid"
        aria-label="Migration opportunities"
      >

        {Array.from({
          length: pageSize,
        }).map((_, index) => (

          <div
            key={index}
            className="opportunity-grid-skeleton"
            aria-hidden="true"
          >

            <div className="opportunity-grid-skeleton-header">
              <div className="opportunity-grid-skeleton-flag" />

              <div className="opportunity-grid-skeleton-country">
                <div />
                <span />
              </div>

              <div className="opportunity-grid-skeleton-badge" />
            </div>


            <div className="opportunity-grid-skeleton-title" />

            <div className="opportunity-grid-skeleton-line" />

            <div className="opportunity-grid-skeleton-line short" />

            <div className="opportunity-grid-skeleton-meta" />

            <div className="opportunity-grid-skeleton-footer" />

          </div>

        ))}

      </section>

    );

  }


  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!opportunities.length) {

    return (

      <section
        className="opportunity-grid-empty"
        aria-label="No migration opportunities"
      >

        <div className="opportunity-grid-empty-icon">
          —
        </div>


        <h3>
          No pathways found
        </h3>


        <p>
          We couldn't find any migration pathways
          matching your current search or filters.
          Try adjusting your selection.
        </p>

      </section>

    );

  }


  /* ============================================================
     GRID
  ============================================================ */

  return (

    <div className="opportunity-grid-wrapper">

      <section
        className="opportunity-grid"
        aria-label="Available migration pathways"
      >

        {visibleOpportunities.map(
          (opportunity) => (

            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
              onSelect={onSelect}
            />

          )
        )}

      </section>


      {/* ====================================================
                PAGINATION
            ==================================================== */}

      {totalPages > 1 && (

        <nav
          className="opportunity-pagination"
          aria-label="Migration pathway pages"
        >

          <button
            type="button"
            className="opportunity-pagination-arrow"
            onClick={() =>
              goToPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            aria-label="Previous page"
          >

            <HiOutlineArrowLeft />

          </button>


          <div className="opportunity-pagination-pages">

            {Array.from({
              length: totalPages,
            }).map((_, index) => {

              const page =
                index + 1;

              return (

                <button
                  key={page}
                  type="button"
                  className={`opportunity-pagination-page ${currentPage === page
                      ? "active"
                      : ""
                    }`}
                  onClick={() =>
                    goToPage(page)
                  }
                  aria-current={
                    currentPage === page
                      ? "page"
                      : undefined
                  }
                >

                  {page}

                </button>

              );

            })}

          </div>


          <button
            type="button"
            className="opportunity-pagination-arrow"
            onClick={() =>
              goToPage(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
            aria-label="Next page"
          >

            <HiOutlineArrowRight />

          </button>

        </nav>

      )}


      {/* ====================================================
                PAGINATION SUMMARY
            ==================================================== */}

      {totalPages > 1 && (

        <p className="opportunity-pagination-summary">

          Showing{" "}

          <strong>
            {(currentPage - 1) * pageSize + 1}
          </strong>

          {" "}–{" "}

          <strong>
            {Math.min(
              currentPage * pageSize,
              opportunities.length
            )}
          </strong>

          {" "}of{" "}

          <strong>
            {opportunities.length}
          </strong>

          {" "}pathways

        </p>

      )}

    </div>

  );

};


export default OpportunityGrid;