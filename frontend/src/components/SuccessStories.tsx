import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Story {
  customerName: string;
  location: string;
  photo: string; // Cloudinary URL
  description: string;
}

const StoryCard = ({ story }: { story: Story }) => (
  <motion.div
    key={story.customerName}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center max-w-2xl mx-auto relative"
  >
    <div className="flex flex-col items-center md:items-start md:w-1/3">
      {story.photo && (
        <img
          src={story.photo}
          alt={story.customerName + " with car"}
          className="w-40 h-32 object-cover rounded-lg shadow border-4 border-blue-100"
        />
      )}
      <div className="mt-2 text-center md:text-left">
        <div className="font-semibold text-lg text-gray-800">
          {story.customerName}
        </div>
        <div className="text-xs text-gray-500">{story.location}</div>
      </div>
    </div>
    <div className="flex-1 flex flex-col items-center md:items-start">
      <div className="italic text-gray-700 text-base mb-2">
        “{story.description}”
      </div>
    </div>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow"
      style={{ position: "absolute", top: 16, right: 16 }}
    >
      SOLD
    </motion.div>
  </motion.div>
);

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://auto-wheel-api.onrender.com";
const API_SUCCESS_STORIES_URL = `${API_BASE_URL}/api/successstories`;

export default function SuccessStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch(API_SUCCESS_STORIES_URL)
      .then((res) => {
        console.log("SuccessStories API raw response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("API /api/successstories response:", data);
        setStories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching success stories:", err);
        setStories([]);
      });
  }, []);

  if (stories.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 mb-6 px-2 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-0">
          Customer Success Stories
        </h2>
        <p className="text-gray-500 mt-8">No stories have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-0">
          Customer Success Stories
        </h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center min-h-[340px]">
          <AnimatePresence mode="wait">
            <StoryCard story={stories[active]} />
          </AnimatePresence>
        </div>
        <div className="flex gap-2 mt-4">
          {stories.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition ${
                active === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setActive(idx)}
              aria-label={`Go to story ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
