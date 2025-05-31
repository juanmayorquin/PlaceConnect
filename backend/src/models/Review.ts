import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  agreementId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  targetType: 'user' | 'property';
  userId?: Types.ObjectId;
  propertyId?: Types.ObjectId;
  rating: number;
  comment?: string;
}


const ReviewSchema = new Schema<IReview>({
  agreementId: { type: Schema.Types.ObjectId, ref: 'Agreement', required: true },
  reviewerId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetType:  { type: String, enum: ['user', 'property'], required: true },
  userId:      { type: Schema.Types.ObjectId, ref: 'User' },
  propertyId:  { type: Schema.Types.ObjectId, ref: 'Property' },
  rating:      { type: Number, min: 1, max: 5, required: true },
  comment:     { type: String, maxlength: 300 }
}, { timestamps: true });

export default model<IReview>('Review', ReviewSchema);
