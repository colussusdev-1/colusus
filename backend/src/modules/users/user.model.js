import mongoose from "mongoose";

import { ALL_PERMISSIONS } from "../staff/permissions/permission.constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["CLIENT", "ADMIN", "DEVELOPER", "STAFF"],
      default: "CLIENT",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | STAFF MANAGEMENT
    |--------------------------------------------------------------------------
    */

    staffRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffRole",
      default: null,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffDepartment",
      default: null,
    },

    position: {
      type: String,
      trim: true,
      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | DIRECT ACCESS OVERRIDES
    |--------------------------------------------------------------------------
    |
    | These allow an administrator to grant or explicitly deny individual
    | permissions without changing the staff member's role.
    |
    */

    permissionGrants: {
      type: [
        {
          type: String,
          enum: ALL_PERMISSIONS,
        },
      ],
      default: [],
    },

    permissionDenials: {
      type: [
        {
          type: String,
          enum: ALL_PERMISSIONS,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
