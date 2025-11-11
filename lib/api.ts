/**
 * API Utility Functions for Radio Istic Dashboard
 * 
 * Handles all HTTP requests to the backend REST API with:
 * - JWT token management
 * - Error handling
 * - Type safety
 */

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get stored JWT token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('radio-istic-token');
}

/**
 * Save JWT token to localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('radio-istic-token', token);
}

/**
 * Remove JWT token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('radio-istic-token');
}

/**
 * Generic fetch wrapper with authentication and error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add existing headers from options
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers[key] = value as string;
    });
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// ==================== Authentication API ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  field: 'GLSI' | 'IRS' | 'LISI' | 'LAI' | 'IOT' | 'LT';
  year: 1 | 2 | 3;
  motivation?: string;
  projects?: string;
  skills?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}

export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<{ success: boolean; user: any }> => {
    return fetchAPI('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<RegisterRequest>): Promise<{ success: boolean; user: any }> => {
    return fetchAPI('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    return fetchAPI('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ==================== Members API ====================

export interface MemberFilters {
  field?: string;
  year?: number;
  status?: 'online' | 'offline';
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const membersAPI = {
  /**
   * Get all members with optional filters
   */
  getAll: async (filters?: MemberFilters): Promise<any> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/members${query}`, { method: 'GET' });
  },

  /**
   * Get member by ID
   */
  getById: async (id: string): Promise<any> => {
    return fetchAPI(`/members/${id}`, { method: 'GET' });
  },

  /**
   * Get leaderboard
   */
  getLeaderboard: async (limit: number = 10): Promise<any> => {
    return fetchAPI(`/members/leaderboard?limit=${limit}`, { method: 'GET' });
  },

  /**
   * Get bureau members
   */
  getBureau: async (): Promise<any> => {
    return fetchAPI('/members/bureau', { method: 'GET' });
  },

  /**
   * Get member statistics
   */
  getStats: async (): Promise<any> => {
    return fetchAPI('/members/stats', { method: 'GET' });
  },

  /**
   * Update member points (admin only)
   */
  updatePoints: async (
    id: string,
    points: number,
    action: 'set' | 'add' | 'subtract' = 'set'
  ): Promise<any> => {
    return fetchAPI(`/members/${id}/points`, {
      method: 'PUT',
      body: JSON.stringify({ points, action }),
    });
  },

  /**
   * Update member role (admin only)
   */
  updateRole: async (id: string, role: string, isBureau: boolean): Promise<any> => {
    return fetchAPI(`/members/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role, isBureau }),
    });
  },
};

// ==================== Chat API ====================

export const chatAPI = {
  /**
   * Get all conversations for current user
   */
  getConversations: async (): Promise<any> => {
    return fetchAPI('/chat/conversations', { method: 'GET' });
  },

  /**
   * Get conversation with messages
   */
  getConversation: async (id: string): Promise<any> => {
    return fetchAPI(`/chat/conversations/${id}`, { method: 'GET' });
  },

  /**
   * Create or get existing conversation
   */
  createConversation: async (
    participantIds: string[],
    isGroup: boolean = false,
    groupName?: string
  ): Promise<any> => {
    return fetchAPI('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantIds, isGroup, groupName }),
    });
  },

  /**
   * Send message
   */
  sendMessage: async (conversationId: string, content: string, type: string = 'text'): Promise<any> => {
    return fetchAPI('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, type }),
    });
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId: string): Promise<any> => {
    return fetchAPI(`/chat/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Get total unread count
   */
  getUnreadCount: async (): Promise<any> => {
    return fetchAPI('/chat/unread-count', { method: 'GET' });
  },
};

// ==================== Events API ====================

export interface EventFilters {
  category?: string;
  status?: string;
  upcoming?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  category: 'Sport' | 'Podcast' | 'Social Events' | 'Voyage' | 'Social' | 'Training' | 'Other';
  startDate: string;
  endDate?: string;
  location: string;
  maxParticipants?: number;
  pointsReward?: number;
  image?: string;
  type?: 'public' | 'members-only' | 'bureau-only';
}

export const eventsAPI = {
  /**
   * Get all events with filters
   */
  getAll: async (filters?: EventFilters): Promise<any> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/events${query}`, { method: 'GET' });
  },

  /**
   * Get event by ID
   */
  getById: async (id: string): Promise<any> => {
    return fetchAPI(`/events/${id}`, { method: 'GET' });
  },

  /**
   * Create event (organizer/admin only)
   */
  create: async (eventData: CreateEventRequest): Promise<any> => {
    return fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Update event
   */
  update: async (id: string, eventData: Partial<CreateEventRequest>): Promise<any> => {
    return fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Register for event
   */
  register: async (id: string): Promise<any> => {
    return fetchAPI(`/events/${id}/register`, {
      method: 'POST',
    });
  },

  /**
   * Unregister from event
   */
  unregister: async (id: string): Promise<any> => {
    return fetchAPI(`/events/${id}/unregister`, {
      method: 'POST',
    });
  },

  /**
   * Get event statistics
   */
  getStats: async (): Promise<any> => {
    return fetchAPI('/events/stats/overview', { method: 'GET' });
  },

  /**
   * Delete event
   */
  delete: async (id: string): Promise<any> => {
    return fetchAPI(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== Export all APIs ====================

export const api = {
  auth: authAPI,
  members: membersAPI,
  chat: chatAPI,
  events: eventsAPI,
};

export default api;
