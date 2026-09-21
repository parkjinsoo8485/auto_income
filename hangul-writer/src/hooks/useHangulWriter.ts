'use client';
import { useState, useCallback } from 'react';
import { composeStrokePlan, type StrokePlan } from '../core/stroke-composer';
import { evaluateStroke, type PointerPoint } from '../core/stroke-evaluator';

type WriterMode = 'animate' | 'quiz';

interface UseHangulWriterOptions {
  initialChar?: string;
  mode?: WriterMode;
  onCharComplete?: (char: string) => void;
}

export function useHangulWriter({
  initialChar = '한',
  mode        = 'animate',
  onCharComplete,
}: UseHangulWriterOptions = {}) {
  const [currentChar, setCurrentChar] = useState(initialChar);
  const [plan,        setPlan]        = useState<StrokePlan>(() => composeStrokePlan(initialChar));
  const [currentMode, setMode]        = useState<WriterMode>(mode);

  // 현재 애니메이션 획 인덱스 (-1: 전체 완료 또는 대기)
  const [animStep,    setAnimStep]    = useState<number>(0);
  // 퀴즈 모드: 현재 써야 할 획 인덱스 (0부터)
  const [quizStep,    setQuizStep]    = useState<number>(0);
  // 완료된 획 목록 (인덱스 집합)
  const [doneStrokes, setDoneStrokes] = useState<Set<number>>(new Set());
  // 오류 획 인덱스 (flash용)
  const [errorStroke, setErrorStroke] = useState<number | null>(null);
  // 글자 완성 여부
  const [isComplete,  setIsComplete]  = useState(false);

  /** 글자 변경 */
  const changeChar = useCallback((char: string) => {
    setCurrentChar(char);
    const newPlan = composeStrokePlan(char);
    setPlan(newPlan);
    setAnimStep(0);
    setQuizStep(0);
    setDoneStrokes(new Set());
    setErrorStroke(null);
    setIsComplete(false);
  }, []);

  /** 애니메이션 모드: 다음 획 진행 */
  const nextStep = useCallback(() => {
    setAnimStep((prev) => Math.min(prev + 1, plan.strokes.length));
  }, [plan.strokes.length]);

  /** 처음부터 다시 */
  const reset = useCallback(() => {
    setAnimStep(0);
    setQuizStep(0);
    setDoneStrokes(new Set());
    setErrorStroke(null);
    setIsComplete(false);
  }, []);

  /** 퀴즈 모드: 사용자 드래그 완료 후 판정 */
  const submitQuizStroke = useCallback(
    (points: PointerPoint[]) => {
      if (currentMode !== 'quiz') return;
      if (isComplete) return;
      const target = plan.strokes[quizStep];
      if (!target) return;

      const feedback = evaluateStroke(points, target, 200);
      if (feedback.result === 'success') {
        const next = quizStep + 1;
        const newDone = new Set(doneStrokes).add(quizStep);
        setDoneStrokes(newDone);
        if (next >= plan.strokes.length) {
          setIsComplete(true);
          onCharComplete?.(currentChar);
        } else {
          setQuizStep(next);
        }
      } else {
        setErrorStroke(quizStep);
        setTimeout(() => setErrorStroke(null), 600);
      }
      return feedback;
    },
    [currentMode, isComplete, plan.strokes, quizStep, doneStrokes, currentChar, onCharComplete],
  );

  return {
    currentChar,
    plan,
    currentMode,
    setMode,
    animStep,
    quizStep,
    doneStrokes,
    errorStroke,
    isComplete,
    changeChar,
    nextStep,
    reset,
    submitQuizStroke,
  };
}
