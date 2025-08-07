import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLocaleLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

async function main() {

  const defaultPassword = await hash('123')

  const users = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
    password: defaultPassword,
  }));

  // Create users first
  console.log('Creating users...');
  await prisma.user.createMany({
    data: users,
  }
  );

  // Get all user IDs
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const userIds = allUsers.map((user) => user.id);

  // Create posts
  console.log('Creating posts...');
  const posts = await Promise.all(
    Array.from({ length: 400 }).map(() =>
      prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          slug: generateSlug(faker.lorem.sentence()),
          content: faker.lorem.paragraphs(3),
          thumbnail: `https://picsum.photos/seed/${Math.random()}/800/600`,
          authorId: faker.helpers.arrayElement(userIds),
          published: true,
        },
      }),
    ),
  );

  // Create comments for each post
  console.log('Creating comments...');
  await Promise.all(
    posts.map((post) =>
      prisma.comment.createMany({
        data: Array.from({ length: 20 }).map(() => ({
          content: faker.lorem.sentence(),
          authorId: faker.helpers.arrayElement(userIds),
          postId: post.id,
        })),
      }),
    ),
  );

  console.log('Seeding completed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
