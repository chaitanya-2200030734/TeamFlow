import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedTeamflowAdmin } from '../utils/seedTeamflowAdmin.js';

dotenv.config();

const run = async () => {
  await connectDB();
  process.env.SEED_TEAMFLOW_ADMIN = 'true';
  process.env.TEAMFLOW_ADMIN_EMAIL = process.env.TEAMFLOW_ADMIN_EMAIL || 'teamflow@admin.com';
  process.env.TEAMFLOW_ADMIN_PASSWORD = process.env.TEAMFLOW_ADMIN_PASSWORD || 'admin@1234';
  await seedTeamflowAdmin();
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
