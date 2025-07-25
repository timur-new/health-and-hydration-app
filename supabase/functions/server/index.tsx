import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

// Helper function to verify user authentication
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No access token provided', user: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return { error: 'Invalid access token', user: null };
  }
  
  return { error: null, user };
}

// Auth routes
app.post('/make-server-8769872d/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup exception:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Nutrition routes
app.get('/make-server-8769872d/nutrition/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const entries = await kv.get(`nutrition:${userId}`) || []
    return c.json({ entries })
  } catch (error) {
    console.log('Get nutrition error:', error)
    return c.json({ error: 'Failed to fetch nutrition data' }, 500)
  }
})

app.post('/make-server-8769872d/nutrition/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const entry = await c.req.json()
    
    const entries = await kv.get(`nutrition:${userId}`) || []
    const newEntry = { ...entry, id: Date.now().toString(), timestamp: new Date().toISOString() }
    entries.push(newEntry)
    
    await kv.set(`nutrition:${userId}`, entries)
    return c.json({ entry: newEntry })
  } catch (error) {
    console.log('Add nutrition error:', error)
    return c.json({ error: 'Failed to add nutrition entry' }, 500)
  }
})

app.delete('/make-server-8769872d/nutrition/:userId/:entryId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const entryId = c.req.param('entryId')
    
    const entries = await kv.get(`nutrition:${userId}`) || []
    const filteredEntries = entries.filter((entry: any) => entry.id !== entryId)
    
    await kv.set(`nutrition:${userId}`, filteredEntries)
    return c.json({ success: true })
  } catch (error) {
    console.log('Delete nutrition error:', error)
    return c.json({ error: 'Failed to delete nutrition entry' }, 500)
  }
})

// Supplements routes
app.get('/make-server-8769872d/supplements/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const supplements = await kv.get(`supplements:${userId}`) || []
    return c.json({ supplements })
  } catch (error) {
    console.log('Get supplements error:', error)
    return c.json({ error: 'Failed to fetch supplements data' }, 500)
  }
})

app.post('/make-server-8769872d/supplements/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const supplement = await c.req.json()
    
    const supplements = await kv.get(`supplements:${userId}`) || []
    const newSupplement = { 
      ...supplement, 
      id: Date.now().toString(), 
      taken: false,
      timestamp: new Date().toISOString()
    }
    supplements.push(newSupplement)
    
    await kv.set(`supplements:${userId}`, supplements)
    return c.json({ supplement: newSupplement })
  } catch (error) {
    console.log('Add supplement error:', error)
    return c.json({ error: 'Failed to add supplement' }, 500)
  }
})

app.put('/make-server-8769872d/supplements/:userId/:supplementId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const supplementId = c.req.param('supplementId')
    const updates = await c.req.json()
    
    const supplements = await kv.get(`supplements:${userId}`) || []
    const updatedSupplements = supplements.map((supplement: any) => 
      supplement.id === supplementId 
        ? { ...supplement, ...updates, lastTaken: updates.taken ? new Date().toISOString() : supplement.lastTaken }
        : supplement
    )
    
    await kv.set(`supplements:${userId}`, updatedSupplements)
    return c.json({ success: true })
  } catch (error) {
    console.log('Update supplement error:', error)
    return c.json({ error: 'Failed to update supplement' }, 500)
  }
})

app.delete('/make-server-8769872d/supplements/:userId/:supplementId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const supplementId = c.req.param('supplementId')
    
    const supplements = await kv.get(`supplements:${userId}`) || []
    const filteredSupplements = supplements.filter((supplement: any) => supplement.id !== supplementId)
    
    await kv.set(`supplements:${userId}`, filteredSupplements)
    return c.json({ success: true })
  } catch (error) {
    console.log('Delete supplement error:', error)
    return c.json({ error: 'Failed to delete supplement' }, 500)
  }
})

// Hydration routes
app.get('/make-server-8769872d/hydration/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const data = await kv.get(`hydration:${userId}`) || { entries: [], goal: 2.5 }
    return c.json(data)
  } catch (error) {
    console.log('Get hydration error:', error)
    return c.json({ error: 'Failed to fetch hydration data' }, 500)
  }
})

app.post('/make-server-8769872d/hydration/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const entry = await c.req.json()
    
    const data = await kv.get(`hydration:${userId}`) || { entries: [], goal: 2.5 }
    const newEntry = { ...entry, id: Date.now().toString(), time: new Date().toISOString() }
    data.entries.push(newEntry)
    
    await kv.set(`hydration:${userId}`, data)
    return c.json({ entry: newEntry })
  } catch (error) {
    console.log('Add hydration error:', error)
    return c.json({ error: 'Failed to add hydration entry' }, 500)
  }
})

app.put('/make-server-8769872d/hydration/:userId/goal', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const { goal } = await c.req.json()
    
    const data = await kv.get(`hydration:${userId}`) || { entries: [], goal: 2.5 }
    data.goal = goal
    
    await kv.set(`hydration:${userId}`, data)
    return c.json({ success: true })
  } catch (error) {
    console.log('Update hydration goal error:', error)
    return c.json({ error: 'Failed to update hydration goal' }, 500)
  }
})

app.delete('/make-server-8769872d/hydration/:userId/:entryId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const entryId = c.req.param('entryId')
    
    const data = await kv.get(`hydration:${userId}`) || { entries: [], goal: 2.5 }
    data.entries = data.entries.filter((entry: any) => entry.id !== entryId)
    
    await kv.set(`hydration:${userId}`, data)
    return c.json({ success: true })
  } catch (error) {
    console.log('Delete hydration error:', error)
    return c.json({ error: 'Failed to delete hydration entry' }, 500)
  }
})

// User profile routes
app.get('/make-server-8769872d/profile/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const profile = await kv.get(`profile:${userId}`) || {
      nutritionGoals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65
      }
    }
    return c.json(profile)
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to fetch profile data' }, 500)
  }
})

app.put('/make-server-8769872d/profile/:userId', async (c) => {
  try {
    const { error: authError } = await verifyUser(c.req.raw);
    if (authError) {
      return c.json({ error: authError }, 401);
    }

    const userId = c.req.param('userId')
    const updates = await c.req.json()
    
    const profile = await kv.get(`profile:${userId}`) || {}
    const updatedProfile = { ...profile, ...updates }
    
    await kv.set(`profile:${userId}`, updatedProfile)
    return c.json({ success: true })
  } catch (error) {
    console.log('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

export default app

Deno.serve(app.fetch)