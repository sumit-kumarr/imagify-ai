import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useAuth';

export type Review = {
  id: string;
  user_id: string;
  image_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
    full_name?: string;
  };
};

export const useReviews = (imageId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            user:profiles(email, full_name)
          `)
          .eq('image_id', imageId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up realtime subscription
    const subscription = supabase
      .channel(`reviews:${imageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `image_id=eq.${imageId}`
        },
        async (payload) => {
          // Refresh the reviews list when there's a change
          await fetchReviews();
        }
      )
      .subscribe();

    fetchReviews();

    return () => {
      subscription.unsubscribe();
    };
  }, [imageId]);

  const addReview = async (rating: number, comment: string) => {
    if (!user) throw new Error('Must be logged in to review');

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            image_id: imageId,
            user_id: user.id,
            rating,
            comment
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!user) throw new Error('Must be logged in to update review');

    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', reviewId)
        .eq('user_id', user.id) // Ensure user can only update their own review
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) throw new Error('Must be logged in to delete review');

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id); // Ensure user can only delete their own review

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    reviews,
    isLoading,
    error,
    addReview,
    updateReview,
    deleteReview
  };
};
