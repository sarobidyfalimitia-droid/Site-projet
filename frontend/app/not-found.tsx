import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center">
        <div className="font-display text-[160px] font-bold leading-none gradient-text select-none">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 -mt-4">Page introuvable</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
