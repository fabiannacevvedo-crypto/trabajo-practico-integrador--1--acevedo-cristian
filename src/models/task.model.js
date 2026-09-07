import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";
import { UserModel } from "./user.model.js";

export const TaskModel = sequelize.define(
  "Task",
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
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
// relacion uno a muchos
TaskModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "author",
  // onDelete: "CASCADE",
});

UserModel.hasMany(TaskModel, { foreignKey: "user_id", as: "tareas" });
