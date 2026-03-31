import { db } from '../shared/config/database.js';
import { users } from '../infrastructure/database/drizzle/schema/index.js';

async function listUsers() {
  console.log('📋 Connecting to database and fetching all users...\n');

  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    firstname: users.firstname,
    lastname: users.lastname,
    password: users.password,
    deletedAt: users.deletedAt,
  }).from(users);

  console.log(`✅ Found ${allUsers.length} users\n`);

  if (allUsers.length === 0) {
    console.log('❌ No users found!');
  } else {
    console.table(allUsers);
  }

  process.exit(0);
}

listUsers().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
