import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

/**
 * GET /api/products/live
 * Returns products within active sale window
 */
router.get("/live", async (req, res, next) => {
  try {
    const now = new Date();

    const products = await prisma.product.findMany({
      where: {
        saleStartsAt: { lte: now },
        saleEndsAt: { gte: now }
      }
    });

    const result = await Promise.all(
      products.map(async (product) => {
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

        const used =
          (confirmed._sum.quantity || 0) +
          (pending._sum.quantity || 0);

        const liveStock = product.totalStock - used;

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          totalStock: product.totalStock,
          liveStock,
          percentageSold: Math.round(
            ((confirmed._sum.quantity || 0) / product.totalStock) * 100
          ),
          saleEndsAt: product.saleEndsAt
        };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});


/**
 * GET /api/products/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
