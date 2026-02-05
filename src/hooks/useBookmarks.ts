import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { UserBookmark } from '../lib/types'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('skill_id')
        .eq('user_id', user.id)

      if (error) throw error
      setBookmarks(data?.map((b: { skill_id: number }) => b.skill_id) || [])
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const addBookmark = async (skillId: number) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({ user_id: user.id, skill_id: skillId })

      if (error) throw error
      setBookmarks(prev => [...prev, skillId])
      return true
    } catch (err) {
      console.error('Error adding bookmark:', err)
      return false
    }
  }

  const removeBookmark = async (skillId: number) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId)

      if (error) throw error
      setBookmarks(prev => prev.filter(id => id !== skillId))
      return true
    } catch (err) {
      console.error('Error removing bookmark:', err)
      return false
    }
  }

  const isBookmarked = (skillId: number) => bookmarks.includes(skillId)

  const toggleBookmark = async (skillId: number) => {
    if (isBookmarked(skillId)) {
      return removeBookmark(skillId)
    } else {
      return addBookmark(skillId)
    }
  }

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    refetch: fetchBookmarks
  }
}
