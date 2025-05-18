import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  propertyId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  content:    { type: String, required: true }
}, { timestamps: true });

export default model<IMessage>('Message', MessageSchema);