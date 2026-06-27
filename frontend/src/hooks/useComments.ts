'use client';

import { useState, useCallback } from 'react';
import type { Commentaire } from '@/types/commentaire';
import { mockCommentaires } from '@/lib/mock-data';

export function useComments() {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);

  const loadComments = useCallback((commerceId: string) => {
    const filtered = mockCommentaires.filter((c) => c.commerceId === commerceId);
    setCommentaires(filtered);
  }, []);

  const addComment = useCallback(
    async (data: {
      texte: string;
      note: number;
      auteurId: string;
      commerceId: string;
    }): Promise<Commentaire> => {
      const newComment: Commentaire = {
        id: `com-${Date.now()}`,
        texte: data.texte,
        note: data.note,
        auteurId: data.auteurId,
        commerceId: data.commerceId,
        iaScore: 0,
        estSpam: false,
        estModer: true,
        dateCreation: new Date().toISOString(),
      };
      setCommentaires((prev) => [newComment, ...prev]);
      return newComment;
    },
    []
  );

  const deleteComment = useCallback(async (id: string) => {
    setCommentaires((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { commentaires, loadComments, addComment, deleteComment };
}
