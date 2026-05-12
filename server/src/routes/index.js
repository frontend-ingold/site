import { Router } from "express";
import { getCategoryMenu } from "../controllers/categoryMenuController.js";
import { getHealth } from "../controllers/healthController.js";

const router = Router();

router.get("/health", getHealth);
router.get("/category-menu", getCategoryMenu);

export default router;
