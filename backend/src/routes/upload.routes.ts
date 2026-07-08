import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Type de fichier non autorisé'))
  },
})

router.post('/', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' })
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype })
})

router.post('/multiple', authenticate, upload.array('files', 10), (req, res) => {
  const files = req.files as Express.Multer.File[]
  if (!files?.length) return res.status(400).json({ error: 'Aucun fichier fourni' })
  res.json(files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.originalname, size: f.size, mimetype: f.mimetype })))
})

export default router
