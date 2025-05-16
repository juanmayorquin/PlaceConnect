import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  propertyId: Types.ObjectId;
  reporterId: Types.ObjectId;
  reason: string;
  comment?: string;
  createdAt: Date;
  reviewed: boolean;
  decision?: 'invalid' | 'removed';
}

const ReportSchema = new Schema<IReport>({
  propertyId:   { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  reporterId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason:       { type: String, required: true },
  comment:      { type: String },
  reviewed:     { type: Boolean, default: false },
  decision:     { type: String, enum: ['invalid','removed'] }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IReport>('Report', ReportSchema);