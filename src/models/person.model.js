import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";

export const PersonModel = sequelize.define(
  "Person",
  {
    
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
    // Other model options 
    // createdAt: "created_at",
    // updatedAt: false,
    timestamps: false,
  },
);
