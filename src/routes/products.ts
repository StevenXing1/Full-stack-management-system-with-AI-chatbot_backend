import { Router } from "express";
import { getProduct, listProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products";
import { authorization } from "../middlewares/authorization";
import { PERMISSIONS } from "../constants";

const router = Router()

router.get('/products', authorization(PERMISSIONS.PRODUCTS.READ), listProducts)
router.get('/products/:id', authorization(PERMISSIONS.PRODUCTS.READ), getProduct)
router.post('/products', authorization(PERMISSIONS.PRODUCTS.EDIT), createProduct)
router.put('/products/:id', authorization(PERMISSIONS.PRODUCTS.EDIT), updateProduct)
router.delete('/products/:id', authorization(PERMISSIONS.PRODUCTS.EDIT), deleteProduct)

export default router