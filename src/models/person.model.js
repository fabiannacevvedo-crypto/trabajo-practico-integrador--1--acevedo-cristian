import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";

export const PersonModel = sequelize.define(
  "Person",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    // createdAt: "created_at",
    // updatedAt: false,
    // timestamps: false,
    paranoid: true,
  },
);
