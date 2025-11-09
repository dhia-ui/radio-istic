/**
 * Default Avatar Presets
 * These avatars are served from public/avatars/defaults/
 * You can replace these with your own avatar images
 */

export interface PresetAvatar {
  id: string
  url: string
  category: 'cute' | 'cool' | 'tech' | 'abstract'
  name: string
}

// Using placeholder avatars from UI Avatars service
// Replace these with your own images in public/avatars/defaults/
export const DEFAULT_AVATARS: PresetAvatar[] = [
  // Cute Category
  {
    id: 'cute-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    category: 'cute',
    name: 'Avatar mignon 1',
  },
  {
    id: 'cute-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    category: 'cute',
    name: 'Avatar mignon 2',
  },
  {
    id: 'cute-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    category: 'cute',
    name: 'Avatar mignon 3',
  },
  {
    id: 'cute-4',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    category: 'cute',
    name: 'Avatar mignon 4',
  },
  {
    id: 'cute-5',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    category: 'cute',
    name: 'Avatar mignon 5',
  },

  // Cool Category
  {
    id: 'cool-1',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Max',
    category: 'cool',
    name: 'Avatar cool 1',
  },
  {
    id: 'cool-2',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Luna',
    category: 'cool',
    name: 'Avatar cool 2',
  },
  {
    id: 'cool-3',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Leo',
    category: 'cool',
    name: 'Avatar cool 3',
  },
  {
    id: 'cool-4',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Mia',
    category: 'cool',
    name: 'Avatar cool 4',
  },
  {
    id: 'cool-5',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Oliver',
    category: 'cool',
    name: 'Avatar cool 5',
  },

  // Tech Category
  {
    id: 'tech-1',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tech1',
    category: 'tech',
    name: 'Avatar tech 1',
  },
  {
    id: 'tech-2',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tech2',
    category: 'tech',
    name: 'Avatar tech 2',
  },
  {
    id: 'tech-3',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tech3',
    category: 'tech',
    name: 'Avatar tech 3',
  },
  {
    id: 'tech-4',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tech4',
    category: 'tech',
    name: 'Avatar tech 4',
  },
  {
    id: 'tech-5',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tech5',
    category: 'tech',
    name: 'Avatar tech 5',
  },

  // Abstract Category
  {
    id: 'abstract-1',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Shape1',
    category: 'abstract',
    name: 'Avatar abstrait 1',
  },
  {
    id: 'abstract-2',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Shape2',
    category: 'abstract',
    name: 'Avatar abstrait 2',
  },
  {
    id: 'abstract-3',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Shape3',
    category: 'abstract',
    name: 'Avatar abstrait 3',
  },
  {
    id: 'abstract-4',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Shape4',
    category: 'abstract',
    name: 'Avatar abstrait 4',
  },
  {
    id: 'abstract-5',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Shape5',
    category: 'abstract',
    name: 'Avatar abstrait 5',
  },

  // Additional cute avatars
  {
    id: 'cute-6',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    category: 'cute',
    name: 'Avatar mignon 6',
  },
  {
    id: 'cute-7',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    category: 'cute',
    name: 'Avatar mignon 7',
  },

  // Additional cool avatars
  {
    id: 'cool-6',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Nova',
    category: 'cool',
    name: 'Avatar cool 6',
  },
  {
    id: 'cool-7',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=Zara',
    category: 'cool',
    name: 'Avatar cool 7',
  },

  // Additional tech avatars
  {
    id: 'tech-6',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot6',
    category: 'tech',
    name: 'Avatar tech 6',
  },
  {
    id: 'tech-7',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot7',
    category: 'tech',
    name: 'Avatar tech 7',
  },
]

export const AVATAR_CATEGORIES = [
  { id: 'all', name: 'Tous', count: DEFAULT_AVATARS.length },
  { id: 'cute', name: 'Mignon', count: DEFAULT_AVATARS.filter(a => a.category === 'cute').length },
  { id: 'cool', name: 'Cool', count: DEFAULT_AVATARS.filter(a => a.category === 'cool').length },
  { id: 'tech', name: 'Tech', count: DEFAULT_AVATARS.filter(a => a.category === 'tech').length },
  { id: 'abstract', name: 'Abstrait', count: DEFAULT_AVATARS.filter(a => a.category === 'abstract').length },
]
