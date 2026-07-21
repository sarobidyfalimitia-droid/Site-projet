import nodemailer from 'nodemailer'

const getTransporter = () => {
  const host = process.env.SMTP_HOST?.trim() || '127.0.0.1'
  const port = Number(process.env.SMTP_PORT || 1025)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(user && pass ? { auth: { user, pass } } : {}),
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const shouldSkipEmail = () => {
  return process.env.SMTP_DISABLED === 'true' || process.env.SMTP_DISABLED === '1'
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (shouldSkipEmail()) {
    console.log('[Email] SMTP disabled, skipping:', subject)
    return
  }

  const transporter = getTransporter()

  try {
    const info = await Promise.race([
      transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || 'Techno-logia <noreply@techno-logia.fr>',
        to,
        subject,
        html,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP timeout')), 10000)),
    ])
    console.log(`[Email] Sent successfully to ${to}:`, (info as { messageId?: string }).messageId)
  } catch (error) {
    console.warn('[Email] Failed to send email:', error instanceof Error ? error.message : error)
  }
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

  verifyRegistration: (name: string, code: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366F1; font-size: 24px;">Confirmez votre inscription</h1>
      <p>Bonjour <strong>${name}</strong>,</p>
      <p>Voici votre code de vérification à usage unique :</p>
      <div style="margin: 24px 0; padding: 20px; background: #F3F4F6; border-radius: 12px; text-align: center; font-size: 1.5rem; letter-spacing: 0.3rem; font-weight: 700;">
        ${code}
      </div>
      <p>Entrez ce code sur la page d'inscription pour valider votre compte.</p>
      <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">Techno-logia · contact@techno-logia.fr</p>
    </div>
  `,

  passwordReset: (code: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366F1; font-size: 24px;">Réinitialisation du mot de passe</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Utilisez ce code de vérification :</p>
      <div style="margin: 24px 0; padding: 20px; background: #F3F4F6; border-radius: 12px; text-align: center; font-size: 1.5rem; letter-spacing: 0.3rem; font-weight: 700;">
        ${code}
      </div>
      <p>Entrez ce code pour définir un nouveau mot de passe.</p>
      <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">Techno-logia · contact@techno-logia.fr</p>
    </div>
  `,
}
