export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface WishlistItem {
  _id: string;
  userId: string;
  groupId?: string;
  title: string;
  estimatedPrice: number;
  currency: string;
  link?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  wishlistCount: number;
  isOrganizer: boolean;
}

export interface RevealedAssignment {
  giverId: string;
  giverName: string;
  recipientId: string;
  recipientName: string;
}

export interface GroupSummary {
  id: string;
  name: string;
  budget: number;
  currency: string;
  revealDate: string;
  rules: string;
  inviteCode: string;
  memberCount: number;
  isCreator: boolean;
  isDrawn: boolean;
  isRevealed: boolean;
  hasMyAssignment: boolean;
  createdAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  budget: number;
  currency: string;
  revealDate: string;
  rules: string;
  inviteCode: string;
  creatorId: string;
  isCreator: boolean;
  isDrawn: boolean;
  drawnAt?: string;
  isRevealed: boolean;
  testRevealEnabled?: boolean;
  members: GroupMember[];
  allAssignments?: RevealedAssignment[] | null;
}

export interface SecretRecipient {
  id: string;
  name: string;
  email: string;
  avatar: string;
  wishlist: WishlistItem[];
}

export interface MyAssignmentResponse {
  hasAssignment: boolean;
  message?: string;
  recipient?: SecretRecipient;
  budget?: number;
  currency?: string;
  revealDate?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleDescription: string;
}
