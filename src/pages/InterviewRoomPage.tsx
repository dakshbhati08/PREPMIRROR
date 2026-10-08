import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  SkipForward,
  LogOut,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Waveform } from '@/components/Waveform';
import { useRecorder } from '@/hooks/useRecorder';
import { submitAnswer, finishInterview } from '@/lib/api';
import { buildQuestions } from '@/lib/mockData';
import type { InterviewQuestion, AnswerFeedback } from '@/types';

interface AnswerRecord {
  questionIndex: number;
  transcript: string;
  feedback: AnswerFeedback;
}

export function InterviewRoomPage({ sessionId }: { sessionId: string; profileId: string }) {
  const { navigate } = useRouter();
  const allQuestions = useRef<InterviewQuestion[]>(buildQuestions());
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion>(allQuestions.current[0]);
  const [transcript, setTranscript] = useState('');
  const [lastFeedback, setLastFeedback] = useState<AnswerFeedback | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const recorder = useRecorder();

  const speak = useCallback((text: string) => {
    if (!readAloud || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }, [readAloud]);

  useEffect(() => {
    speak(currentQuestion.friendlyLine + ' ' + currentQuestion.prompt);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentQuestion, speak]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = useCallback(async (blob: Blob | null) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitAnswer({
        sessionId,
        audioBlob: blob,
        questionIndex: currentQuestion.index - 1,
      });
      setTranscript(result.transcript);
      setLastFeedback(result.feedback);
      setHasAnswered(true);
      setAnswers((prev) => [
        ...prev,
        { questionIndex: currentQuestion.index - 1, transcript: result.transcript, feedback: result.feedback },
      ]);
    } catch {
      setError('Could not process your answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, currentQuestion]);

  const handleMicClick = async () => {
    if (recorder.isRecording) {
      const blob = await recorder.stopRecording();
      await handleSubmitAnswer(blob);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      recorder.reset();
      setTranscript('');
      setHasAnswered(false);
      await recorder.startRecording();
    }
  };

  const handleRetry = async () => {
    if (recorder.isRecording) {
      await recorder.stopRecording();
    }
    recorder.reset();
    setTranscript('');
    setHasAnswered(false);
    setLastFeedback(null);
    setError(null);
    await recorder.startRecording();
  };

  const handleSkip = () => {
    const next = allQuestions.current[currentQuestion.index];
    if (next) {
      setCurrentQuestion(next);
      recorder.reset();
      setTranscript('');
      setHasAnswered(false);
      setLastFeedback(null);
      setError(null);
    } else {
      handleEnd();
    }
  };

  const handleNext = () => {
    const next = allQuestions.current[currentQuestion.index];
    if (next) {
      setCurrentQuestion(next);
      recorder.reset();
      setTranscript('');
      setHasAnswered(false);
      setLastFeedback(null);
    } else {
      handleEnd();
    }
  };

  const handleEnd = async () => {
    if (recorder.isRecording) await recorder.stopRecording();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsFinishing(true);
    try {
      await finishInterview(sessionId);
      navigate({ name: 'report', sessionId });
    } catch {
      setError("Could not finalize your interview. Let's try that again.");
      setIsFinishing(false);
    }
  };

  const progressPct = (currentQuestion.index / currentQuestion.total) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Navbar />

      <div className="container-max section-padding py-6 sm:py-10">
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink-600">
              Question {currentQuestion.index} of {currentQuestion.total}
            </span>
            <span className="text-xs text-ink-400">{answers.length} answered</span>
          </div>
          <div className="h-2 bg-ink-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Question card */}
          <div className="card p-6 sm:p-8 mb-6 animate-fade-in-up" key={currentQuestion.index}>
            <div className="flex items-start gap-4">
              {/* AI avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center shadow-md animate-float">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium mb-2">
                  {currentQuestion.category}
                </div>
                <p className="text-sm text-teal-600 italic mb-2">{currentQuestion.friendlyLine}</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink-800 leading-snug">
                  {currentQuestion.prompt}
                </h2>
              </div>
            </div>

            {/* Read aloud toggle */}
            <div className="mt-5 flex items-center justify-end">
              <button
                onClick={() => {
                  setReadAloud((v) => !v);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                className="flex items-center gap-2 text-xs text-ink-500 hover:text-brand-600 transition-colors"
                role="switch"
                aria-checked={readAloud}
              >
                {readAloud ? <Volume2 className="w-4 h-4 text-brand-500" /> : <VolumeX className="w-4 h-4" />}
                {readAloud ? 'Reading aloud' : 'Read questions aloud'}
              </button>
            </div>
          </div>

          {/* Recording area */}
          <div className="card p-6 sm:p-8 mb-6">
            {/* Waveform */}
            <div className="bg-ink-50 rounded-2xl p-4 mb-6 min-h-[96px] flex items-center justify-center">
              {recorder.isRecording ? (
                <Waveform analyser={recorder.analyser} isRecording={recorder.isRecording} />
              ) : recorder.isProcessing ? (
                <div className="flex items-center gap-2 text-ink-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Processing your answer...</span>
                </div>
              ) : (
                <p className="text-sm text-ink-400 text-center">
                  Tap the microphone when you're ready to answer.
                </p>
              )}
            </div>

            {/* Timer + mic button */}
            <div className="flex flex-col items-center gap-4">
              {recorder.isRecording && (
                <div className="flex items-center gap-2 text-ink-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse-soft" />
                  <span className="text-lg font-mono font-medium tabular-nums">{formatTime(recorder.duration)}</span>
                </div>
              )}

              <button
                onClick={handleMicClick}
                disabled={isSubmitting || recorder.isProcessing}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-4 disabled:opacity-50 ${
                  recorder.isRecording
                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-200 scale-105'
                    : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-200 hover:scale-105'
                }`}
                aria-label={recorder.isRecording ? 'Stop recording' : 'Start recording'}
              >
                {recorder.isRecording ? (
                  <Square className="w-8 h-8 text-white" fill="white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
                {recorder.isRecording && (
                  <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
                )}
              </button>

              <p className="text-sm text-ink-500 text-center">
                {recorder.isRecording
                  ? 'Tap to stop recording'
                  : isSubmitting
                    ? 'Analyzing your answer...'
                    : 'Tap to start recording'}
              </p>

              {recorder.error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {recorder.error}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                disabled={!hasAnswered || recorder.isRecording || isSubmitting}
                className="btn-ghost text-sm disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" /> Retry this answer
              </button>
              <button
                onClick={handleSkip}
                disabled={recorder.isRecording || isSubmitting}
                className="btn-ghost text-sm disabled:opacity-40"
              >
                <SkipForward className="w-4 h-4" /> Skip question
              </button>
              <button
                onClick={handleEnd}
                disabled={isFinishing}
                className="btn-ghost text-sm text-red-500 hover:bg-red-50 disabled:opacity-40"
              >
                {isFinishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                End interview
              </button>
            </div>
          </div>

          {/* Transcript */}
          {(transcript || isSubmitting) && (
            <div className="card p-6 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-ink-500" />
                </div>
                <h3 className="text-sm font-semibold text-ink-700">Your answer</h3>
              </div>
              {isSubmitting ? (
                <div className="flex items-center gap-2 text-ink-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Transcribing your response...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-ink-600 leading-relaxed">{transcript}</p>
                  {lastFeedback && (
                    <div className="mt-4 pt-4 border-t border-ink-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-medium text-teal-600">Quick feedback</span>
                        <span className="ml-auto text-xs font-semibold text-ink-500">Score: {lastFeedback.score}/100</span>
                      </div>
                      <p className="text-sm text-ink-500">{lastFeedback.feedback}</p>
                      {hasAnswered && currentQuestion.index < currentQuestion.total && (
                        <button onClick={handleNext} className="btn-primary mt-4 w-full">
                          Next question
                        </button>
                      )}
                      {hasAnswered && currentQuestion.index >= currentQuestion.total && (
                        <button onClick={handleEnd} className="btn-primary mt-4 w-full" disabled={isFinishing}>
                          {isFinishing ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating your report...</> : 'See my report'}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
