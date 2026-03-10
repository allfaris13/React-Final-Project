import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaUserCircle, FaEdit, FaTrash, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RatingReview = ({ filmId, seriesId, theme }) => {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviews, setReviews] = useState([]);
    const [userName, setUserName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const activeId = filmId || seriesId;
    const localStorageKey = `reviews_${activeId}`;

    useEffect(() => {
        const savedReviews = localStorage.getItem(localStorageKey);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    }, [activeId, localStorageKey]);

    const saveReviews = (newReviews) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newReviews));
        setReviews(newReviews);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userName.trim()) return alert("Please enter your name!");
        if (userRating === 0) return alert("Please provide a rating!");
        if (!reviewText.trim()) return alert("Please write a review!");

        const newReview = {
            id: editingId || Date.now(),
            userName: userName.trim(),
            rating: userRating,
            text: reviewText.trim(),
            date: new Date().toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
            })
        };

        if (editingId) {
            const updatedReviews = reviews.map(r => r.id === editingId ? newReview : r);
            saveReviews(updatedReviews);
            setEditingId(null);
        } else {
            saveReviews([newReview, ...reviews]);
        }

        setUserRating(0);
        setReviewText("");
        setUserName("");
        setShowForm(false);
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setUserName(review.userName);
        setUserRating(review.rating);
        setReviewText(review.text);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this review?")) {
            const updatedReviews = reviews.filter(r => r.id !== id);
            saveReviews(updatedReviews);
        }
    };

    const renderStars = (rating, isInteractive = false) => {
        const displayRating = isInteractive ? (hoverRating || userRating) : rating;
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <button
                    key={index}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => isInteractive && setUserRating(starValue)}
                    onMouseEnter={() => isInteractive && setHoverRating(starValue)}
                    onMouseLeave={() => isInteractive && setHoverRating(0)}
                    className={`text-xl sm:text-2xl transition-all ${isInteractive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
                >
                    {starValue <= displayRating
                        ? <FaStar className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        : <FaRegStar className="text-gray-600" />
                    }
                </button>
            );
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-4">Reviews</h2>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/10 w-fit">
                            <div className="flex gap-1">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-xl sm:text-2xl font-black text-red-600">{averageRating}</span>
                            <span className="text-[10px] sm:text-sm font-bold opacity-40 uppercase tracking-widest">{reviews.length} total</span>
                        </div>
                    )}
                </div>

                {!showForm && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="bg-red-600 hover:bg-black text-white font-black px-6 py-3 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 w-full md:w-fit text-sm"
                    >
                        <FaPlus className="text-xs" /> Write a Review
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="bg-gray-900/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-3xl space-y-8"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-black text-white italic tracking-tight">{editingId ? "Update Review" : "Share Your Thoughts"}</h3>
                            <button onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"><FaTimes className="text-white/60" /></button>
                        </div>

                        <div className="space-y-6">
                            {/* Top Row: Name and Rating */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-red-500/80">Your Identity</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter your name..."
                                        className="w-full bg-black/40 border border-white/10 px-5 py-3.5 rounded-xl focus:ring-1 focus:ring-red-600 outline-none font-bold text-white placeholder:text-white/10 transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-red-500/80">The Vibe</label>
                                    <div className="flex gap-2.5 px-4 py-3 bg-black/40 rounded-xl w-fit border border-white/5">{renderStars(userRating, true)}</div>
                                </div>
                            </div>

                            {/* Bottom Row: Thoughts */}
                            <div className="space-y-2">
                                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-red-500/80">Your Critique</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell us what you really think..."
                                    rows="4"
                                    className="w-full bg-black/40 border border-white/10 px-5 py-3.5 rounded-xl focus:ring-1 focus:ring-red-600 outline-none font-bold resize-none text-white placeholder:text-white/10 transition-all text-sm min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
                                <FaCheck className="text-xs" /> {editingId ? "Update Now" : "Post Review"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition-all border border-white/10 text-sm sm:text-base">
                                Discard
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {reviews.length === 0 ? (
                    <div className="col-span-full py-16 sm:py-20 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                        <p className="text-base sm:text-lg font-black italic">No reviews yet. Be the first!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <motion.div
                            layout
                            key={review.id}
                            className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-300 relative"
                        >
                            <div className="flex items-start justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-red-600/10">
                                        <FaUserCircle className="text-xl sm:text-2xl text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base sm:text-lg leading-tight">{review.userName}</h4>
                                        <p className="text-[9px] sm:text-[10px] font-bold opacity-40 uppercase tracking-widest">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                                    <FaStar className="text-yellow-400 text-[10px] sm:text-xs" />
                                    <span className="font-black text-xs sm:text-sm">{review.rating}</span>
                                </div>
                            </div>

                            <p className="opacity-70 font-medium text-sm sm:text-base leading-relaxed italic">
                                "{review.text}"
                            </p>

                            <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex gap-2">
                                <button onClick={() => handleEdit(review)} className="p-2 bg-blue-600/50 hover:bg-blue-600 rounded-lg text-[9px]"><FaEdit /></button>
                                <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-600/50 hover:bg-red-600 rounded-lg text-[9px]"><FaTrash /></button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RatingReview;