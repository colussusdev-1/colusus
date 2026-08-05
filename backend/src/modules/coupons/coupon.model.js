import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Coupon Information
    |--------------------------------------------------------------------------
    */

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | Discount
    |--------------------------------------------------------------------------
    */

    discountType: {
      type: String,
      enum: ["FIXED", "PERCENTAGE", "FULL"],
      default: "FULL",
    },

    discountValue: {
      type: Number,
      default: 100,

      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Usage
    |--------------------------------------------------------------------------
    */

    usageLimit: {
      type: Number,

      default: null,

      min: 1,
    },

    usedCount: {
      type: Number,

      default: 0,

      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    active: {
      type: Boolean,

      default: true,
    },

    expiresAt: {
      type: Date,

      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Virtual
|--------------------------------------------------------------------------
*/

couponSchema.virtual("remainingUses").get(function () {
  if (this.usageLimit === null) {
    return "Unlimited";
  }

  return Math.max(this.usageLimit - this.usedCount, 0);
});

/*
|--------------------------------------------------------------------------
| JSON
|--------------------------------------------------------------------------
*/

couponSchema.set("toJSON", {
  virtuals: true,
});

couponSchema.set("toObject", {
  virtuals: true,
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
