import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedTeamflowAdmin = async () => {
  if (process.env.SEED_TEAMFLOW_ADMIN !== 'true') return null;

  const email = process.env.TEAMFLOW_ADMIN_EMAIL || 'teamflow@admin.com';
  const password = process.env.TEAMFLOW_ADMIN_PASSWORD;

  if (!password) {
    throw new Error('TEAMFLOW_ADMIN_PASSWORD is required when SEED_TEAMFLOW_ADMIN=true');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    {
      name: 'TeamFlow Admin',
      email,
      password: passwordHash,
      role: 'teamflow-admin',
      organization: null
    },
    { new: true, upsert: true, runValidators: true }
  ).select('name email role');

  console.log(`TeamFlow admin ready: ${admin.email} (${admin.role})`);
  return admin;
};
