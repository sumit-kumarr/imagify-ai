import { useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/useAuth';
import { useReviews, type Review } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type ReviewFormProps = {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  initialRating?: number;
  initialComment?: string;
  buttonText: string;
};

const ReviewForm = ({ onSubmit, initialRating = 0, initialComment = '', buttonText }: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setComment('');
      setRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                value <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <Button type="submit" disabled={isSubmitting || !rating}>
        {isSubmitting ? <LoadingSpinner /> : buttonText}
      </Button>
    </form>
  );
};

type ReviewCardProps = {
  review: Review;
  onEdit?: (rating: number, comment: string) => Promise<void>;
  onDelete?: () => Promise<void>;
};

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  const { user } = useUser();
  const isAuthor = user?.id === review.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (rating: number, comment: string) => {
    try {
      await onEdit?.(rating, comment);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete?.();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {review.user.full_name || review.user.email}
          </span>
          {isAuthor && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Review</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your review? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDeleting(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <LoadingSpinner /> : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`w-4 h-4 ${
                  value <= review.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </CardFooter>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            onSubmit={handleEdit}
            initialRating={review.rating}
            initialComment={review.comment}
            buttonText="Update Review"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export const Reviews = ({ imageId }: { imageId: string }) => {
  const { reviews, isLoading, error, addReview, updateReview, deleteReview } = useReviews(imageId);
  const { user } = useUser();
  const [isAddingReview, setIsAddingReview] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-destructive">{error}</p>;

  const userReview = user ? reviews.find(r => r.user_id === user.id) : null;

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      await addReview(rating, comment);
      setIsAddingReview(false);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleUpdateReview = async (rating: number, comment: string) => {
    if (!userReview) return;
    try {
      await updateReview(userReview.id, rating, comment);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    try {
      await deleteReview(userReview.id);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {user && !userReview && (
          <Button onClick={() => setIsAddingReview(true)}>Add Review</Button>
        )}
      </div>

      <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <ReviewForm onSubmit={handleAddReview} buttonText="Post Review" />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={review.user_id === user?.id ? handleUpdateReview : undefined}
            onDelete={review.user_id === user?.id ? handleDeleteReview : undefined}
          />
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};
