import {
    FiArrowUpRight,
    FiPlus,
    FiRefreshCw,
} from "react-icons/fi";

import "./OffersHeader.css";

function OffersHeader({
    onCreate,
    onRefresh,
    refreshing,
}) {
    const handleOpenCatalogue = () => {
        window.open(
            "/opportunities",
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <header className="offers-header">
            <div className="offers-header__main">
                <div className="offers-header__identity">
                    <div className="offers-header__eyebrow-row">
                        <span className="offers-header__eyebrow">
                            CATALOGUE
                        </span>

                        <span className="offers-header__eyebrow-dot" />
                    </div>

                    <div className="offers-header__title-row">
                        <h1 className="offers-header__title">
                            Offers
                        </h1>

                        <span className="offers-header__context">
                            Migration opportunities
                        </span>
                    </div>

                    <p className="offers-header__description">
                        Manage published opportunities,
                        featured placements, and catalogue
                        visibility.
                    </p>
                </div>

                <div className="offers-header__actions">
                    <button
                        type="button"
                        className="offers-header__button offers-header__button--secondary"
                        onClick={onRefresh}
                        disabled={refreshing}
                    >
                        <FiRefreshCw
                            className={
                                refreshing
                                    ? "offers-header__button-icon offers-header__button-icon--spin"
                                    : "offers-header__button-icon"
                            }
                        />

                        <span>
                            {refreshing
                                ? "Refreshing"
                                : "Refresh"}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="offers-header__button offers-header__button--secondary"
                        onClick={
                            handleOpenCatalogue
                        }
                    >
                        <FiArrowUpRight className="offers-header__button-icon" />

                        <span>
                            View catalogue
                        </span>
                    </button>

                    <button
                        type="button"
                        className="offers-header__button offers-header__button--primary"
                        onClick={onCreate}
                    >
                        <FiPlus className="offers-header__button-icon" />

                        <span>
                            New offer
                        </span>
                    </button>
                </div>
            </div>

            <div className="offers-header__rule" />
        </header>
    );
}

export default OffersHeader;