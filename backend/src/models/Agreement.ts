// backend/src/models/Agreement.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IAgreement extends Document {
  propertyId: Types.ObjectId;
  ownerId: Types.ObjectId;
  tenantId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'cancelled' | 'completed';
  reasonCancel?: string;
  contractUrl?: string;
}

const AgreementSchema = new Schema<IAgreement>({
  propertyId:   { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  ownerId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate:    { type: Date, required: true },
  endDate:      { type: Date, required: true },
  status:       { type: String, enum: ['pending','active','cancelled','completed'], default: 'pending' }, // <— default cambiado
  reasonCancel: { type: String },
  contractUrl:  { type: String }
}, { timestamps: true });

export default model<IAgreement>('Agreement', AgreementSchema);
