import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  reviewerId: Types.ObjectId;
  revieweeId: Types.ObjectId;
  propertyId?: Types.ObjectId;
  role: 'byInquilino' | 'byPropietario';
  score: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  reviewerId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId:  { type: Schema.Types.ObjectId, ref: 'Property' },
  role:        { type: String, enum: ['byInquilino','byPropietario'], required: true },
  score:       { type: Number, min: 1, max: 5, required: true },
  comment:     { type: String, maxlength: 300 },
}, { timestamps: true });

export default model<IReview>('Review', ReviewSchema);
