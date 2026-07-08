import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.SMTP_USER) {
    console.log('[Email] SMTP not configured, skipping:', subject)
    return
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Techno-logia <noreply@techno-logia.fr>',
    to,
    subject,
    html,
  })
}

export const emailTemplates = {
  quoteReceived: (name: string, title: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366F1; font-size: 24px;">Votre demande a bien été reçue</h1>
      <p>Bonjour <strong>${name}</strong>,</p>
      <p>Nous avons bien reçu votre demande de devis pour : <strong>${title}</strong>.</p>
      <p>Notre équipe vous répondra dans les 24 heures.</p>
      <div style="margin: 32px 0; padding: 20px; background: #F9FAFB; border-radius: 12px;">
        <p style="margin: 0; color: #6B7280; font-size: 14px;">Techno-logia · contact@techno-logia.fr</p>
      </div>
    </div>
  `,

  quoteApproved: (name: string, title: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #10B981;">Votre devis a été approuvé !</h1>
      <p>Bonjour <strong>${name}</strong>,</p>
      <p>Excellente nouvelle ! Votre devis pour <strong>${title}</strong> a été approuvé.</p>
      <p>Connectez-vous à votre espace client pour consulter les détails et la suite du processus.</p>
      <a href="${process.env.FRONTEND_URL}/client" style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
        Accéder à mon espace
      </a>
    </div>
  `,

  appointmentConfirmed: (name: string, date: string, meetUrl?: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366F1;">Rendez-vous confirmé</h1>
      <p>Bonjour <strong>${name}</strong>,</p>
      <p>Votre rendez-vous du <strong>${date}</strong> est confirmé.</p>
      ${meetUrl ? `<p><a href="${meetUrl}" style="color: #6366F1;">Rejoindre la réunion Google Meet</a></p>` : ''}
    </div>
  `,

  newMessageReceived: (adminEmail: string, senderName: string, subject: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366F1;">Nouveau message reçu</h1>
      <p>Un nouveau message de <strong>${senderName}</strong> vous attend.</p>
      <p>Sujet : <strong>${subject}</strong></p>
      <a href="${process.env.FRONTEND_URL}/admin/messages" style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
        Voir le message
      </a>
    </div>
  `,
}
