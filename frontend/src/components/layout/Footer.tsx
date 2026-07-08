import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  services: [
    { href: '/services#web', label: 'Développement Web' },
    { href: '/services#mobile', label: 'Développement Mobile' },
    { href: '/services#design', label: 'UI/UX Design' },
    { href: '/services#maintenance', label: 'Maintenance' },
    { href: '/services#hosting', label: 'Hébergement' },
  ],
  company: [
    { href: '/a-propos', label: 'À propos' },
    { href: '/equipe', label: 'Notre équipe' },
    { href: '/projets', label: 'Nos projets' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/confidentialite', label: 'Confidentialité' },
    { href: '/cgv', label: 'CGV' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-white mb-4 block">
              <span className="gradient-text">Techno</span>-logia
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-500 max-w-xs">
              Agence digitale spécialisée en développement web, mobile et design UI/UX. Nous transformons vos idées en solutions numériques performantes.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Entreprise</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                <span>123 Rue de l&apos;Innovation<br />75001 Paris, France</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="shrink-0 text-primary-400" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">+33 1 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="shrink-0 text-primary-400" />
                <a href="mailto:contact@techno-logia.fr" className="hover:text-white transition-colors">contact@techno-logia.fr</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Techno-logia. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
