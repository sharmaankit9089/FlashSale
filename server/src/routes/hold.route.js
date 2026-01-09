import { Router } from "express";
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";

const router = Router();

const HOLD_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const LOCK_TTL_MS = 5000; // 5 seconds

router.post("/", async (req, res, next) => {
  const { productId, email, qty } = req.body;

  // 1️⃣ Basic validation
  if (!productId || !email || !qty || qty <= 0) {
    return res.status(400).json({
      message: "Invalid request body"
    });
  }

  const lockKey = `lock:product:${productId}`;
  const lockValue = Date.now().toString();

  try {
    // 2️⃣ Acquire Redis lock (race safety)
    const lockAcquired = await redis.set(
      lockKey,
      lockValue,
      "PX",
      LOCK_TTL_MS,
      "NX"
    );

    if (!lockAcquired) {
      return res.status(429).json({
        message: "Product is busy, try again"
      });
    }

    const now = new Date();

    // 3️⃣ Fetch product
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // 4️⃣ Sale window validation
    if (now < product.saleStartsAt || now > product.saleEndsAt) {
      return res.status(400).json({
        message: "Sale not active"
      });
    }

    // 5️⃣ HARD BLOCK: qty > total stock (ABSOLUTE RULE)
    if (qty > product.totalStock) {
      return res.status(400).json({
        message: "Requested quantity exceeds total stock"
      });
    }

    // 6️⃣ Calculate USED stock (CONFIRMED + ACTIVE PENDING)
    const confirmed = await prisma.order.aggregate({
      where: {
        productId: product.id,
        status: "CONFIRMED"
      },
      _sum: { quantity: true }
    });

    const pending = await prisma.order.aggregate({
      where: {
        productId: product.id,
        status: "PENDING",
        holdExpiresAt: { gt: now }
      },
      _sum: { quantity: true }
    });

    const usedStock =
      (confirmed._sum.quantity || 0) +
      (pending._sum.quantity || 0);

    const liveStock = product.totalStock - usedStock;

    // 7️⃣ FINAL STOCK CHECK (NO OVERSALE)
    if (liveStock < qty) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // 8️⃣ Create HOLD (pending order)
    const holdExpiresAt = new Date(now.getTime() + HOLD_DURATION_MS);

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        customerEmail: email,
        quantity: qty,
        status: "PENDING",
        holdExpiresAt
      }
    });

    // 9️⃣ Log inventory event
    await prisma.inventoryEvent.create({
      data: {
        productId: product.id,
        type: "HOLD_CREATED",
        delta: -qty,
        metadata: {
          orderId: order.id
        }
      }
    });

    // 🔟 Success response
    res.status(201).json({
      orderId: order.id,
      holdExpiresAt
    });
  } catch (err) {
    next(err);
  } finally {
    // 🔁 Safe lock release
    const currentValue = await redis.get(lockKey);
    if (currentValue === lockValue) {
      await redis.del(lockKey);
    }
  }
});

export default router;
