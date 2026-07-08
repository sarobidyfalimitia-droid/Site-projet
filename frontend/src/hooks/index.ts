import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { projectsService } from '@/services/projects.service'
import {
  categoriesService, clientsService, quotesService, invoicesService,
  contractsService, appointmentsService, teamService, blogService,
  testimonialsService, messagesService, dashboardService
} from '@/services'
import type { ProjectFilters } from '@/types'
import toast from 'react-hot-toast'

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const queryKeys = {
  projects: (filters?: ProjectFilters) => ['projects', filters] as const,
  project: (slug: string) => ['project', slug] as const,
  projectById: (id: number) => ['project', 'id', id] as const,
  categories: () => ['categories'] as const,
  clients: (params?: object) => ['clients', params] as const,
  client: (id: number) => ['client', id] as const,
  quotes: (params?: object) => ['quotes', params] as const,
  quote: (id: number) => ['quote', id] as const,
  invoices: (params?: object) => ['invoices', params] as const,
  invoice: (id: number) => ['invoice', id] as const,
  contracts: (params?: object) => ['contracts', params] as const,
  contract: (id: number) => ['contract', id] as const,
  appointments: (params?: object) => ['appointments', params] as const,
  team: (params?: object) => ['team', params] as const,
  teamMember: (id: number) => ['team', id] as const,
  blog: (params?: object) => ['blog', params] as const,
  blogPost: (slug: string) => ['blog', slug] as const,
  testimonials: (params?: object) => ['testimonials', params] as const,
  messages: (params?: object) => ['messages', params] as const,
  dashboardStats: () => ['dashboard', 'stats'] as const,
  dashboardActivity: () => ['dashboard', 'activity'] as const,
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: queryKeys.projects(filters),
    queryFn: () => projectsService.getAll(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => projectsService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.projects({ featured: true }),
    queryFn: () => projectsService.getFeatured(),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projet créé avec succès')
    },
    onError: () => toast.error('Erreur lors de la création du projet'),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof projectsService.update>[1]) =>
      projectsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projet mis à jour')
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectsService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projet supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: categoriesService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Catégorie créée') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof categoriesService.update>[1]) =>
      categoriesService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Catégorie mise à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Catégorie supprimée') },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export function useClients(params?: object) {
  return useQuery({
    queryKey: queryKeys.clients(params),
    queryFn: () => clientsService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useClient(id: number) {
  return useQuery({
    queryKey: queryKeys.client(id),
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); toast.success('Client créé') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof clientsService.update>[1]) =>
      clientsService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); toast.success('Client mis à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clientsService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); toast.success('Client supprimé') },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

// ─── Quotes ───────────────────────────────────────────────────────────────────
export function useQuotes(params?: object) {
  return useQuery({
    queryKey: queryKeys.quotes(params),
    queryFn: () => quotesService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useCreateQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: quotesService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Devis créé') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateQuoteStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => quotesService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Statut mis à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export function useDeleteQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: quotesService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotes'] }); toast.success('Devis supprimé') },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export function useInvoices(params?: object) {
  return useQuery({
    queryKey: queryKeys.invoices(params),
    queryFn: () => invoicesService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: invoicesService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Facture créée') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useGenerateInvoicePdf() {
  return useMutation({
    mutationFn: invoicesService.generatePdf,
    onSuccess: () => toast.success('PDF généré'),
    onError: () => toast.error('Erreur lors de la génération du PDF'),
  })
}

// ─── Contracts ────────────────────────────────────────────────────────────────
export function useContracts(params?: object) {
  return useQuery({
    queryKey: queryKeys.contracts(params),
    queryFn: () => contractsService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useCreateContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contractsService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contracts'] }); toast.success('Contrat créé') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useAppointments(params?: object) {
  return useQuery({
    queryKey: queryKeys.appointments(params),
    queryFn: () => appointmentsService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: appointmentsService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['appointments'] }); toast.success('Rendez-vous créé') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof appointmentsService.update>[1]) =>
      appointmentsService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['appointments'] }); toast.success('Rendez-vous mis à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export function useTeam(params?: object) {
  return useQuery({
    queryKey: queryKeys.team(params),
    queryFn: () => teamService.getAll(params as Record<string, unknown>),
  })
}

export function useCreateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teamService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); toast.success('Membre ajouté') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof teamService.update>[1]) =>
      teamService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); toast.success('Membre mis à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export function useDeleteTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teamService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); toast.success('Membre supprimé') },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export function useBlogPosts(params?: object) {
  return useQuery({
    queryKey: queryKeys.blog(params),
    queryFn: () => blogService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.blogPost(slug),
    queryFn: () => blogService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateBlogPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Article créé') },
    onError: () => toast.error('Erreur lors de la création'),
  })
}

export function useUpdateBlogPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof blogService.update>[1]) =>
      blogService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Article mis à jour') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export function useTestimonials(params?: object) {
  return useQuery({
    queryKey: queryKeys.testimonials(params),
    queryFn: () => testimonialsService.getAll(params as Record<string, unknown>),
  })
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export function useMessages(params?: object) {
  return useQuery({
    queryKey: queryKeys.messages(params),
    queryFn: () => messagesService.getAll(params as Record<string, unknown>),
    placeholderData: keepPreviousData,
  })
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats(),
    queryFn: dashboardService.getStats,
    staleTime: 2 * 60 * 1000,
  })
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: queryKeys.dashboardActivity(),
    queryFn: dashboardService.getRecentActivity,
  })
}
