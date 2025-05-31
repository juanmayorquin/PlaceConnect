// backend/src/models/Notification.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  messageId?: Types.ObjectId;
  agreementId?: Types.ObjectId;
  type: 'message' | 'agreement-request' | 'agreement-accepted';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageId:   { type: Schema.Types.ObjectId, ref: 'Message' },
  agreementId: { type: Schema.Types.ObjectId, ref: 'Agreement' },
  type:        { type: String, enum: ['message','agreement-request','agreement-accepted'], required: true },
  read:        { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<INotification>('Notification', NotificationSchema);
