import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

/**
 * GET /api/admin/metrics
 */
router.get("/metrics", async (req, res, next) => {
  try {
    const [
      totalHolds,
      expiredOrders,
      confirmedOrders,
      products
    ] = await Promise.all([
      prisma.inventoryEvent.count({
        where: { type: "HOLD_CREATED" }
      }),
      prisma.order.count({
        where: { status: "EXPIRED" }
      }),
      prisma.order.count({
        where: { status: "CONFIRMED" }
      }),
      prisma.product.findMany()
    ]);

    const stockRemaining = await Promise.all(
      products.map(async (product) => {
        const reserved = await prisma.order.aggregate({
          where: {
            productId: product.id,
            status: "PENDING",
            holdExpiresAt: { gt: new Date() }
          },
          _sum: { quantity: true }
        });

        const confirmed = await prisma.order.aggregate({
          where: {
            productId: product.id,
            status: "CONFIRMED"
          },
          _sum: { quantity: true }
        });

        const used =
          (reserved._sum.quantity || 0) +
          (confirmed._sum.quantity || 0);

        

        return {
  productId: product.id,
  name: product.name,
  totalStock: product.totalStock,

  confirmedCount: confirmed._sum.quantity || 0,

  pendingCount: reserved._sum.quantity || 0,

  expiredCount: await prisma.order.count({
    where: {
      productId: product.id,
      status: "EXPIRED"
    }
  }),

  liveStock: product.totalStock - used
};
      })
    );

    res.json({
      totalHoldsCreated: totalHolds,
      holdsExpired: expiredOrders,
      confirmedOrders,
      oversellAttemptsBlocked: 0,
      stockRemaining
    });
  } catch (err) {
    next(err);
  }
});

export default router;
