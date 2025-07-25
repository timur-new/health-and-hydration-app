import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './supabase/info'

const supabaseUrl = `https://${projectId}.supabase.co`
const supabase = createClient(supabaseUrl, publicAnonKey)

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8769872d`

// Auth utilities
export const auth = {
  async signUp(email: string, password: string, name?: string) {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }
      
      return data
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data
    } catch (error) {
      console.error('Get session error:', error)
      throw error
    }
  }
}

// API utilities
export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    try {
      const session = await auth.getSession()
      const accessToken = session?.session?.access_token || publicAnonKey
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          ...options.headers
        }
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error)
      throw error
    }
  },

  // Nutrition API
  nutrition: {
    async get(userId: string) {
      return api.request(`/nutrition/${userId}`)
    },
    
    async add(userId: string, entry: any) {
      return api.request(`/nutrition/${userId}`, {
        method: 'POST',
        body: JSON.stringify(entry)
      })
    },
    
    async remove(userId: string, entryId: string) {
      return api.request(`/nutrition/${userId}/${entryId}`, {
        method: 'DELETE'
      })
    }
  },

  // Supplements API
  supplements: {
    async get(userId: string) {
      return api.request(`/supplements/${userId}`)
    },
    
    async add(userId: string, supplement: any) {
      return api.request(`/supplements/${userId}`, {
        method: 'POST',
        body: JSON.stringify(supplement)
      })
    },
    
    async update(userId: string, supplementId: string, updates: any) {
      return api.request(`/supplements/${userId}/${supplementId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    },
    
    async remove(userId: string, supplementId: string) {
      return api.request(`/supplements/${userId}/${supplementId}`, {
        method: 'DELETE'
      })
    }
  },

  // Hydration API
  hydration: {
    async get(userId: string) {
      return api.request(`/hydration/${userId}`)
    },
    
    async addEntry(userId: string, entry: any) {
      return api.request(`/hydration/${userId}`, {
        method: 'POST',
        body: JSON.stringify(entry)
      })
    },
    
    async updateGoal(userId: string, goal: number) {
      return api.request(`/hydration/${userId}/goal`, {
        method: 'PUT',
        body: JSON.stringify({ goal })
      })
    },
    
    async removeEntry(userId: string, entryId: string) {
      return api.request(`/hydration/${userId}/${entryId}`, {
        method: 'DELETE'
      })
    }
  },

  // Profile API
  profile: {
    async get(userId: string) {
      return api.request(`/profile/${userId}`)
    },
    
    async update(userId: string, updates: any) {
      return api.request(`/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    }
  }
}