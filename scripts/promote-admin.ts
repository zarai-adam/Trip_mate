import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Error: Please specify the email address of the user to promote.");
    console.log("👉 Usage: npm run promote-admin <email>");
    process.exit(1);
  }

  const cleanEmail = email.trim().toLowerCase();

  console.log(`Searching for user with email: ${cleanEmail}...`);

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user) {
    console.error(`❌ Error: No user found with email "${cleanEmail}".`);
    console.log("💡 Tip: Make sure you register this user first via the website's registration page, then run this promotion script again.");
    process.exit(1);
  }

  if (user.role === UserRole.ADMIN) {
    console.log(`ℹ️ Info: User "${cleanEmail}" is already an ADMIN.`);
    return;
  }

  console.log(`Promoting user "${user.firstName} ${user.lastName}" (${cleanEmail}) to ADMIN role...`);

  const updatedUser = await prisma.user.update({
    where: { email: cleanEmail },
    data: {
      role: UserRole.ADMIN,
      emailVerified: true, // Auto-verify email for the admin
    },
  });

  console.log(`✅ Success! User "${updatedUser.firstName} ${updatedUser.lastName}" is now an ADMIN. They can log in immediately.`);
}

main()
  .catch((e) => {
    console.error("❌ An error occurred during promotion:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
