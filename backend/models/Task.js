import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.pre('save', function setUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

taskSchema.pre('findOneAndUpdate', function setFindUpdatedAt(next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.model('Task', taskSchema);
