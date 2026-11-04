import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem extends Document {
  userId: string;
  groupId?: string;
  title: string;
  estimatedPrice: number;
  currency: string;
  link?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: { type: String, required: true, index: true },
    groupId: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    estimatedPrice: { type: Number, default: 0 },
    currency: { type: String, default: '$' },
    link: { type: String, default: '' },
    notes: { type: String, default: '' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  },
  { timestamps: true }
);

export const WishlistModel = mongoose.models.Wishlist || mongoose.model<IWishlistItem>('Wishlist', WishlistItemSchema);
