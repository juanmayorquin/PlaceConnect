import { Schema, model, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  type: 'apartamento'|'casa'|'habitación'|'parqueo'|'bodega';
  keypoints: string[];
  bathrooms: number;
  bedrooms: number;
  images: string[]; // URLs
  status: 'disponible'|'en_proceso'|'arrendado'|'inactivo';
  createdAt: Date;
  updatedAt: Date;
  location: {
    tower: number;
    apartment: number;
  };
  area: number;
}

const PropertySchema = new Schema<IProperty>({
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  price:       { type: Number, required: true, min: 0 },
  type:        { type: String, enum: ['apartamento','casa','habitación','parqueo','bodega'], required: true },
  keypoints:   [{ type: String }],
  bathrooms:   { type: Number, required: true, min: 0 },
  bedrooms:    { type: Number, required: true, min: 0 },
  images:      [{ type: String }],
  status:      { type: String, enum: ['disponible','en_proceso','arrendado','inactivo'], default: 'disponible' },
  location: {
    type: {
      tower: { type: Number, required: true },
      apartment: { type: Number, required: true },
    },
    required: true
  },
  area: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default model<IProperty>('Property', PropertySchema);
