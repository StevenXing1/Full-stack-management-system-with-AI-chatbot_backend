import { Router } from "express";
import { authorization } from "../middlewares/authorization";
import { PERMISSIONS } from "../constants";
import { createOrder, getOrder, listOrders, updateOrder, deleteOrder } from "../controllers/orders";

const router = Router()

router.get('/orders', authorization(PERMISSIONS.ORDERS.READ), listOrders)
router.get('/orders/:id', authorization(PERMISSIONS.ORDERS.READ), getOrder)
router.post('/orders', authorization(PERMISSIONS.ORDERS.EDIT), createOrder)
router.put('/orders/:id', authorization(PERMISSIONS.ORDERS.EDIT), updateOrder)
router.delete('/orders/:id', authorization(PERMISSIONS.ORDERS.EDIT), deleteOrder)

export default router