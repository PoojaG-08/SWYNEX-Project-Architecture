/**
 * Generates a valid Derangement (Secret Santa assignment cycle)
 * where no user is assigned to themselves.
 * 
 * Uses a randomized Hamiltonian cycle:
 * Shuffles the array [p0, p1, ..., pn-1], then assigns:
 * p0 -> p1, p1 -> p2, ..., pn-1 -> p0.
 */
export interface AssignmentPair {
  giverId: string;
  recipientId: string;
}

export function generateAssignments(memberIds: string[]): AssignmentPair[] {
  if (!memberIds || memberIds.length < 2) {
    throw new Error('At least 2 members are required to draw secret assignments.');
  }

  // Clone array
  const shuffled = [...memberIds];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Create Hamiltonian cycle: each person gives to the next, last gives to first
  const assignments: AssignmentPair[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    const giverId = shuffled[i];
    const recipientId = shuffled[(i + 1) % shuffled.length];
    assignments.push({ giverId, recipientId });
  }

  return assignments;
}
