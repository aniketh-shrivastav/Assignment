import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  listAllProductsForAdmin,
  listProducts,
  updateProduct,
} from "../../controllers/productController.js";
import { authenticate } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../../utils/schemas.js";

const router = Router();

router.use(authenticate);

router.get("/admin/all", authorize("admin"), listAllProductsForAdmin);
router.post("/", validate(createProductSchema), createProduct);
router.get("/", listProducts);
router.get("/:id", validate(productIdParamSchema), getProductById);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", validate(productIdParamSchema), deleteProduct);

export default router;
