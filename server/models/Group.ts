import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment {
  giverId: string;
  recipientId: string;
}

export interface IGroup extends Document {
  name: string;
  budget: number;
  currency: string;
  revealDate: Date;
  rules: string;
  inviteCode: string;
  creatorId: string;
  members: string[]; // User IDs
  isDrawn: boolean;
  drawnAt?: Date;
  assignments: IAssignment[];
  testRevealEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, default: 25 },
    currency: { type: String, default: '$' },
    revealDate: { type: Date, required: true },
    rules: { type: String, default: '' },
    inviteCode: { type: String, required: true, unique: true, uppercase: true },
    creatorId: { type: String, required: true },
    members: [{ type: String }],
    isDrawn: { type: Boolean, default: false },
    drawnAt: { type: Date },
    assignments: [
      {
        giverId: { type: String, required: true },
        recipientId: { type: String, required: true },
      },
    ],
    testRevealEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GroupModel = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
