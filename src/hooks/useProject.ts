'use client'

import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types'
import { loadProject, upsertProject } from '@/lib/storage'
import { touchProject } from '@/lib/project-factory'

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProject(loadProject(id))
    setLoading(false)
  }, [id])

  const updateProject = useCallback((updater: (p: Project) => Project) => {
    setProject((prev) => {
      if (!prev) return prev
      const updated = touchProject(updater(prev))
      upsertProject(updated)
      return updated
    })
  }, [])

  return { project, loading, updateProject }
}
