import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'on-hold', 'completed'], default: 'active' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline: { type: Date },
  color: { type: String, default: '#C0622F' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
