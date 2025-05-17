import express from "express";
import authUser from "../middlewares/authUser.js";
import { createPaymentIntent, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", authUser, createPaymentIntent);
router.get("/verify-payment", authUser, verifyPayment);

export default router;
