import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import { ConffetiProvider } from '@/components/providers/conffeti-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Edulearn',
  description: 'Education Platform for student.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ToasterProvider />
        <ConffetiProvider />
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  
  )
}
