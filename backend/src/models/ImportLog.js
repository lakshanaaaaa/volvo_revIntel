import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  batch_id:        { type: String, required: true },
  revision:       { type: Number, default: 1 },
  added:          { type: Number, default: 0 },
  updated:        { type: Number, default: 0 },
  ignored:        { type: Number, default: 0 },
  total_records:  { type: Number, default: 0 },
  details:        { type: mongoose.Schema.Types.Mixed, default: [] },
}, { timestamps: true });

export default mongoose.model('ImportLog', importLogSchema);
