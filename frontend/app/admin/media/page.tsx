'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react'
import { uploadService } from '@/services'
import type { UploadedFile } from '@/types'
import toast from 'react-hot-toast'

export default function AdminMediaPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const onDrop = useCallback(async (accepted: File[]) => {
    setUploading(true)
    try {
      const uploaded = await uploadService.uploadMultiple(accepted)
      setFiles(prev => [...uploaded, ...prev])
      toast.success(`${uploaded.length} fichier(s) uploadé(s)`)
    } catch { toast.error('Erreur lors de l\'upload') }
    finally { setUploading(false) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 10 * 1024 * 1024,
  })

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}`)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
    toast.success('URL copiée !')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Médiathèque</h1><p className="text-gray-500 text-sm mt-1">Gérez vos images et documents</p></div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'}`}
      >
        <input {...getInputProps()} />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDragActive ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Upload size={24} className={isDragActive ? 'text-primary-500' : 'text-gray-400'} />
        </div>
        {uploading ? (
          <p className="text-sm text-gray-500">Upload en cours…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isDragActive ? 'Déposez ici…' : 'Glissez des fichiers ou cliquez pour parcourir'}
            </p>
            <p className="text-xs text-gray-400">Images, PDF — max 10 Mo par fichier</p>
          </>
        )}
      </div>

      {/* Files grid */}
      {files.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Fichiers uploadés ({files.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file, i) => (
              <div key={i} className="group relative card overflow-hidden aspect-square">
                {file.mimetype.startsWith('image/') ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${file.url}`} alt={file.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <ImageIcon size={28} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(file.url)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all">
                    {copied === file.url ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-white text-xs truncate">{file.filename}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && !uploading && (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="text-sm">Uploadez des fichiers pour les voir apparaître ici</p>
        </div>
      )}
    </div>
  )
}
