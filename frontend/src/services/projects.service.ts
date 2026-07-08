import api from '@/lib/api'
import type { Project, ProjectFilters, PaginatedResponse } from '@/types'

export const projectsService = {
  async getAll(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const { data } = await api.get('/projects', { params: filters })
    return data
  },

  async getBySlug(slug: string): Promise<Project> {
    const { data } = await api.get(`/projects/${slug}`)
    return data
  },

  async getById(id: number): Promise<Project> {
    const { data } = await api.get(`/projects/id/${id}`)
    return data
  },

  async create(payload: Partial<Project>): Promise<Project> {
    const { data } = await api.post('/projects', payload)
    return data
  },

  async update(id: number, payload: Partial<Project>): Promise<Project> {
    const { data } = await api.put(`/projects/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`)
  },

  async getFeatured(): Promise<Project[]> {
    const { data } = await api.get('/projects', { params: { featured: true, published: true, limit: 6 } })
    return data.data ?? data
  },
}
