'use client';
import { HangulWriter } from '../components/HangulWriter/HangulWriter';
import { useState } from 'react';

const TECH_BADGES = [
  'Next.js 16', 'TypeScript', 'SVG 마스킹', 'Pointer Events API',
  'stroke-dashoffset', 'Tailwind CSS', 'KS X 1001 레이아웃', 'Unicode 분해',
];

export default function HomePage() {
  const [completedChars, setCompletedChars] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* ── 배경 글로우 ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl"/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[700px] bg-pink-500/4 rounded-full blur-3xl"/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* ── 헤더 ── */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-5
                          backdrop-blur-sm">
            <span>✨</span>
            <span>조합형 자모 엔진 · 11,172자 완전 지원</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4
                         bg-gradient-to-r from-sky-300 via-violet-300 to-pink-300
                         bg-clip-text text-transparent leading-tight">
            한글 획순 학습
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            한글 자모의 조합 원리를 이해하고,<br/>
            아름다운 획순 애니메이션으로 정확한 필기법을 익히세요.
          </p>

          {/* 완성 글자 뱃지 */}
          {completedChars.length > 0 && (
            <div className="mt-5 flex items-center gap-2 justify-center flex-wrap">
              <span className="text-slate-500 text-sm">완성한 글자:</span>
              {completedChars.map((c, i) => (
                <span key={i}
                      className="w-9 h-9 flex items-center justify-center rounded-xl
                                 bg-emerald-500/15 border border-emerald-500/30
                                 text-emerald-300 font-bold text-lg">
                  {c}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* ── 메인 2-컬럼 레이아웃 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── 획순 앱 (3/5) ── */}
          <section className="lg:col-span-3 bg-slate-900/60 backdrop-blur-sm
                               border border-slate-700/40 rounded-3xl p-6 shadow-2xl">
            <HangulWriter
              initialChar="한"
              onCharComplete={(c) => setCompletedChars((prev) => [...prev, c])}
            />
          </section>

          {/* ── 우측 정보 패널 (2/5) ── */}
          <aside className="lg:col-span-2 space-y-4">

            {/* 사용법 카드 */}
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
                <span>📖</span> 사용 방법
              </h2>
              <ol className="space-y-3 text-sm">
                {[
                  ['▶ 애니메이션', '재생 버튼을 눌러 획순이 자동으로 그려지는 과정을 학습합니다.'],
                  ['✏ 필기 퀴즈', '화면에 손가락 또는 마우스로 직접 한글을 써보세요.'],
                  ['글자 선택', '하단 글자 버튼으로 다양한 한글 낱자를 연습할 수 있습니다.'],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-3">
                    <span className="bg-sky-500/15 text-sky-300 rounded-lg px-2 py-0.5 text-xs
                                     font-semibold whitespace-nowrap h-fit mt-0.5">{title}</span>
                    <span className="text-slate-400 leading-relaxed text-xs">{desc}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 조합 원리 */}
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-violet-300 mb-3 flex items-center gap-2">
                <span>🔬</span> 조합형 아키텍처
              </h2>
              <div className="space-y-2.5">
                {[
                  ['🧩', '초성 × 중성 × 종성 조합', '자모 소수의 세트 데이터로 11,172자를 실시간 조립합니다.'],
                  ['🎭', 'SVG 마스킹 기법', '폰트 외곽선 위에 획 뼈대 선이 자라며 글씨가 드러나는 Reveal 애니메이션.'],
                  ['📐', '6대 음절 구조 자동 판별', '세로/가로/복합 모음 × 받침 유무로 6가지 레이아웃을 자동 결정합니다.'],
                  ['✍', '필기 인식 판정 엔진', '시작점·방향·길이를 종합 판정하는 획 인식 알고리즘으로 퀴즈를 구현합니다.'],
                ].map(([icon, title, desc]) => (
                  <div key={title as string}
                       className="flex gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-lg leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="text-slate-200 font-semibold text-xs mb-0.5">{title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-pink-300 mb-3 flex items-center gap-2">
                <span>⚡</span> 기술 스택
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {TECH_BADGES.map((tech) => (
                  <span key={tech}
                        className="px-2 py-1 text-xs rounded-lg
                                   bg-slate-800 border border-slate-700/60
                                   text-slate-400 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* ── 푸터 ── */}
        <footer className="text-center mt-14 text-slate-700 text-sm">
          <p>한글 획순 학습 앱 · 조합형 자모 합성 엔진 기반</p>
          <p className="mt-1 text-slate-800">Built with Next.js · TypeScript · SVG Masking</p>
        </footer>
      </div>
    </main>
  );
}
