import { Router } from "express";
import {
  getSessionUser,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset
} from "../controllers/authController.js";
import { getCategoryMenu } from "../controllers/categoryMenuController.js";
import { getCategoryShowcase } from "../controllers/categoryShowcaseController.js";
import {
  createCollectionProductReview,
  getCollectionBySlug,
  getCollectionProductDetail
} from "../controllers/collectionCatalogController.js";
import { getHealth } from "../controllers/healthController.js";
import { getHomepageSections } from "../controllers/homepageSectionsController.js";
import { createOrder, getOrderByNumber } from "../controllers/orderController.js";

const router = Router();

router.get("/health", getHealth);
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/session", getSessionUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/forgot-password", requestPasswordReset);
router.post("/orders", createOrder);
router.get("/orders/:orderNumber", getOrderByNumber);
router.get("/homepage-sections", getHomepageSections);
router.get("/category-menu", getCategoryMenu);
router.get("/category-showcase", getCategoryShowcase);
router.post("/collections/:slug/products/:productId/reviews", createCollectionProductReview);
router.get("/collections/:slug/products/:productId", getCollectionProductDetail);
router.get("/collections/:slug", getCollectionBySlug);

export default router;
