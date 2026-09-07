import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";

export const RoleModel = sequelize.define(
  "Role",
  {
    // Model attributes are defined here
    rolename: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    // createdAt: "created_at",
    // updatedAt: false,
    timestamps: false,
  },
);
