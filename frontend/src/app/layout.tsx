import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ローカルAIエージェントシステム',
  description: 'ローカルLLMを使った自律AIエージェントシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}