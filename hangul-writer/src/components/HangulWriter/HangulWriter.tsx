'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { StrokeAnimatedView } from './StrokeAnimatedView';
import { StrokeWritingCanvas } from './StrokeWritingCanvas';
import { useHangulWriter } from '../../hooks/useHangulWriter';

// TOPIK 초급 학습 단어 목록
const SAMPLE_WORDS = [
  '가','나','다','라','마','바','사','아','자','차','카','타','파','하',
  '한','글','국','어','학','교','생','일','월','화','수','목','금','토',
  '봄','여','름','가','을','겨','울','사','랑','행','복','친','구',
];

interface HangulWriterProps {
  initialChar?: string;
  onCharComplete?: (char: string) => void;
}

export function HangulWriter({ initialChar = '한', onCharComplete }: HangulWriterProps) {
  const {
    currentChar, plan, currentMode, setMode,
    animStep, quizStep, doneStrokes, errorStroke, isComplete,
    changeChar, nextStep, reset, submitQuizStroke,
  } = useHangulWriter({ initialChar, onCharComplete });

  // 애니메이션 모드에서 자동 진행
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPlay     = useRef(false);

  const playAnimation = useCallback(() => {
    autoPlay.current = true;
    let step = 0;
    const advance = () => {
      if (!autoPlay.current) return;
      if (step < plan.strokes.length) {
        step++;
        nextStep();
        animTimerRef.current = setTimeout(advance, 900);
      }
    };
    reset();
    animTimerRef.current = setTimeout(advance, 300);
  }, [plan.strokes.length, nextStep, reset]);

  const stopAnimation = useCallback(() => {
    autoPlay.current = false;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
  }, []);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  const totalStrokes = plan.strokes.length;
  const progress     = currentMode === 'animate'
    ? Math.round((animStep / totalStrokes) * 100)
    : Math.round((doneStrokes.size / totalStrokes) * 100);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto select-none">
      {/* 글자 표시 헤더 */}
      <div className="text-center">
        <div className="text-7xl font-bold text-white/10 select-none pointer-events-none absolute left-1/2 -translate-x-1/2 mt-1" aria-hidden>
          {currentChar}
        </div>
        <p className="text-sm text-blue-300/60 mt-1">
          총 {totalStrokes}획
          {isComplete && <span className="ml-2 text-emerald-400 font-semibold">✓ 완성!</span>}
        </p>
      </div>

      {/* SVG 캔버스 영역 */}
      <div className="relative w-full aspect-square rounded-2xl bg-slate-900/80 border border-slate-700/50
                      shadow-[0_0_60px_rgba(56,189,248,0.08)] overflow-hidden">
        {currentMode === 'animate' ? (
          <StrokeAnimatedView
            plan={plan}
            revealUpTo={animStep}
            showGrid showNumbers showGuide
            viewSize={200}
            className="w-full h-full"
          />
        ) : (
          <StrokeWritingCanvas
            plan={plan}
            currentStrokeIdx={quizStep}
            doneStrokes={doneStrokes}
            errorStroke={errorStroke}
            onStrokeEnd={(pts) => { submitQuizStroke(pts); }}
            viewSize={200}
            className="w-full h-full"
          />
        )}
      </div>

      {/* 진행 바 */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 모드 토글 및 컨트롤 버튼 */}
      <div className="flex gap-2">
        {/* 모드 선택 */}
        <div className="flex bg-slate-800/60 rounded-xl p-1 gap-1 flex-1">
          {(['animate','quiz'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); stopAnimation(); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200
                ${currentMode === m
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'}`}
            >
              {m === 'animate' ? '▶ 애니메이션' : '✏ 필기 퀴즈'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {currentMode === 'animate' && (
          <>
            <button
              onClick={playAnimation}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-all"
            >
              ▶ 재생
            </button>
            <button
              onClick={stopAnimation}
              className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold transition-all"
            >
              ■ 정지
            </button>
          </>
        )}
        <button
          onClick={() => { reset(); stopAnimation(); }}
          className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold transition-all"
        >
          ↺ 초기화
        </button>
      </div>

      {/* 글자 선택 */}
      <div>
        <p className="text-xs text-slate-500 mb-2 text-center">글자 선택</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {SAMPLE_WORDS.slice(0, 20).map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => { changeChar(w); stopAnimation(); }}
              className={`w-10 h-10 rounded-lg text-base font-semibold transition-all duration-150
                ${currentChar === w
                  ? 'bg-blue-500 text-white shadow-md scale-110'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
