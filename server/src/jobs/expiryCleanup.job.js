import prisma from "../config/prisma.js";

export async function runExpiryCleanup() {
  const now = new Date();

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      holdExpiresAt: { lt: now }
    }
  });

  if (expiredOrders.length === 0) return;

  for (const order of expiredOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "EXPIRED" }
    });

    await prisma.inventoryEvent.create({
      data: {
        productId: order.productId,
        type: "HOLD_RELEASED",
        delta: order.quantity,
        metadata: { orderId: order.id }
      }
    });
  }

  console.log(`Expired ${expiredOrders.length} orders`);
}
