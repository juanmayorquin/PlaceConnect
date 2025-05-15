import { Schema, model, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  type: 'apartamento'|'casa'|'habitación'|'parqueo'|'bodega';
  conditions?: string;
  images: string[]; // URLs
  status: 'disponible'|'en_proceso'|'arrendado'|'inactivo';
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  price:       { type: Number, required: true, min: 0 },
  type:        { type: String, enum: ['apartamento','casa','habitación','parqueo','bodega'], required: true },
  conditions:  { type: String },
  images:      [{ type: String }],
  status:      { type: String, enum: ['disponible','en_proceso','arrendado','inactivo'], default: 'disponible' },
}, { timestamps: true });

export default model<IProperty>('Property', PropertySchema);
