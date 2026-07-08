import api from '@/lib/api'
import type {
  Category, Client, Quote, Invoice, Contract,
  Appointment, TeamMember, BlogPost, Testimonial,
  Message, DashboardStats, UploadedFile, PaginatedResponse
} from '@/types'

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get('/categories')
    return data
  },
  async create(payload: Partial<Category>): Promise<Category> {
    const { data } = await api.post('/categories', payload)
    return data
  },
  async update(id: number, payload: Partial<Category>): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export const clientsService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Client>> {
    const { data } = await api.get('/clients', { params })
    return data
  },
  async getById(id: number): Promise<Client> {
    const { data } = await api.get(`/clients/${id}`)
    return data
  },
  async create(payload: Partial<Client>): Promise<Client> {
    const { data } = await api.post('/clients', payload)
    return data
  },
  async update(id: number, payload: Partial<Client>): Promise<Client> {
    const { data } = await api.put(`/clients/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`)
  },
}

// ─── Quotes ───────────────────────────────────────────────────────────────────
export const quotesService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Quote>> {
    const { data } = await api.get('/quotes', { params })
    return data
  },
  async getById(id: number): Promise<Quote> {
    const { data } = await api.get(`/quotes/${id}`)
    return data
  },
  async create(payload: Partial<Quote>): Promise<Quote> {
    const { data } = await api.post('/quotes', payload)
    return data
  },
  async update(id: number, payload: Partial<Quote>): Promise<Quote> {
    const { data } = await api.put(`/quotes/${id}`, payload)
    return data
  },
  async updateStatus(id: number, status: string): Promise<Quote> {
    const { data } = await api.patch(`/quotes/${id}/status`, { status })
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/quotes/${id}`)
  },
  async submitPublic(payload: Partial<Quote>): Promise<void> {
    await api.post('/quotes/public', payload)
  },
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoicesService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Invoice>> {
    const { data } = await api.get('/invoices', { params })
    return data
  },
  async getById(id: number): Promise<Invoice> {
    const { data } = await api.get(`/invoices/${id}`)
    return data
  },
  async create(payload: Partial<Invoice>): Promise<Invoice> {
    const { data } = await api.post('/invoices', payload)
    return data
  },
  async update(id: number, payload: Partial<Invoice>): Promise<Invoice> {
    const { data } = await api.put(`/invoices/${id}`, payload)
    return data
  },
  async generatePdf(id: number): Promise<{ pdfUrl: string }> {
    const { data } = await api.post(`/invoices/${id}/pdf`)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/invoices/${id}`)
  },
}

// ─── Contracts ────────────────────────────────────────────────────────────────
export const contractsService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Contract>> {
    const { data } = await api.get('/contracts', { params })
    return data
  },
  async getById(id: number): Promise<Contract> {
    const { data } = await api.get(`/contracts/${id}`)
    return data
  },
  async create(payload: Partial<Contract>): Promise<Contract> {
    const { data } = await api.post('/contracts', payload)
    return data
  },
  async update(id: number, payload: Partial<Contract>): Promise<Contract> {
    const { data } = await api.put(`/contracts/${id}`, payload)
    return data
  },
  async generatePdf(id: number): Promise<{ pdfUrl: string }> {
    const { data } = await api.post(`/contracts/${id}/pdf`)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/contracts/${id}`)
  },
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export const appointmentsService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Appointment>> {
    const { data } = await api.get('/appointments', { params })
    return data
  },
  async getById(id: number): Promise<Appointment> {
    const { data } = await api.get(`/appointments/${id}`)
    return data
  },
  async create(payload: Partial<Appointment>): Promise<Appointment> {
    const { data } = await api.post('/appointments', payload)
    return data
  },
  async update(id: number, payload: Partial<Appointment>): Promise<Appointment> {
    const { data } = await api.put(`/appointments/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`)
  },
}

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamService = {
  async getAll(params?: Record<string, unknown>): Promise<TeamMember[]> {
    const { data } = await api.get('/team', { params })
    return data
  },
  async getById(id: number): Promise<TeamMember> {
    const { data } = await api.get(`/team/${id}`)
    return data
  },
  async create(payload: Partial<TeamMember>): Promise<TeamMember> {
    const { data } = await api.post('/team', payload)
    return data
  },
  async update(id: number, payload: Partial<TeamMember>): Promise<TeamMember> {
    const { data } = await api.put(`/team/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/team/${id}`)
  },
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<BlogPost>> {
    const { data } = await api.get('/blog', { params })
    return data
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    const { data } = await api.get(`/blog/${slug}`)
    return data
  },
  async create(payload: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await api.post('/blog', payload)
    return data
  },
  async update(id: number, payload: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await api.put(`/blog/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/blog/${id}`)
  },
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsService = {
  async getAll(params?: Record<string, unknown>): Promise<Testimonial[]> {
    const { data } = await api.get('/testimonials', { params })
    return data
  },
  async create(payload: Partial<Testimonial>): Promise<Testimonial> {
    const { data } = await api.post('/testimonials', payload)
    return data
  },
  async update(id: number, payload: Partial<Testimonial>): Promise<Testimonial> {
    const { data } = await api.put(`/testimonials/${id}`, payload)
    return data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/testimonials/${id}`)
  },
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messagesService = {
  async getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Message>> {
    const { data } = await api.get('/messages', { params })
    return data
  },
  async markRead(id: number): Promise<void> {
    await api.patch(`/messages/${id}/read`)
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/messages/${id}`)
  },
  async sendPublic(payload: Partial<Message>): Promise<void> {
    await api.post('/messages/public', payload)
  },
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadService = {
  async upload(file: File): Promise<UploadedFile> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async uploadMultiple(files: File[]): Promise<UploadedFile[]> {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const { data } = await api.post('/upload/multiple', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get('/dashboard/stats')
    return data
  },
  async getRecentActivity() {
    const { data } = await api.get('/dashboard/activity')
    return data
  },
}
