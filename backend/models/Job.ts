import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String },
  requirements: { type: [String] }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', jobSchema);
