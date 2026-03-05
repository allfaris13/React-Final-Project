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
                    className={`text-2xl transition-all ${isInteractive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
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
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Reviews</h2>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 w-fit">
                            <div className="flex gap-1">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-2xl font-black text-red-600">{averageRating}</span>
                            <span className="text-sm font-bold opacity-40 uppercase tracking-widest">{reviews.length} total</span>
                        </div>
                    )}
                </div>

                {!showForm && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl flex items-center gap-2 w-fit"
                    >
                        <FaPlus /> Write a Review
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit}
                        className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black italic">{editingId ? "Edit Review" : "New Review"}</h3>
                            <button onClick={() => setShowForm(false)} className="opacity-40 hover:opacity-100 transition-opacity"><FaTimes /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Your Name</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none font-bold"
                                />

                                <label className="block text-xs font-black uppercase tracking-widest opacity-40 pt-4">Your Rating</label>
                                <div className="flex gap-2 p-2 bg-black/20 rounded-2xl w-fit">{renderStars(userRating, true)}</div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest opacity-40">Your Thoughts</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Be honest, we don't mind..."
                                    rows="5"
                                    className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none font-bold resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-2">
                                <FaCheck /> {editingId ? "Update" : "Publish"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 px-10 py-4 rounded-2xl font-black transition-all">
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                        <p className="text-lg font-black italic">No reviews yet. Be the trendsetter.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <motion.div
                            layout
                            key={review.id}
                            className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-300 relative"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-600/10">
                                        <FaUserCircle className="text-2xl text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg leading-tight">{review.userName}</h4>
                                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <span className="font-black text-sm">{review.rating}</span>
                                </div>
                            </div>

                            <p className="opacity-70 font-medium leading-relaxed italic">
                                "{review.text}"
                            </p>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                <button onClick={() => handleEdit(review)} className="p-2 bg-blue-600 rounded-lg text-[10px]"><FaEdit /></button>
                                <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-600 rounded-lg text-[10px]"><FaTrash /></button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RatingReview;