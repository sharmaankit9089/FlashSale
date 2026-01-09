import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();



/**
 * GET /api/orders/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});




/**
 * POST /api/orders/:id/confirm
 */
router.post("/:id/confirm", async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const now = new Date();

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ message: "Order cannot be confirmed" });
    }

    if (now > order.holdExpiresAt) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "EXPIRED" }
      });

      return res.status(400).json({ message: "Hold expired" });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED" }
    });

    await prisma.inventoryEvent.create({
      data: {
        productId: order.productId,
        type: "ORDER_CONFIRMED",
        delta: 0,
        metadata: { orderId: order.id }
      }
    });

    res.json({ message: "Order confirmed" });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders?email=user@mail.com
 */
router.get("/", async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const orders = await prisma.order.findMany({
      where: { customerEmail: String(email) },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
