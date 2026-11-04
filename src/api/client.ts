import {
  User,
  GroupSummary,
  GroupDetail,
  MyAssignmentResponse,
  WishlistItem,
  DemoUser,
} from '../types/index.ts';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('secretgift_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data as T;
  }

  // Auth Endpoints
  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async demoLogin(email?: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getDemoUsers(): Promise<DemoUser[]> {
    return this.request('/auth/demo-users');
  }

  async getMe(): Promise<{ user: User }> {
    return this.request('/auth/me');
  }

  // Groups Endpoints
  async getGroups(): Promise<GroupSummary[]> {
    return this.request('/groups');
  }

  async getGroup(id: string): Promise<GroupDetail> {
    return this.request(`/groups/${id}`);
  }

  async createGroup(data: {
    name: string;
    budget: number;
    currency: string;
    revealDate: string;
    rules: string;
  }): Promise<{ message: string; group: any }> {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinGroup(inviteCode: string): Promise<{ message: string; groupId: string }> {
    return this.request('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  async getMyAssignment(groupId: string): Promise<MyAssignmentResponse> {
    return this.request(`/groups/${groupId}/my-assignment`);
  }

  async drawAssignments(groupId: string): Promise<{ message: string; isDrawn: boolean; drawnAt: string }> {
    return this.request(`/groups/${groupId}/draw`, {
      method: 'POST',
    });
  }

  async resetDraw(groupId: string): Promise<{ message: string }> {
    return this.request(`/groups/${groupId}/reset-draw`, {
      method: 'POST',
    });
  }

  async toggleTestReveal(groupId: string): Promise<{ message: string; testRevealEnabled: boolean }> {
    return this.request(`/groups/${groupId}/toggle-test-reveal`, {
      method: 'POST',
    });
  }

  // Wishlist Endpoints
  async getMyWishlist(groupId?: string): Promise<WishlistItem[]> {
    const query = groupId ? `?groupId=${encodeURIComponent(groupId)}` : '';
    return this.request(`/wishlist${query}`);
  }

  async addWishlistItem(item: {
    title: string;
    estimatedPrice: number;
    currency: string;
    link?: string;
    notes?: string;
    priority: 'high' | 'medium' | 'low';
    groupId?: string;
  }): Promise<{ message: string; item: WishlistItem }> {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateWishlistItem(
    id: string,
    item: Partial<WishlistItem>
  ): Promise<{ message: string; item: WishlistItem }> {
    return this.request(`/wishlist/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteWishlistItem(id: string): Promise<{ message: string }> {
    return this.request(`/wishlist/${id}`, {
      method: 'DELETE',
    });
  }

  async getMemberWishlist(targetUserId: string, groupId: string): Promise<WishlistItem[]> {
    return this.request(`/wishlist/user/${targetUserId}?groupId=${encodeURIComponent(groupId)}`);
  }
}

export const api = new ApiClient();
