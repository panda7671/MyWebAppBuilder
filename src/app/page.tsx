'use client'

import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import ProjectList from '@/components/project/ProjectList'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import AppExamples from '@/components/home/AppExamples'
import Outputs from '@/components/home/Outputs'
import Limitations from '@/components/home/Limitations'

export default function HomePage() {
  const router = useRouter()
  const { projects, createProject, deleteProject, renameProject, cloneProject } = useProjects()

  function handleNewProject() {
    const project = createProject('')
    router.push(`/projects/${project.id}/input`)
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 gap-20">
      <Hero onStart={handleNewProject} />
      <HowItWorks />
      <AppExamples />
      <Outputs />
      <Limitations />

      <section className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          내 프로젝트
        </h2>
        <ProjectList
          projects={projects}
          onDelete={deleteProject}
          onRename={renameProject}
          onClone={cloneProject}
        />
      </section>
    </main>
  )
}
