/**
 * Toggle the isAdmin flag on a user by email.
 *
 * Grant:  pnpm tsx prisma/set-admin.ts <email>
 * Revoke: pnpm tsx prisma/set-admin.ts <email> --revoke
 *
 * Admin users bypass all module + within-module unlock checks. Their actual
 * progress (passed problems, lesson reads) is unchanged.
 *
 * Caveat: isAdmin is baked into the JWT at login time. After toggling, the
 * affected user must log out and log back in for the new value to take effect.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith('--'));
  const revoke = args.includes('--revoke');

  if (!email) {
    console.error('Usage: pnpm tsx prisma/set-admin.ts <email> [--revoke]');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  if (user.isAdmin === !revoke) {
    console.log(`User ${email} is already ${revoke ? 'not an admin' : 'an admin'} — nothing to do.`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isAdmin: !revoke },
  });

  console.log(
    `${revoke ? '−' : '✓'} ${email} isAdmin is now ${!revoke}. They must log out and back in for the change to take effect.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
