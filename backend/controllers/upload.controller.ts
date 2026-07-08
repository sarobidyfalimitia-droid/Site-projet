import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

// Type pour multer
interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

interface MulterRequest extends Request {
  file: MulterFile
}

export const uploadImage = (req: MulterRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier' })
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
}

export const deleteImage = (req: Request, res: Response) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, '../../uploads', filename)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  res.json({ message: 'Fichier supprimé' })
}

export const listImages = (_req: Request, res: Response) => {
  const dir = path.join(__dirname, '../../uploads')
  if (!fs.existsSync(dir)) return res.json([])
  const files = fs.readdirSync(dir).map(f => ({ filename: f, url: `/uploads/${f}` }))
  res.json(files)
}
