export interface Skill {
  id: number
  name: string
  slug: string
  description: string
  category: string
  author: string
  github_url: string
  install_command: string
  featured: boolean
  popular: boolean
  tags?: string[] // Added optional tags property
}

export interface Category {
  name: string
  count: number
  slug: string
}

export interface SkillsData {
  skills: Skill[]
  categories: Category[]
  total_count: number
  last_updated: string
}

export interface UserBookmark {
  id: number
  user_id: string
  skill_id: number
  created_at: string
}

export interface User {
  id: string
  email?: string
}