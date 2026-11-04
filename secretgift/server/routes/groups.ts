import { Router, Response } from 'express';
import { groupStore, userStore, wishlistStore } from '../store.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import { generateAssignments } from '../utils/derangement.ts';

export const groupsRouter = Router();

// Protect all group routes
groupsRouter.use(authMiddleware);

// Helper to generate readable invite codes
function generateInviteCode(): string {
  const words = ['GIFT', 'SNOW', 'STAR', 'BELL', 'COZY', 'CHEER', 'WISH', 'SPARK'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}

// 1. Get all groups for current user
groupsRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groups = await groupStore.findByMember(userId);

    const summaries = await Promise.all(
      groups.map(async (g) => {
        const isRevealed =
          Boolean(g.testRevealEnabled) || new Date() >= new Date(g.revealDate);
        const myAssignment = g.assignments.find((a) => a.giverId === userId);

        return {
          id: g._id,
          name: g.name,
          budget: g.budget,
          currency: g.currency,
          revealDate: g.revealDate,
          rules: g.rules,
          inviteCode: g.inviteCode,
          memberCount: g.members.length,
          isCreator: g.creatorId === userId,
          isDrawn: g.isDrawn,
          isRevealed,
          hasMyAssignment: Boolean(myAssignment),
          createdAt: g.createdAt,
        };
      })
    );

    res.json(summaries);
  } catch (err: any) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ message: 'Failed to retrieve groups.' });
  }
});

// 2. Create new gift exchange group
groupsRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, budget, currency, revealDate, rules } = req.body;

    if (!name || !revealDate) {
      res.status(400).json({ message: 'Group name and reveal date are required.' });
      return;
    }

    const targetDate = new Date(revealDate);
    if (isNaN(targetDate.getTime())) {
      res.status(400).json({ message: 'Invalid reveal date format.' });
      return;
    }

    // Ensure unique invite code
    let inviteCode = generateInviteCode();
    let existing = await groupStore.findByInviteCode(inviteCode);
    while (existing) {
      inviteCode = generateInviteCode();
      existing = await groupStore.findByInviteCode(inviteCode);
    }

    const group = await groupStore.create({
      name: name.trim(),
      budget: Number(budget) > 0 ? Number(budget) : 25,
      currency: currency || '$',
      revealDate: targetDate.toISOString(),
      rules: (rules || '').trim(),
      inviteCode,
      creatorId: userId,
      members: [userId],
      isDrawn: false,
      assignments: [],
      testRevealEnabled: false,
    });

    res.status(201).json({
      message: 'Gift group created successfully!',
      group: {
        id: group._id,
        name: group.name,
        budget: group.budget,
        currency: group.currency,
        revealDate: group.revealDate,
        inviteCode: group.inviteCode,
        isCreator: true,
      },
    });
  } catch (err: any) {
    console.error('Error creating group:', err);
    res.status(500).json({ message: 'Failed to create group.' });
  }
});

// 3. Join a group by invite code
groupsRouter.post('/join', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { inviteCode } = req.body;

    if (!inviteCode) {
      res.status(400).json({ message: 'Invite code is required.' });
      return;
    }

    const group = await groupStore.findByInviteCode(inviteCode);
    if (!group) {
      res.status(404).json({ message: 'Invalid invite code. No matching group found.' });
      return;
    }

    if (group.members.includes(userId)) {
      res.status(400).json({
        message: 'You are already a member of this gift group!',
        groupId: group._id,
      });
      return;
    }

    if (group.isDrawn) {
      res.status(400).json({
        message: 'Secret assignments have already been drawn for this group. New members cannot join after drawing.',
      });
      return;
    }

    const updatedMembers = [...group.members, userId];
    await groupStore.update(group._id, { members: updatedMembers });

    res.json({
      message: `Successfully joined "${group.name}"!`,
      groupId: group._id,
    });
  } catch (err: any) {
    console.error('Error joining group:', err);
    res.status(500).json({ message: 'Failed to join group.' });
  }
});

// 4. Get single group details
groupsRouter.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.id;

    const group = await groupStore.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (!group.members.includes(userId)) {
      res.status(403).json({ message: 'You are not a member of this group.' });
      return;
    }

    // Fetch member details
    const memberUsers = await userStore.findByIds(group.members);
    const membersWithWishlistCount = await Promise.all(
      memberUsers.map(async (u) => {
        const wishes = await wishlistStore.findByUser(u._id, group._id);
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          avatar: u.avatar || u.name.slice(0, 2).toUpperCase(),
          wishlistCount: wishes.length,
          isOrganizer: u._id === group.creatorId,
        };
      })
    );

    const isCreator = group.creatorId === userId;
    const isRevealed =
      Boolean(group.testRevealEnabled) || new Date() >= new Date(group.revealDate);

    // If revealed, construct the full assignment list for everyone
    let finalRevealedAssignments = null;
    if (isRevealed && group.isDrawn && group.assignments.length > 0) {
      const usersMap = new Map(memberUsers.map((u) => [u._id, u.name]));
      finalRevealedAssignments = group.assignments.map((a) => ({
        giverId: a.giverId,
        giverName: usersMap.get(a.giverId) || 'Unknown Giver',
        recipientId: a.recipientId,
        recipientName: usersMap.get(a.recipientId) || 'Unknown Recipient',
      }));
    }

    res.json({
      id: group._id,
      name: group.name,
      budget: group.budget,
      currency: group.currency,
      revealDate: group.revealDate,
      rules: group.rules,
      inviteCode: group.inviteCode,
      creatorId: group.creatorId,
      isCreator,
      isDrawn: group.isDrawn,
      drawnAt: group.drawnAt,
      isRevealed,
      testRevealEnabled: Boolean(group.testRevealEnabled),
      members: membersWithWishlistCount,
      allAssignments: finalRevealedAssignments, // ONLY present when revealed
    });
  } catch (err: any) {
    console.error('Error fetching group detail:', err);
    res.status(500).json({ message: 'Failed to retrieve group details.' });
  }
});

// 5. Get current user's secret assignment ONLY (Strict Privacy)
groupsRouter.get('/:id/my-assignment', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.id;

    const group = await groupStore.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (!group.members.includes(userId)) {
      res.status(403).json({ message: 'You are not a member of this group.' });
      return;
    }

    if (!group.isDrawn) {
      res.json({
        hasAssignment: false,
        message: 'The organizer has not yet drawn names for this group.',
      });
      return;
    }

    const pair = group.assignments.find((a) => a.giverId === userId);
    if (!pair) {
      res.json({
        hasAssignment: false,
        message: 'You have not been assigned a recipient yet.',
      });
      return;
    }

    // Retrieve recipient's profile & wishlist
    const recipientUser = await userStore.findById(pair.recipientId);
    if (!recipientUser) {
      res.status(500).json({ message: 'Recipient account could not be found.' });
      return;
    }

    const recipientWishlist = await wishlistStore.findByUser(recipientUser._id, group._id);

    res.json({
      hasAssignment: true,
      recipient: {
        id: recipientUser._id,
        name: recipientUser.name,
        email: recipientUser.email,
        avatar: recipientUser.avatar || recipientUser.name.slice(0, 2).toUpperCase(),
        wishlist: recipientWishlist,
      },
      budget: group.budget,
      currency: group.currency,
      revealDate: group.revealDate,
    });
  } catch (err: any) {
    console.error('Error fetching secret assignment:', err);
    res.status(500).json({ message: 'Failed to retrieve secret assignment.' });
  }
});

// 6. Draw Secret Assignments (Organizer Only)
groupsRouter.post('/:id/draw', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.id;

    const group = await groupStore.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (group.creatorId !== userId) {
      res.status(403).json({ message: 'Only the group organizer can draw secret assignments.' });
      return;
    }

    if (group.members.length < 2) {
      res.status(400).json({
        message: 'At least 2 members are required to draw gifts (ideally 3 or more). Invite friends first!',
      });
      return;
    }

    // Generate Derangement cycle: no self-assignment guaranteed
    const assignments = generateAssignments(group.members);

    const updated = await groupStore.update(group._id, {
      isDrawn: true,
      drawnAt: new Date().toISOString(),
      assignments,
    });

    res.json({
      message: 'Secret recipients randomly assigned! Each member can now view their secret match.',
      isDrawn: true,
      drawnAt: updated?.drawnAt,
    });
  } catch (err: any) {
    console.error('Error drawing assignments:', err);
    res.status(500).json({ message: 'Failed to generate assignments.', error: err.message });
  }
});

// 7. Reset Assignments (Organizer Only)
groupsRouter.post('/:id/reset-draw', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.id;

    const group = await groupStore.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (group.creatorId !== userId) {
      res.status(403).json({ message: 'Only the group organizer can reset assignments.' });
      return;
    }

    await groupStore.update(group._id, {
      isDrawn: false,
      drawnAt: null,
      assignments: [],
      testRevealEnabled: false,
    });

    res.json({
      message: 'Assignments reset. You can draw again once new members have joined.',
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to reset assignments.' });
  }
});

// 8. Toggle Test Reveal (Evaluator / Demo helper)
groupsRouter.post('/:id/toggle-test-reveal', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const groupId = req.params.id;

    const group = await groupStore.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (group.creatorId !== userId) {
      res.status(403).json({ message: 'Only the organizer can toggle test reveal mode.' });
      return;
    }

    const currentStatus = Boolean(group.testRevealEnabled);
    const updated = await groupStore.update(group._id, {
      testRevealEnabled: !currentStatus,
    });

    res.json({
      message: updated?.testRevealEnabled
        ? 'Test Reveal activated! All members can now view the final reveal chart.'
        : 'Test Reveal deactivated. Assignments are secret again.',
      testRevealEnabled: updated?.testRevealEnabled,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to toggle test reveal.' });
  }
});
