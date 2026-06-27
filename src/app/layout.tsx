import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyWebAppBuilder — 코딩 없이 앱 초안 만들기',
  description:
    '아이디어만 적으면 AI가 기획서, 화면 구성, 모바일 미리보기, 다운로드 가능한 앱 코드까지 만들어줍니다.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
