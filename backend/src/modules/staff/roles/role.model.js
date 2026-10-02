import mongoose from "mongoose";

import { ALL_PERMISSIONS } from "../permissions/permission.constants.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    permissions: {
      type: [
        {
          type: String,
          enum: ALL_PERMISSIONS,
        },
      ],
      default: [],
    },

    isSystem: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Role = mongoose.model("StaffRole", roleSchema);

export default Role;
