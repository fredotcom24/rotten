import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata = {
  title: 'My Rotten Tomatoes',
  description: 'Film review and rating website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
