import {
    HiOutlineTag,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi";

import "./CouponSection.css";

const CouponSection = ({
    formData,
    updateField,
    couponStatus,
}) => {
    return (
        <div className="couponSection">

            <div className="couponSection__header">

                <div className="couponSection__icon">
                    <HiOutlineTag />
                </div>

                <div>

                    <h3>

                        Discount Coupon

                    </h3>

                    <p>

                        If you received a consultation coupon,
                        enter it below. It will automatically be
                        verified during booking review.

                    </p>

                </div>

            </div>

            <div className="couponSection__input">

                <HiOutlineTag />

                <input
                    type="text"
                    placeholder="Example: COLFREE2026"
                    value={formData.couponCode || ""}
                    onChange={(e) =>
                        updateField(
                            "couponCode",
                            e.target.value.toUpperCase()
                        )
                    }
                />

            </div>

            <div className="couponSection__hint">

                <HiOutlineInformationCircle />

                <span>

                    Leave this blank if you don't have a coupon.

                </span>

            </div>

            {couponStatus?.type === "success" && (

                <div className="couponMessage success">

                    <HiOutlineCheckCircle />

                    <span>

                        {couponStatus.message}

                    </span>

                </div>

            )}

            {couponStatus?.type === "error" && (

                <div className="couponMessage error">

                    <HiOutlineXCircle />

                    <span>

                        {couponStatus.message}

                    </span>

                </div>

            )}

        </div>
    );
};

export default CouponSection;