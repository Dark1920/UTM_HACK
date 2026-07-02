'use client';

import { useState, useCallback } from 'react';
import type { Commentaire } from '@/types/commentaire';
import { commentaireService } from '@/services/commentaire.service';

export function useComments() {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = useCallback(async (commerceId: string) => {
    setIsLoading(true);
    try {
      const data = await commentaireService.getByCommerceId(commerceId);
      setCommentaires(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addComment = useCallback(
    async (data: {
      texte: string;
      note: number;
      auteurId: string;
      commerceId: string;
    }): Promise<Commentaire> => {
      const newComment = await commentaireService.create(data);
      setCommentaires((prev) => [newComment, ...prev]);
      return newComment;
    },
    []
  );

  const deleteComment = useCallback(async (id: string) => {
    try {
      await commentaireService.delete(id);
      setCommentaires((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }, []);

  return { commentaires, isLoading, loadComments, addComment, deleteComment };
}
