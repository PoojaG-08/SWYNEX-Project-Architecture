import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from './models/User.ts';
import { GroupModel } from './models/Group.ts';
import { WishlistModel } from './models/Wishlist.ts';

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: string;
}

export interface GroupRecord {
  _id: string;
  name: string;
  budget: number;
  currency: string;
  revealDate: string;
  rules: string;
  inviteCode: string;
  creatorId: string;
  members: string[]; // user IDs
  isDrawn: boolean;
  drawnAt?: string | null;
  assignments: Array<{ giverId: string; recipientId: string }>;
  testRevealEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistRecord {
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

interface DBData {
  users: UserRecord[];
  groups: GroupRecord[];
  wishlists: WishlistRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

let isMongoConnected = false;

// Attempt MongoDB connection if MONGODB_URI is provided
export async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas / Server');
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to MongoDB URI. Falling back to persistent file store.', err);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Running in high-reliability file-backed mode.');
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Seed demo data if DB file doesn't exist
  if (!fs.existsSync(DB_FILE)) {
    await seedDemoData();
  }
}

function loadDB(): DBData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [], groups: [], wishlists: [] };
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [], groups: [], wishlists: [] };
  }
}

function saveDB(data: DBData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Pre-seed demo users, wishlists and a ready-to-test Secret Santa group
async function seedDemoData() {
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  const sarahId = 'user_sarah_101';
  const alexId = 'user_alex_102';
  const mayaId = 'user_maya_103';
  const liamId = 'user_liam_104';

  const users: UserRecord[] = [
    {
      _id: sarahId,
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: defaultPassword,
      avatar: 'SJ',
      createdAt: new Date().toISOString(),
    },
    {
      _id: alexId,
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: defaultPassword,
      avatar: 'AR',
      createdAt: new Date().toISOString(),
    },
    {
      _id: mayaId,
      name: 'Maya Patel',
      email: 'maya@example.com',
      password: defaultPassword,
      avatar: 'MP',
      createdAt: new Date().toISOString(),
    },
    {
      _id: liamId,
      name: 'Liam Chen',
      email: 'liam@example.com',
      password: defaultPassword,
      avatar: 'LC',
      createdAt: new Date().toISOString(),
    },
  ];

  // 1 week from now for reveal date
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const demoGroup: GroupRecord = {
    _id: 'group_festive_2026',
    name: 'Winter Holiday Circle 2026',
    budget: 30,
    currency: '$',
    revealDate: futureDate.toISOString(),
    rules: 'Cozy gifts only! Books, mugs, festive snacks, or thoughtful handmade surprises welcome.',
    inviteCode: 'FROST-2026',
    creatorId: sarahId,
    members: [sarahId, alexId, mayaId, liamId],
    isDrawn: true,
    drawnAt: new Date().toISOString(),
    assignments: [
      { giverId: sarahId, recipientId: alexId },
      { giverId: alexId, recipientId: mayaId },
      { giverId: mayaId, recipientId: liamId },
      { giverId: liamId, recipientId: sarahId },
    ],
    testRevealEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const wishlists: WishlistRecord[] = [
    {
      _id: 'wish_1',
      userId: alexId,
      groupId: demoGroup._id,
      title: 'Espresso Blend Whole Coffee Beans',
      estimatedPrice: 18,
      currency: '$',
      link: 'https://example.com/coffee-beans',
      notes: 'Medium roast preferred, notes of chocolate & caramel!',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'wish_2',
      userId: alexId,
      groupId: demoGroup._id,
      title: 'Wool Cabin Socks (Size M)',
      estimatedPrice: 14,
      currency: '$',
      link: '',
      notes: 'Forest green or navy blue.',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'wish_3',
      userId: mayaId,
      groupId: demoGroup._id,
      title: 'Ceramic Pour-Over Dripper',
      estimatedPrice: 24,
      currency: '$',
      link: '',
      notes: 'White or matte aqua finish to match kitchen decor.',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'wish_4',
      userId: sarahId,
      groupId: demoGroup._id,
      title: 'Bestselling Sci-Fi Novel Paperback',
      estimatedPrice: 16,
      currency: '$',
      link: '',
      notes: 'Anything by Ted Chiang or Ursula K. Le Guin!',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'wish_5',
      userId: liamId,
      groupId: demoGroup._id,
      title: 'Matcha Whisk & Bamboo Spoon Set',
      estimatedPrice: 15,
      currency: '$',
      link: '',
      notes: 'Learning traditional Japanese tea brewing.',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  saveDB({ users, groups: [demoGroup], wishlists });
  console.log('✨ Seeded initial demo users, groups, and wishlists.');
}

// User Storage Operations
export const userStore = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      const doc = await UserModel.findOne({ email: cleanEmail });
      return doc ? (doc.toObject() as UserRecord) : null;
    }
    const db = loadDB();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    if (isMongoConnected) {
      const doc = await UserModel.findById(id);
      return doc ? (doc.toObject() as UserRecord) : null;
    }
    const db = loadDB();
    return db.users.find((u) => u._id === id) || null;
  },

  async findByIds(ids: string[]): Promise<UserRecord[]> {
    if (isMongoConnected) {
      const docs = await UserModel.find({ _id: { $in: ids } });
      return docs.map((d) => d.toObject() as UserRecord);
    }
    const db = loadDB();
    return db.users.filter((u) => ids.includes(u._id));
  },

  async create(user: Omit<UserRecord, '_id' | 'createdAt'>): Promise<UserRecord> {
    if (isMongoConnected) {
      const doc = await UserModel.create(user);
      return doc.toObject() as UserRecord;
    }
    const db = loadDB();
    const newRecord: UserRecord = {
      ...user,
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    db.users.push(newRecord);
    saveDB(db);
    return newRecord;
  },

  async getAllUsers(): Promise<UserRecord[]> {
    if (isMongoConnected) {
      const docs = await UserModel.find();
      return docs.map((d) => d.toObject() as UserRecord);
    }
    const db = loadDB();
    return db.users;
  },
};

// Group Storage Operations
export const groupStore = {
  async findById(id: string): Promise<GroupRecord | null> {
    if (isMongoConnected) {
      const doc = await GroupModel.findById(id);
      return doc ? (doc.toObject() as GroupRecord) : null;
    }
    const db = loadDB();
    return db.groups.find((g) => g._id === id) || null;
  },

  async findByInviteCode(code: string): Promise<GroupRecord | null> {
    const cleanCode = code.trim().toUpperCase();
    if (isMongoConnected) {
      const doc = await GroupModel.findOne({ inviteCode: cleanCode });
      return doc ? (doc.toObject() as GroupRecord) : null;
    }
    const db = loadDB();
    return db.groups.find((g) => g.inviteCode.toUpperCase() === cleanCode) || null;
  },

  async findByMember(userId: string): Promise<GroupRecord[]> {
    if (isMongoConnected) {
      const docs = await GroupModel.find({ members: userId }).sort({ createdAt: -1 });
      return docs.map((d) => d.toObject() as GroupRecord);
    }
    const db = loadDB();
    return db.groups
      .filter((g) => g.members.includes(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(group: Omit<GroupRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<GroupRecord> {
    if (isMongoConnected) {
      const doc = await GroupModel.create(group);
      return doc.toObject() as GroupRecord;
    }
    const db = loadDB();
    const newRecord: GroupRecord = {
      ...group,
      _id: 'group_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.groups.push(newRecord);
    saveDB(db);
    return newRecord;
  },

  async update(id: string, updates: Partial<GroupRecord>): Promise<GroupRecord | null> {
    if (isMongoConnected) {
      const doc = await GroupModel.findByIdAndUpdate(id, updates, { new: true });
      return doc ? (doc.toObject() as GroupRecord) : null;
    }
    const db = loadDB();
    const index = db.groups.findIndex((g) => g._id === id);
    if (index === -1) return null;

    db.groups[index] = {
      ...db.groups[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDB(db);
    return db.groups[index];
  },
};

// Wishlist Storage Operations
export const wishlistStore = {
  async findByUser(userId: string, groupId?: string): Promise<WishlistRecord[]> {
    if (isMongoConnected) {
      const filter: Record<string, any> = { userId };
      if (groupId) filter.groupId = groupId;
      const docs = await WishlistModel.find(filter).sort({ createdAt: -1 });
      return docs.map((d) => d.toObject() as WishlistRecord);
    }
    const db = loadDB();
    return db.wishlists
      .filter((w) => w.userId === userId && (!groupId || !w.groupId || w.groupId === groupId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findById(id: string): Promise<WishlistRecord | null> {
    if (isMongoConnected) {
      const doc = await WishlistModel.findById(id);
      return doc ? (doc.toObject() as WishlistRecord) : null;
    }
    const db = loadDB();
    return db.wishlists.find((w) => w._id === id) || null;
  },

  async create(item: Omit<WishlistRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<WishlistRecord> {
    if (isMongoConnected) {
      const doc = await WishlistModel.create(item);
      return doc.toObject() as WishlistRecord;
    }
    const db = loadDB();
    const newRecord: WishlistRecord = {
      ...item,
      _id: 'wish_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.wishlists.push(newRecord);
    saveDB(db);
    return newRecord;
  },

  async update(id: string, updates: Partial<WishlistRecord>): Promise<WishlistRecord | null> {
    if (isMongoConnected) {
      const doc = await WishlistModel.findByIdAndUpdate(id, updates, { new: true });
      return doc ? (doc.toObject() as WishlistRecord) : null;
    }
    const db = loadDB();
    const index = db.wishlists.findIndex((w) => w._id === id);
    if (index === -1) return null;

    db.wishlists[index] = {
      ...db.wishlists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDB(db);
    return db.wishlists[index];
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await WishlistModel.findByIdAndDelete(id);
      return !!res;
    }
    const db = loadDB();
    const initialLen = db.wishlists.length;
    db.wishlists = db.wishlists.filter((w) => w._id !== id);
    if (db.wishlists.length !== initialLen) {
      saveDB(db);
      return true;
    }
    return false;
  },
};
