'use client';

import { useState, useRef, useCallback } from 'react';
import { voiceSearchService } from '@/services/voice-search.service';

interface VoiceSearchState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  result: {
    texte: string;
    intention: 'recherche' | 'commentaire' | 'incomprehensible';
    categorie: string | null;
    quartier: string | null;
    urgence: boolean;
  } | null;
}

export function useVoiceSearch() {
  const [state, setState] = useState<VoiceSearchState>({
    isRecording: false,
    isProcessing: false,
    error: null,
    result: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

        setState((s) => ({ ...s, isRecording: false, isProcessing: true, error: null }));

        try {
          const result = await voiceSearchService.search(file);
          setState((s) => ({ ...s, isProcessing: false, result }));
        } catch (err) {
          setState((s) => ({
            ...s,
            isProcessing: false,
            error: err instanceof Error ? err.message : 'Erreur inconnue',
          }));
        }
      };

      mediaRecorder.start();
      setState((s) => ({ ...s, isRecording: true, error: null, result: null }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Accès micro refusé',
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isRecording: false, isProcessing: false, error: null, result: null });
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    reset,
  };
}
