'use client'

import { useState, useEffect, useCallback } from 'react'
import { Project } from '@/types'
import { loadProjects, upsertProject, deleteProject as removeFromStorage } from '@/lib/storage'
import {
  createProject as buildProject,
  cloneProject as cloneProjectFactory,
} from '@/lib/project-factory'

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

  const renameProject = useCallback((id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const now = new Date().toISOString()
        const updated: Project = p.plan.appName
          ? { ...p, plan: { ...p.plan, appName: name }, updatedAt: now }
          : { ...p, input: { ...p.input, description: name }, updatedAt: now }
        upsertProject(updated)
        return updated
      })
    )
  }, [])

  const cloneProject = useCallback((source: Project) => {
    const cloned = cloneProjectFactory(source)
    upsertProject(cloned)
    setProjects(loadProjects())
  }, [])

  const visibleProjects = projects.filter((p) => p.input.description || p.plan.appName)

  return { projects: visibleProjects, createProject, deleteProject, renameProject, cloneProject }
}
