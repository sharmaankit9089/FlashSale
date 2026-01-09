console.log("Running seed...");

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  await prisma.product.createMany({
    data: [
      {
        name: "Beard Trimmer Pro",
        description: "Rechargeable beard trimmer with precision settings",
        price: 1999,
        totalStock: 80,
        saleStartsAt: new Date(now.getTime() - 3 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 3 * 60 * 1000)
      },
      {
        name: "Electric Shaver X",
        description: "Skin-friendly electric shaver for daily grooming",
        price: 2499,
        totalStock: 60,
        saleStartsAt: new Date(now.getTime() - 66 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 66 * 60 * 60 * 1000)
      },
      {
        name: "Hair Styling Wax",
        description: "Strong hold hair wax with matte finish",
        price: 499,
        totalStock: 150,
        saleStartsAt: new Date(now.getTime() -  10 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() +  10 * 60 * 1000)
      },
      {
        name: "Beard Growth Oil",
        description: "Natural beard oil for faster and healthier growth",
        price: 699,
        totalStock: 120,
        saleStartsAt: new Date(now.getTime() - 82 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 82 * 60 * 60 * 1000)
      },
      {
        name: "Aftershave Lotion",
        description: "Cooling aftershave lotion with aloe vera",
        price: 599,
        totalStock: 100,
        saleStartsAt: new Date(now.getTime() - 5 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() +  5 * 60 * 1000)
      },
      {
        name: "Men’s Face Wash",
        description: "Deep cleansing face wash for oily skin",
        price: 349,
        totalStock: 200,
        saleStartsAt: new Date(now.getTime() - 80 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 80 * 60 * 60 * 1000)
      },
      {
        name: "Hair Dryer Compact",
        description: "Compact hair dryer with heat protection",
        price: 1799,
        totalStock: 50,
        saleStartsAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 6 * 60 * 60 * 1000)
      },
      {
        name: "Beard Comb Kit",
        description: "Wooden beard comb and grooming kit",
        price: 299,
        totalStock: 180,
        saleStartsAt: new Date(now.getTime() - 65 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 65 * 60 * 60 * 1000)
      },
      {
        name: "Men’s Grooming Kit",
        description: "Complete grooming kit with trimmer and accessories",
        price: 3499,
        totalStock: 40,
        saleStartsAt: new Date(now.getTime() - 15 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 15 * 60 * 1000)
      },
      {
        name: "Flash Headphones",
        description: "Wireless headphones with noise cancellation",
        price: 2999,
        totalStock: 100,
        saleStartsAt: new Date(now.getTime() - 64 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 64 * 60 * 60 * 1000)
      },
      {
        name: "Smart Watch",
        description: "Fitness tracking smart watch",
        price: 4999,
        totalStock: 50,
        saleStartsAt: new Date(now.getTime() - 45 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 45 * 60 * 60 * 1000)
      },
      {
        name: "Gaming Mouse",
        description: "High precision RGB gaming mouse",
        price: 1999,
        totalStock: 30,
        saleStartsAt: new Date(now.getTime() - 42 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() + 42 * 60 * 60 * 1000)
      },
      {
        name: "Keyboard",
        description: "Mechanical keyboard (sale ended)",
        price: 3499,
        totalStock: 40,
        saleStartsAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        saleEndsAt: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      }
    ]
  });
}

main()
  .then(() => console.log("Seed data inserted"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
