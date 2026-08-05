import seedCoupons from "./coupon.seeder.js";

const seedDatabase = async () => {
  await seedCoupons();
};

export default seedDatabase;
