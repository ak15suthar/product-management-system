import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    },
  });

  console.log('Users created:', { admin: admin.email, user: user.email });

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Automotive',
    'Health & Beauty',
  ];

  const createdCategories = [];
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdCategories.push(category);
  }

  console.log('Categories created:', createdCategories.map((c) => c.name));

  const products = [
    { name: 'Laptop', price: 999.99, categoryId: createdCategories[0].id },
    { name: 'Smartphone', price: 699.99, categoryId: createdCategories[0].id },
    { name: 'Headphones', price: 149.99, categoryId: createdCategories[0].id },
    { name: 'T-Shirt', price: 29.99, categoryId: createdCategories[1].id },
    { name: 'Jeans', price: 59.99, categoryId: createdCategories[1].id },
    { name: 'JavaScript Guide', price: 39.99, categoryId: createdCategories[2].id },
    { name: 'TypeScript Handbook', price: 44.99, categoryId: createdCategories[2].id },
    { name: 'Garden Tools Set', price: 79.99, categoryId: createdCategories[3].id },
    { name: 'Yoga Mat', price: 24.99, categoryId: createdCategories[4].id },
    { name: 'Building Blocks', price: 34.99, categoryId: createdCategories[5].id },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { uuid: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: product,
    });
  }

  console.log('Products created:', products.length);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
