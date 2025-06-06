import { model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "Propietario" | "Interesado";
  isVerified: boolean;
  profileImageUrl?: string;
  averageScore?: number;
  reviewCount?: number;
  verifyToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Propietario", "Interesado"],
      default: "Interesado",
    },
    profileImageUrl: { type: String }, 
    averageScore: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    verifyToken: { type: String },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
