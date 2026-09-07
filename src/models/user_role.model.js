import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";
import { UserModel } from "./user.model.js";
import { RoleModel } from "./role.model.js";

export const UserRoleModel = sequelize.define(
  "User_Role",
  {
    
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
  },
  {
    // Other model options
    // createdAt: "created_at",
    // updatedAt: false,
    timestamps: false,
  },
);

// relaciones
// relacion muchos a muchos
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: "user_id",
  as: "roles",
});

RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  foreignKey: "role_id",
  as: "users",
});
