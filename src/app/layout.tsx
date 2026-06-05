import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyWebAppBuilder',
  description: '코딩 없이 내 앱을 만들어보세요',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
