// Déclaration d'augmentation pour Express
declare global {
  namespace Express {
    interface User {
      id: number
      role: 'admin' | 'client'
      email: string
    }
  }
}

// Cette exportation est nécessaire pour que le fichier soit traité comme un module
export {}