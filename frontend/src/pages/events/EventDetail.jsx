import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventDetail, deleteEvent, likeEvent, deleteEventImage } from '../../api/events';
import { getEventReviews, createEventReview } from '../../api/reviews';
import { useAuth } from '../../context/AuthContext';
import ImageGallery from '../../components/events/ImageGallery';
import UploadImagesForm from '../../components/events/UploadImagesForm';
import ChatRoom from '../../components/chat/ChatRoom';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ShareIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  UserIcon,
  TicketIcon,
  HeartIcon as HeartIconOutline,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const CATEGORY_COLORS = {
  marriage: 'from-pink-500 to-rose-500 text-pink-700 bg-pink-50 dark:bg-pink-950/30 dark:text-pink-300',
  haldi: 'from-yellow-400 to-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-300',
  mehndi: 'from-emerald-500 to-teal-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300',
  birthday: 'from-purple-500 to-indigo-500 text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-300',
  webinar: 'from-blue-500 to-sky-500 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300',
  club_party: 'from-violet-600 to-fuchsia-600 text-violet-700 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-300',
  dj_night: 'from-cyan-500 to-blue-600 text-cyan-700 bg-cyan-50 dark:bg-cyan-950/30 dark:text-cyan-300',
  college_fest: 'from-orange-500 to-red-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-300',
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Reviews and ratings state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchEvent = async () => {
      try {
        const { data } = await getEventDetail(id);
        if (active) {
          setEvent(data);
        }
      } catch (err) {
        console.error('Fetch event error:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchEvent();
    return () => {
      active = false;
    };
  }, [id, refreshTrigger]);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      try {
        const { data } = await getEventReviews(id);
        if (active) {
          setReviews(data.results || data);
        }
      } catch (err) {
        console.error('Fetch reviews error:', err);
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };
    fetchReviews();
    return () => {
      active = false;
    };
  }, [id]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);
    try {
      const { data } = await createEventReview(id, {
        rating: ratingInput,
        comment: commentInput,
      });
      setReviews((prev) => [data, ...prev]);
      setCommentInput('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      if (err.response?.data?.detail) {
        setReviewError(err.response.data.detail);
      } else if (err.response?.data?.non_field_errors) {
        setReviewError(err.response.data.non_field_errors.join(' '));
      } else if (err.response?.data) {
        // Format DRF dictionary errors
        const messages = Object.values(err.response.data).flat().join(' ');
        setReviewError(messages);
      } else {
        setReviewError('Failed to submit review.');
      }
    }
  };

  const renderStars = (num) => {
    return (
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg leading-none">
            {i < num ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await likeEvent(id);
      setEvent((prev) => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action is permanent.')) return;
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteEventImage(id, imageId);
      setEvent((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const shareEvent = async () => {
    const url = `${window.location.origin}/events/${event.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text: event.description, url });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you are looking for may have been removed or does not exist.</p>
          <Link to="/events" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-full transition-all">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && event?.is_owner;
  const categoryColor = CATEGORY_COLORS[event.category] || 'from-indigo-500 to-purple-500 text-indigo-700 bg-indigo-50';
  const displayPrice = event.price && parseFloat(event.price) > 0 ? `₹${event.price}` : 'Free';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
          >
            &larr; Back to all events
          </Link>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2.5 rounded-full border transition-all ${
                event.is_liked
                  ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900'
                  : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500 dark:bg-slate-900 dark:border-slate-800'
              }`}
            >
              {event.is_liked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIconOutline className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={shareEvent}
              className="p-2.5 rounded-full border bg-white border-gray-200 text-gray-500 hover:text-indigo-600 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-400 dark:hover:text-indigo-400 transition-all"
            >
              {copySuccess ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ShareIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info Columns (Left - 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Content */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
              <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${categoryColor.split(' ').slice(0, 2).join(' ')} text-white shadow-sm mb-4`}>
                {event.category.replace('_', ' ')}
              </span>
              <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm mb-4 ml-2 ${
                event.is_private
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/30'
              }`}>
                {event.is_private ? '🔒 Private' : '🌐 Public'}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">
                {event.title}
              </h1>

              {averageRating && (
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(Math.round(parseFloat(averageRating)))}
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-sm">
                    {averageRating} ★ ({reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Quick Details Row */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2 border-t dark:border-slate-800 pt-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Hosted by <strong className="text-gray-700 dark:text-gray-200">{event.organizer.username}</strong></span>
                </div>
                <div className="flex items-center">
                  <HeartIconSolid className="h-5 w-5 text-rose-500 mr-2 animate-pulse" />
                  <span>{event.likes_count} favorites</span>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 text-indigo-500 mr-2" />
                Event Gallery
              </h3>
              <ImageGallery images={event.images} />
            </div>

            {/* Event Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-slate-800 pb-3">
                About the Event
              </h2>
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-all space-y-6">
              <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">⭐</span> Reviews & Ratings
                </h2>
                {averageRating && (
                  <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                    <span className="text-amber-500 font-bold">★</span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400">{averageRating} / 5.0</span>
                  </div>
                )}
              </div>

              {/* Submit a review card */}
              {user && !isOwner && !reviews.some((r) => r.user === user.username) && (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-105 dark:border-slate-850 space-y-4">
                  <h3 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">Visited this event? Share your experience!</h3>
                  {reviewError && <div className="text-xs text-red-500 font-semibold">{reviewError}</div>}
                  {reviewSuccess && <div className="text-xs text-green-500 font-semibold">Review posted successfully!</div>}
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Your Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="text-2xl text-amber-400 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                        >
                          {star <= ratingInput ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your review here... How was the dj dance, ceremony setup, or club vibe?"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-850 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-400 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews list */}
              {reviewsLoading ? (
                <div className="text-center text-xs text-gray-400">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-850/80 transition-all space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-xs text-gray-800 dark:text-gray-200 block">{rev.user}</span>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        {renderStars(rev.rating)}
                      </div>
                      <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                  <span className="text-3xl block mb-2">⭐</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Live Chat Board */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center px-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2.5"></span>
                Discussion Board
              </h2>
              {user ? (
                <ChatRoom roomId={event.chat_room_id} organizerUsername={event.organizer.username} />
              ) : (
                <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-slate-900 dark:to-slate-900/60 p-8 rounded-3xl text-center border border-indigo-100/50 dark:border-slate-800 shadow-xl transition-all">
                  <span className="inline-block text-4xl mb-3">💬</span>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Join the Live Chat</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                    Sign in to chat with the host, ask questions, and connect with other attendees in real-time!
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Log In to Join &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Manage Images section for event owner */}
            {isOwner && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-slate-800 pb-3 flex items-center">
                  <PencilSquareIcon className="h-5 w-5 text-amber-500 mr-2" />
                  Manage Organizer Assets
                </h2>
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">Upload multiple photos to populate the event page gallery.</p>
                  <UploadImagesForm eventId={id} onImagesUploaded={() => setRefreshTrigger((prev) => prev + 1)} />
                  {event.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {event.images.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 aspect-video">
                          <img src={img.image} alt="" className="h-full w-full object-cover" />
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <TrashIcon className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Scheduling Sidebar (Right - 1/3 width) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Main Sticky Action Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 space-y-6 transition-all duration-300">
              
              <div className="border-b dark:border-slate-800 pb-4">
                <p className="text-xs text-gray-400 uppercase font-black tracking-wider">Ticket Info</p>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Available</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">online</span>
                </div>
              </div>

              {/* Specifications List */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 mr-3">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</h4>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 mr-3">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time</h4>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 mr-3">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</h4>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{event.location}</p>
                    {event.address && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{event.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Call To Action Buttons */}
              <div className="pt-4 border-t dark:border-slate-800 space-y-3">
                {isOwner ? (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 p-3 rounded-2xl text-xs font-semibold text-center border border-amber-100 dark:border-amber-900/30">
                      👑 You are the host of this event
                    </div>
                    


                    <Link
                      to={`/events/${id}/edit`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all transform active:scale-98"
                    >
                      <PencilSquareIcon className="h-5 w-5 mr-2" />
                      Edit Details
                    </Link>

                    <button
                      onClick={handleDelete}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full font-bold transition-all transform active:scale-98"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Delete Event
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={user ? `/events/${id}/book` : '/login'}
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-extrabold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 duration-300"
                    >
                      <TicketIcon className="h-5 w-5 mr-2 animate-bounce" />
                        {user ? `Book Tickets Now — ${displayPrice}` : 'Login to Book Tickets'}
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Social Sharing Proof Box */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <h3 className="font-extrabold text-lg tracking-tight">Spread the word!</h3>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Invite your friends and share this event on WhatsApp, Telegram, or social media networks!
              </p>
              <button
                onClick={shareEvent}
                className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-full font-bold text-sm transition-all transform active:scale-98 shadow-md"
              >
                {copySuccess ? (
                  <>
                    <CheckIcon className="h-4.5 w-4.5 mr-1.5 text-green-600" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <ShareIcon className="h-4.5 w-4.5 mr-1.5" />
                    Share Event Link
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;