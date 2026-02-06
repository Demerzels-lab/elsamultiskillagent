import { useState, useEffect } from 'react'
import type { Skill, Category, SkillsData } from '../lib/types'

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/data/skills.json')
        if (!response.ok) throw new Error('Failed to fetch skills')
        const data: SkillsData = await response.json()
        setSkills(data.skills)
        setCategories(data.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  // Helper function to find a skill
  const getSkillBySlug = (slug?: string) => {
    if (!slug) return undefined
    return skills.find(s => s.slug === slug)
  }

  return { skills, categories, loading, error, getSkillBySlug }
}

export function useFilteredSkills(
  skills: Skill[],
  searchQuery: string,
  selectedCategories: string[]
) {
  const [filtered, setFiltered] = useState<Skill[]>(skills)

  useEffect(() => {
    let result = skills

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        skill =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.author.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query)
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(skill =>
        selectedCategories.includes(skill.category)
      )
    }

    setFiltered(result)
  }, [skills, searchQuery, selectedCategories])

  return filtered
}