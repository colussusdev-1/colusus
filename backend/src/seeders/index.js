import seedCoupons from "./coupon.seeder.js";
import seedOpportunities from "./opportunity.seeder.js";

const seedDatabase = async () => {
  await seedCoupons();
  await seedOpportunities();
};

export default seedDatabase;
