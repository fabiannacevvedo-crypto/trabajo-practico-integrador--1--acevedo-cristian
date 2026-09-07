import { sequelize } from "../config/database.js";
import { User, UserModel } from "./user.model.js";
import { Profile, ProfileModel } from "./profile.model.js";
import { Article, ArticleModel } from "./article.model.js";
import { Tag, TagModel } from "./tag.model.js";
import { ArticleTag, ArticleTagModel } from "./articleTag.model.js";

// ==========================================
// 1. Relación 1:1: User ↔ Profile
// ==========================================
User.hasOne(Profile, {
  foreignKey: "user_id",
  as: "profile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Profile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ==========================================
// 2. Relación 1:N: User → Article
// ==========================================
User.hasMany(Article, {
  foreignKey: "user_id",
  as: "articles",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Article.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ==========================================
// 3. Relación N:M: Article ↔ Tag
// ==========================================
Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: "article_id",
  otherKey: "tag_id",
  as: "tags",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: "tag_id",
  otherKey: "article_id",
  as: "articles",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Asociaciones directas con la tabla intermedia ArticleTag
Article.hasMany(ArticleTag, {
  foreignKey: "article_id",
  as: "article_tags",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ArticleTag.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Tag.hasMany(ArticleTag, {
  foreignKey: "tag_id",
  as: "article_tags",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ArticleTag.belongsTo(Tag, {
  foreignKey: "tag_id",
  as: "tag",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  sequelize,
  User,
  UserModel,
  Profile,
  ProfileModel,
  Article,
  ArticleModel,
  Tag,
  TagModel,
  ArticleTag,
  ArticleTagModel,
};

export default {
  sequelize,
  User,
  UserModel,
  Profile,
  ProfileModel,
  Article,
  ArticleModel,
  Tag,
  TagModel,
  ArticleTag,
  ArticleTagModel,
};
