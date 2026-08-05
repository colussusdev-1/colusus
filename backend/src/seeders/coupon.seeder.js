import Coupon from "../modules/coupons/coupon.model.js";

/*
|--------------------------------------------------------------------------
| Seed Default Coupons
|--------------------------------------------------------------------------
*/

const seedCoupons = async () => {
  try {
    const existingCoupon = await Coupon.findOne({
      code: "FREECONSULT",
    });

    if (existingCoupon) {
      console.log("✓ FREECONSULT coupon already exists.");

      return;
    }

    await Coupon.create({
      code: "FREECONSULT",

      description: "Free migration consultation",

      discountType: "FULL",

      discountValue: 100,

      active: true,

      usageLimit: null,

      usedCount: 0,
    });

    console.log("✓ FREECONSULT coupon seeded successfully.");
  } catch (error) {
    console.error("Coupon seeding failed.");

    console.error(error);
  }
};

export default seedCoupons;
