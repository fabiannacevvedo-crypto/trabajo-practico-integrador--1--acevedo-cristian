import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";
import { PersonModel } from "./person.model.js";

export const UserModel = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "People",
        key: "id",
      },
    },
  },
  {
    // Other model options go here
    // createdAt: "created_at",
    // updatedAt: false,
    timestamps: false,
  },
);

// relaciones
// relacion uno a uno
UserModel.belongsTo(PersonModel, {
  foreignKey: "person_id",
  as: "owner",
  // onDelete: "CASCADE",
});

PersonModel.hasOne(UserModel, { foreignKey: "person_id", as: "user" });
