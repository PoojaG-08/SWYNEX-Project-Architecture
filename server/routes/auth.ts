import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userStore } from '../store.ts';
import { authMiddleware, AuthRequest, JWT_SECRET } from '../middleware/auth.ts';

export const authRouter = Router();

// Register new user
authRouter.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await userStore.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create 2-letter avatar initials
    const initials = name
      .split(' ')
      .map((part: string) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'SG';

    const user = await userStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      avatar: initials,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// Login
authRouter.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await userStore.findByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// Quick Demo Login for instant testing by reviewers
authRouter.post('/demo', async (req, res): Promise<void> => {
  try {
    const { email } = req.body;
    const targetEmail = (email || 'sarah@example.com').toLowerCase();

    const user = await userStore.findByEmail(targetEmail);
    if (!user) {
      res.status(404).json({ message: `Demo user '${targetEmail}' not found.` });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: `Logged in as demo user ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    res.status(500).json({ message: 'Server error during demo login.' });
  }
});

// List demo users for quick switcher
authRouter.get('/demo-users', async (_req, res): Promise<void> => {
  try {
    const allUsers = await userStore.getAllUsers();
    const demoAccounts = allUsers.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      roleDescription:
        u.email === 'sarah@example.com'
          ? 'Group Organizer (Can Draw Names & Reveal)'
          : 'Group Participant (Secret Giver)',
    }));
    res.json(demoAccounts);
  } catch (err: any) {
    res.status(500).json({ message: 'Error retrieving demo users.' });
  }
});

// Current User Profile
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await userStore.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});
