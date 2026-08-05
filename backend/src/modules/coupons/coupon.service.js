import Coupon from "./coupon.model.js";

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

const createCoupon = async (couponData) => {
  return await Coupon.create(couponData);
};

/*
|--------------------------------------------------------------------------
| Get All Coupons
|--------------------------------------------------------------------------
*/

const getAllCoupons = async () => {
  return await Coupon.find().sort({
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| Get Coupon By ID
|--------------------------------------------------------------------------
*/

const getCouponById = async (couponId) => {
  return await Coupon.findById(couponId);
};

/*
|--------------------------------------------------------------------------
| Get Coupon By Code
|--------------------------------------------------------------------------
*/

const getCouponByCode = async (code) => {
  if (!code) return null;

  return await Coupon.findOne({
    code: code.toUpperCase().trim(),
  });
};

/*
|--------------------------------------------------------------------------
| Validate Coupon
|--------------------------------------------------------------------------
*/

const validateCoupon = async (code) => {
  if (!code) {
    return {
      valid: false,
      message: "Coupon code is required.",
    };
  }

  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return {
      valid: false,
      message: "Coupon does not exist.",
    };
  }

  if (!coupon.active) {
    return {
      valid: false,
      message: "Coupon is inactive.",
    };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return {
      valid: false,
      message: "Coupon has expired.",
    };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return {
      valid: false,
      message: "Coupon usage limit has been reached.",
    };
  }

  return {
    valid: true,
    message: "Coupon is valid.",
    coupon,
  };
};

/*
|--------------------------------------------------------------------------
| Increment Coupon Usage
|--------------------------------------------------------------------------
*/

const incrementCouponUsage = async (couponId) => {
  return await Coupon.findByIdAndUpdate(
    couponId,
    {
      $inc: {
        usedCount: 1,
      },
    },
    {
      new: true,
    },
  );
};

/*
|--------------------------------------------------------------------------
| Mark Coupon As Used
|--------------------------------------------------------------------------
*/

const markCouponAsUsed = async (couponCode) => {
  if (!couponCode) {
    return null;
  }

  const coupon = await getCouponByCode(couponCode);

  if (!coupon) {
    return null;
  }

  coupon.usedCount += 1;

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    coupon.active = false;
  }

  await coupon.save();

  return coupon;
};

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

const updateCoupon = async (couponId, updateData) => {
  return await Coupon.findByIdAndUpdate(couponId, updateData, {
    new: true,
    runValidators: true,
  });
};

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

const deleteCoupon = async (couponId) => {
  return await Coupon.findByIdAndDelete(couponId);
};

/*
|--------------------------------------------------------------------------
| Deactivate Coupon
|--------------------------------------------------------------------------
*/

const deactivateCoupon = async (couponId) => {
  return await Coupon.findByIdAndUpdate(
    couponId,
    {
      active: false,
    },
    {
      new: true,
    },
  );
};

export default {
  createCoupon,

  getAllCoupons,

  getCouponById,

  getCouponByCode,

  validateCoupon,

  incrementCouponUsage,

  markCouponAsUsed,

  updateCoupon,

  deleteCoupon,

  deactivateCoupon,
};
