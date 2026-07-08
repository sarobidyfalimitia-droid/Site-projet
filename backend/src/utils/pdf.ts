import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import type { Invoice, Client } from '@prisma/client'

type InvoiceWithClient = Invoice & { client: Client | null; items?: Array<{ description: string; quantity: number; unitPrice: number; total: number }> }

export async function generateInvoicePdf(invoice: InvoiceWithClient): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'invoices')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const filename = `invoice-${invoice.id}.pdf`
  const filepath = path.join(uploadsDir, filename)

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const stream = fs.createWriteStream(filepath)

    doc.pipe(stream)

    // Header
    doc.fontSize(24).fillColor('#6366F1').text('Techno-logia', 50, 50)
    doc.fontSize(10).fillColor('#6B7280').text('123 Rue de l\'Innovation, 75001 Paris', 50, 82)
    doc.text('contact@techno-logia.fr | +33 1 23 45 67 89', 50, 96)

    // Invoice number
    doc.fontSize(20).fillColor('#111827').text(`Facture ${invoice.number}`, 350, 50, { align: 'right' })
    doc.fontSize(10).fillColor('#6B7280').text(`Date : ${new Date(invoice.createdAt).toLocaleDateString('fr-FR')}`, 350, 78, { align: 'right' })
    doc.text(`Échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, 350, 92, { align: 'right' })

    // Divider
    doc.moveTo(50, 130).lineTo(545, 130).strokeColor('#E5E7EB').stroke()

    // Client info
    if (invoice.client) {
      doc.fontSize(12).fillColor('#111827').text('Facturé à :', 50, 150)
      doc.fontSize(11).fillColor('#374151').text(invoice.client.name, 50, 168)
      if (invoice.client.company) doc.text(invoice.client.company, 50, 183)
      doc.text(invoice.client.email, 50, 198)
    }

    // Table header
    const tableTop = 260
    doc.rect(50, tableTop, 495, 28).fill('#F9FAFB')
    doc.fontSize(10).fillColor('#6B7280')
      .text('Description', 60, tableTop + 8)
      .text('Qté', 350, tableTop + 8, { width: 60, align: 'center' })
      .text('Prix unit.', 415, tableTop + 8, { width: 70, align: 'right' })
      .text('Total', 490, tableTop + 8, { width: 55, align: 'right' })

    // Items
    const items = (invoice.items as InvoiceWithClient['items']) ?? []
    let y = tableTop + 36
    items.forEach((item, i) => {
      if (i % 2 === 0) doc.rect(50, y - 4, 495, 24).fill('#FAFAFA')
      doc.fontSize(10).fillColor('#374151')
        .text(item.description, 60, y)
        .text(String(item.quantity), 350, y, { width: 60, align: 'center' })
        .text(`${item.unitPrice.toFixed(2)} €`, 415, y, { width: 70, align: 'right' })
        .text(`${item.total.toFixed(2)} €`, 490, y, { width: 55, align: 'right' })
      y += 28
    })

    // Total
    doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor('#E5E7EB').stroke()
    doc.fontSize(14).fillColor('#6366F1')
      .text('Total TTC', 350, y + 24)
      .text(`${invoice.amount.toFixed(2)} €`, 490, y + 24, { width: 55, align: 'right' })

    // Footer
    doc.fontSize(9).fillColor('#9CA3AF')
      .text('Merci pour votre confiance. Techno-logia — SIRET: 000 000 000 00000', 50, 780, { align: 'center', width: 495 })

    doc.end()
    stream.on('finish', () => resolve(`/uploads/invoices/${filename}`))
    stream.on('error', reject)
  })
}

export async function generateContractPdf(contract: { id: number; title: string; description: string; startDate: Date | null; endDate: Date | null }, clientName: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'contracts')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const filename = `contract-${contract.id}.pdf`
  const filepath = path.join(uploadsDir, filename)

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const stream = fs.createWriteStream(filepath)
    doc.pipe(stream)

    // Header
    doc.fontSize(20).fillColor('#6366F1').text('CONTRAT DE PRESTATION', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).fillColor('#111827').text(contract.title, { align: 'center' })
    doc.moveDown(2)

    // Parties
    doc.fontSize(12).fillColor('#374151')
    doc.text('ENTRE LES SOUSSIGNÉS :')
    doc.moveDown(0.5)
    doc.fontSize(11).text('Techno-logia, agence digitale, 123 Rue de l\'Innovation, 75001 Paris')
    doc.text('ci-après dénommée « Le Prestataire »')
    doc.moveDown()
    doc.text(`${clientName}`)
    doc.text('ci-après dénommé « Le Client »')
    doc.moveDown(1.5)

    // Content
    doc.fontSize(12).fillColor('#111827').text('OBJET DU CONTRAT')
    doc.moveDown(0.5)
    doc.fontSize(11).fillColor('#374151').text(contract.description, { lineGap: 4 })
    doc.moveDown(1.5)

    // Dates
    if (contract.startDate || contract.endDate) {
      doc.fontSize(12).fillColor('#111827').text('DURÉE')
      doc.moveDown(0.5)
      if (contract.startDate) doc.fontSize(11).fillColor('#374151').text(`Début : ${new Date(contract.startDate).toLocaleDateString('fr-FR')}`)
      if (contract.endDate) doc.text(`Fin : ${new Date(contract.endDate).toLocaleDateString('fr-FR')}`)
      doc.moveDown(1.5)
    }

    // Signatures
    doc.moveDown(3)
    doc.fontSize(11).fillColor('#374151')
      .text('Le Prestataire', 80, undefined, { continued: true })
      .text('Le Client', { align: 'right' })
    doc.moveDown()
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 80, undefined, { continued: true })
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' })
    doc.moveDown(2)
    doc.moveTo(80, doc.y).lineTo(230, doc.y).strokeColor('#D1D5DB').stroke()
    doc.moveTo(350, doc.y).lineTo(500, doc.y).strokeColor('#D1D5DB').stroke()

    doc.end()
    stream.on('finish', () => resolve(`/uploads/contracts/${filename}`))
    stream.on('error', reject)
  })
}
