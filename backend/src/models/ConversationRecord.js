import mongoose from 'mongoose';

const turnSchema = new mongoose.Schema({
  speaker: String,
  starts_at_seconds: Number,
  timecode: String,
  text: String
}, { _id: false });

const transcriptPayloadSchema = new mongoose.Schema({
  meeting_id: String,
  turns: [turnSchema],
  unavailable_reason: String
}, { _id: false });

const conversationRecordSchema = new mongoose.Schema({
  // Identity (source_type + source_id is the unique key per data contract)
  record_ref:   { type: String, required: true, index: true },
  source_type:  { type: String, enum: ['call', 'meeting'], required: true },
  source_id:    { type: String, required: true },

  // Which batch brought this record and at which revision
  batch_id:         { type: String, default: null },
  applied_revision: { type: Number, default: 1 },

  // Raw payload from source system (call or meeting fields)
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Structured transcript (meetings only; calls store transcript inside payload.transcript)
  transcript_payload: { type: transcriptPayloadSchema, default: null },

  // Routing — auto-assigned or manually overridden
  routes:         { type: [String], default: [] },
  manual_override: { type: Boolean, default: false },

  // Analysis fields (pre-generated, preserved through re-imports)
  analysis: {
    summary:    { type: String, default: null },
    evidence:   { type: String, default: null },
    evidence_ref: { type: String, default: null },
    coaching:   { type: String, default: null },
    next_steps: { type: String, default: null },
    limitations: { type: String, default: null },
    company:    { type: String, default: null },
    title:      { type: String, default: null },
    is_late_update: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Compound unique index: (source_type, source_id) — data contract identity
conversationRecordSchema.index({ source_type: 1, source_id: 1 }, { unique: true });

export default mongoose.model('ConversationRecord', conversationRecordSchema);
