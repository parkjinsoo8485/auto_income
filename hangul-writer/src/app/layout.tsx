import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '한글 획순 학습 | Hangul Stroke Order',
  description: '외국인 학습자를 위한 인터랙티브 한글 획순 애니메이션 학습 앱. 자모 조합 엔진 기반의 스마트 한글 필기 연습.',
  keywords: ['Korean', 'Hangul', 'stroke order', '한글', '획순', '필기', '학습'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Noto+Sans+KR:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Gowun Dodum', 'Noto Sans KR', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
