'use client'

import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types'
import { loadProjects, upsertProject, deleteProject as removeFromStorage } from '@/lib/storage'
import { createProject as buildProject } from '@/lib/project-factory'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(loadProjects())
  }, [])

  const createProject = useCallback((description: string): Project => {
    const project = buildProject(description)
    upsertProject(project)
    setProjects(loadProjects())
    return project
  }, [])

  const deleteProject = useCallback((id: string) => {
    removeFromStorage(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const visibleProjects = projects.filter((p) => p.input.description || p.plan.appName)

  return { projects: visibleProjects, createProject, deleteProject }
}
