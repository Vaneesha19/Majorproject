// import { Router } from "express";

// import { verifyToken } from "../middlewares/AuthMiddleware.js";
// import {
//   approveOrder,  // ✅ Renamed from confirmOrder to approveOrder
//   createOrder,
//   getBuyerOrders,
//   getSellerOrders,
// } from "../controllers/OrdersControllers.js";

// export const orderRoutes = Router();

// orderRoutes.post("/create", verifyToken, createOrder);
// orderRoutes.put("/approveOrder", verifyToken, approveOrder); // ✅ Fix route name
// orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders);
// orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders);


import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  approveOrder,  // ✅ Ensure this is correctly imported
  createOrder,
  getBuyerOrders,
  getSellerOrders,
} from "../controllers/OrdersControllers.js";

export const orderRoutes = Router();

orderRoutes.post("/approve", verifyToken, approveOrder);  // ✅ Fix Route Path
orderRoutes.post("/create", verifyToken, createOrder);
orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders);
orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders);
