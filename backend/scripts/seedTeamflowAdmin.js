import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = 'teamflow@admin.com';
const password = 'admin@1234';

const seedTeamflowAdmin = async () => {
  await connectDB();

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
  await mongoose.disconnect();
};

seedTeamflowAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
