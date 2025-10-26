import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getSuccessStories() {
  const raw = localStorage.getItem('successStories');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

interface Story {
  customerName: string;
  location: string;
  photo: string;
  description: string;
}

const StoryCard = ({ story, expanded, onReadMore }: { story: Story; expanded: boolean; onReadMore: () => void }) => {
  return (
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
            src={story.photo.startsWith('data:') ? story.photo : story.photo}
            alt={story.customerName + ' with car'}
            className="w-40 h-32 object-cover rounded-lg shadow border-4 border-blue-100"
          />
        )}
        <div className="mt-2 text-center md:text-left">
          <div className="font-semibold text-lg text-gray-800">{story.customerName}</div>
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
};

export default function SuccessStories() {
  const [stories, setStories] = useState<Array<Story>>([]);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const autoplay = true;

  useEffect(() => {
    const updateStories = () => {
      const raw = localStorage.getItem('successStories');
      if (!raw) {
        setStories([]);
        return;
      }
      try {
        setStories(JSON.parse(raw));
      } catch {
        setStories([]);
      }
    };
    updateStories();
    window.addEventListener('storage', updateStories);
    return () => window.removeEventListener('storage', updateStories);
  }, []);

  useEffect(() => {
    if (!autoplay || stories.length === 0) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % stories.length);
      setExpanded(false);
    }, 4000);
    return () => clearInterval(timer);
  }, [stories, autoplay]);

  const goPrev = () => {
    setActive((prev) => (prev - 1 + stories.length) % stories.length);
    setExpanded(false);
  };
  const goNext = () => {
    setActive((prev) => (prev + 1) % stories.length);
    setExpanded(false);
  };

  if (stories.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 mb-6 px-2 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-0">Customer Success Stories</h2>
        <p className="text-gray-500 mt-8">No stories have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 mb-6 px-2">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-0">Customer Success Stories</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center min-h-[340px]">
          <button
            aria-label="Previous story"
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 shadow transition"
            style={{ zIndex: 2 }}
          >
            &#8592;
          </button>
          <div className="w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <StoryCard
                key={active}
                story={stories[active]}
                expanded={expanded}
                onReadMore={() => setExpanded(true)}
              />
            </AnimatePresence>
          </div>
          <button
            aria-label="Next story"
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 shadow transition"
            style={{ zIndex: 2 }}
          >
            &#8594;
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          {stories.map((_: Story, idx: number) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition ${active === idx ? "bg-blue-600" : "bg-gray-300"}`}
              onClick={() => {
                setActive(idx);
                setExpanded(false);
              }}
              aria-label={`Go to story ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
