// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'client'

export interface AuthUser {
  id: number
  email: string
  name?: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
  phonePrefix?: string
  phoneNumber?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  slug: string
  _count?: { projects: number }
}

export interface Project {
  id: number
  title: string
  slug: string
  excerpt: string
  description: string
  coverImage: string
  images: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  technologies: string[]
  published: boolean
  featured: boolean
  realizedAt: string
  categoryId: number
  category?: Category
  clientId?: number | null
  client?: Client | null
  createdAt: string
  updatedAt: string
}

export interface ProjectFilters {
  search?: string
  categoryId?: number
  featured?: boolean
  page?: number
  limit?: number
  sort?: 'asc' | 'desc'
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export interface Client {
  id: number
  name: string
  company?: string | null
  email: string
  phone?: string | null
  status: 'active' | 'inactive'
  password?: string
  refreshToken?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    projects: number
    quotes: number
    invoices: number
  }
}

// ─── Quotes ───────────────────────────────────────────────────────────────────
export type QuoteStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Quote {
  id: number
  title: string
  description: string
  budgetRange?: string | null
  deadline?: string | null
  status: QuoteStatus
  clientId?: number | null
  client?: Client | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  company?: string | null
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface QuoteFormData {
  title: string
  description: string
  budgetRange?: string
  deadline?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  company?: string
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'

export interface Invoice {
  id: number
  number: string
  quoteId?: number | null
  quote?: Quote | null
  clientId?: number | null
  client?: Client | null
  amount: number
  dueDate: string
  status: InvoiceStatus
  pdfUrl?: string | null
  items?: InvoiceItem[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// ─── Contracts ────────────────────────────────────────────────────────────────
export type ContractStatus = 'DRAFT' | 'SENT' | 'SIGNED' | 'CANCELLED'

export interface Contract {
  id: number
  title: string
  description: string
  clientId?: number | null
  client?: Client | null
  quoteId?: number | null
  quote?: Quote | null
  startDate?: string | null
  endDate?: string | null
  status: ContractStatus
  pdfUrl?: string | null
  signedAt?: string | null
  createdAt: string
  updatedAt: string
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Appointment {
  id: number
  clientId?: number | null
  client?: Client | null
  subject: string
  description: string
  scheduledAt: string
  status: AppointmentStatus
  meetingUrl?: string | null
  createdAt: string
  updatedAt: string
}

// ─── Team Members ─────────────────────────────────────────────────────────────
export interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  photo: string
  skills: string[]
  socials: string[]
  portfolioUrl?: string | null
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  tags: string[]
  published: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export interface Testimonial {
  id: number
  clientName: string
  company?: string | null
  role?: string | null
  quote: string
  rating: number
  published: boolean
  createdAt: string
  updatedAt: string
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export interface Message {
  id: number
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  createdAt: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  projects: number
  clients: number
  quotes: number
  invoices: number
  revenue: number
  pendingQuotes: number
  activeProjects: number
  unreadMessages: number
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export interface UploadedFile {
  url: string
  filename: string
  size: number
  mimetype: string
}

// ─── Notifications ────────────────────────────────────────────────────────────
export interface Notification {
  id: string
  type: 'quote' | 'message' | 'appointment' | 'invoice' | 'system'
  title: string
  body: string
  read: boolean
  link?: string
  createdAt: string
}
