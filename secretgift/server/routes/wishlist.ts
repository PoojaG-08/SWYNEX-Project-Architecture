import { Router, Response } from 'express';
import { wishlistStore, groupStore } from '../store.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';

export const wishlistRouter = Router();

wishlistRouter.use(authMiddleware);

// Get my wishlist items
wishlistRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { groupId } = req.query;

    const items = await wishlistStore.findByUser(userId, groupId as string | undefined);
    res.json(items);
  } catch (err: any) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Failed to retrieve wishlist items.' });
  }
});

// Add new wishlist item
wishlistRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, estimatedPrice, currency, link, notes, priority, groupId } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Wishlist item title is required.' });
      return;
    }

    const item = await wishlistStore.create({
      userId,
      groupId: (groupId || '').trim(),
      title: title.trim(),
      estimatedPrice: Number(estimatedPrice) >= 0 ? Number(estimatedPrice) : 0,
      currency: currency || '$',
      link: (link || '').trim(),
      notes: (notes || '').trim(),
      priority: ['high', 'medium', 'low'].includes(priority) ? priority : 'medium',
    });

    res.status(201).json({
      message: 'Wishlist item added successfully!',
      item,
    });
  } catch (err: any) {
    console.error('Error creating wishlist item:', err);
    res.status(500).json({ message: 'Failed to add wishlist item.' });
  }
});

// Update wishlist item
wishlistRouter.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const itemId = req.params.id;
    const { title, estimatedPrice, currency, link, notes, priority, groupId } = req.body;

    const existing = await wishlistStore.findById(itemId);
    if (!existing) {
      res.status(404).json({ message: 'Wishlist item not found.' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: 'You can only edit your own wishlist items.' });
      return;
    }

    const updated = await wishlistStore.update(itemId, {
      title: title !== undefined ? title.trim() : existing.title,
      estimatedPrice:
        estimatedPrice !== undefined && Number(estimatedPrice) >= 0
          ? Number(estimatedPrice)
          : existing.estimatedPrice,
      currency: currency || existing.currency,
      link: link !== undefined ? link.trim() : existing.link,
      notes: notes !== undefined ? notes.trim() : existing.notes,
      priority: ['high', 'medium', 'low'].includes(priority) ? priority : existing.priority,
      groupId: groupId !== undefined ? groupId : existing.groupId,
    });

    res.json({
      message: 'Wishlist item updated successfully!',
      item: updated,
    });
  } catch (err: any) {
    console.error('Error updating wishlist item:', err);
    res.status(500).json({ message: 'Failed to update wishlist item.' });
  }
});

// Delete wishlist item
wishlistRouter.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const itemId = req.params.id;

    const existing = await wishlistStore.findById(itemId);
    if (!existing) {
      res.status(404).json({ message: 'Wishlist item not found.' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: 'You can only delete your own wishlist items.' });
      return;
    }

    await wishlistStore.delete(itemId);

    res.json({ message: 'Wishlist item removed.' });
  } catch (err: any) {
    console.error('Error deleting wishlist item:', err);
    res.status(500).json({ message: 'Failed to delete wishlist item.' });
  }
});

// Get another user's wishlist if in the same group
wishlistRouter.get('/user/:targetUserId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { targetUserId } = req.params;
    const { groupId } = req.query;

    if (!groupId) {
      res.status(400).json({ message: 'groupId query parameter is required to view a member wishlist.' });
      return;
    }

    const group = await groupStore.findById(groupId as string);
    if (!group) {
      res.status(404).json({ message: 'Group not found.' });
      return;
    }

    if (!group.members.includes(currentUserId) || !group.members.includes(targetUserId)) {
      res.status(403).json({ message: 'You must share a gift group with this user to view their wishlist.' });
      return;
    }

    const items = await wishlistStore.findByUser(targetUserId, groupId as string);
    res.json(items);
  } catch (err: any) {
    console.error('Error fetching member wishlist:', err);
    res.status(500).json({ message: 'Failed to retrieve wishlist.' });
  }
});
