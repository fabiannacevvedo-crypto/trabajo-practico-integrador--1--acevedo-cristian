import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class ArticleTag extends Model {}

ArticleTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "ArticleTag",
    tableName: "article_tags",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export const ArticleTagModel = ArticleTag;
export default ArticleTag;
