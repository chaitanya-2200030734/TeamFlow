import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teamflow-admin', 'admin', 'member'], default: 'member' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
