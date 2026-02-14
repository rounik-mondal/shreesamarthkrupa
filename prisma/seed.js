const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing data (optional, be careful in production)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  console.log("Seeding Luxury Products...");

  // 2. Create the "Royal Velvet Sofa"
  const sofa = await prisma.product.create({
    data: {
      name: "The Royal Chesterfield",
      description: "A handcrafted masterpiece featuring deep button tufting and rolled arms.",
      basePrice: 45000,
      category: "SOFA",
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
      ],
      // The JSON Logic for Customization
      options: {
        customizable: true,
        steps: [
          {
            id: "fabric",
            name: "Choose Fabric",
            type: "select",
            choices: [
              { label: "Classic Linen (Beige)", value: "linen_beige", price: 0, image: "/textures/linen.png" },
              { label: "Royal Velvet (Blue)", value: "velvet_blue", price: 2500, image: "/textures/velvet.png" }
            ]
          },
          {
            id: "legs",
            name: "Leg Finish",
            type: "select",
            choices: [
              { label: "Dark Walnut", value: "walnut", price: 0 },
              { label: "Gold Plated", value: "gold", price: 1500 }
            ]
          }
        ]
      }
    }
  });

  // 3. Create "Imperial Wallpaper"
  const wallpaper = await prisma.product.create({
    data: {
      name: "Imperial Damask Wallpaper",
      description: "Hand-printed textured wallpaper with gold leaf accents.",
      basePrice: 120, // Per sq. ft.
      category: "WALLPAPER",
      images: [
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop"
      ],
      options: {
        customizable: true,
        steps: [
          {
            id: "dimensions",
            name: "Wall Dimensions",
            type: "measurement",
            validation: { minWidth: 50, maxWidth: 500, unit: "sqft" }
          }
        ]
      }
    }
  });

  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });