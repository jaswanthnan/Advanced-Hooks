import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  role: string;
  experience: string;
  status: 'In Review' | 'Hired' | 'Pending' | 'Rejected';
  skills?: string[];
  createdAt: Date;
}

const candidateSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['In Review', 'Hired', 'Pending', 'Rejected']
  },
  skills: { type: [String] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICandidate>('Candidate', candidateSchema);
