export interface Member {
  // Whether the member is currently online (optional, derive from status when needed)
  isOnline?: boolean
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  field: string
  year: number
  motivation: string
  projects: string
  skills: string
  status: "online" | "offline"
  avatar: string
  points: number
  role?: string
  isBureau?: boolean
}
