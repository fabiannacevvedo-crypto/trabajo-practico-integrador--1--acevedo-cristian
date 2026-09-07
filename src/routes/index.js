import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { articleRouter } from "./article.routes.js";
import { tagRouter } from "./tag.routes.js";
import { articleTagRouter } from "./articleTag.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/articles", articleRouter);
router.use("/tags", tagRouter);
router.use("/articles-tags", articleTagRouter);

export default router;
