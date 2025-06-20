import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeroBlock = () => {
  const [currentImage, setCurrentImage] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [isFading, setIsFading] = useState(false);

  const [content, setContent] = useState({
    heading: '',
    subtitle: '',
    cta: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ heading: '', subtitle: '', cta: '' });

  const getRandomImage = () =>
    `https://picsum.photos/1200/500?random=${Math.floor(Math.random() * 10000)}`;

  useEffect(() => {
    const preloadImage = () => {
      const img = new Image();
      const newUrl = getRandomImage();
      img.src = newUrl;

      img.onload = () => {
        setNextImage(newUrl);
        setIsFading(true);
        setTimeout(() => {
          setCurrentImage(newUrl);
          setIsFading(false);
        }, 1000);
      };
    };

    preloadImage();
    const interval = setInterval(preloadImage, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('heroBlockData');
    if (saved) {
      setContent(JSON.parse(saved));
    } else {
      setContent({
        heading: 'Inspire Your Journey',
        subtitle: 'We help brands grow through beautiful, fast experiences.',
        cta: 'Get Started',
      });
    }
  }, []);

  const openEdit = () => {
    setFormData(content);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setContent(formData);
    localStorage.setItem('heroBlockData', JSON.stringify(formData));
    setIsModalOpen(false);
    toast.success('Hero Block updated!');
  };

  return (
    <div className="relative rounded-xl overflow-hidden text-white min-h-[300px] w-full">
      {currentImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentImage})`, opacity: isFading ? 0 : 1 }}
        />
      )}
      {nextImage && isFading && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${nextImage})`, opacity: 1 }}
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      <button
        onClick={openEdit}
        className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
        title="Edit Hero"
      >
        <FiEdit size={20} />
      </button>

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-10 py-12 md:py-20 mx-auto flex flex-col justify-center items-start text-center md:text-left">
        <AnimatePresence mode="wait">
          <motion.h2
            key={content.heading}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          >
            {content.heading}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={content.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 max-w-2xl"
          >
            {content.subtitle}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.button
            key={content.cta}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl shadow-md text-sm sm:text-base text-white font-medium"
          >
            {content.cta}
          </motion.button>
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-black relative">
            <h3 className="text-xl font-semibold mb-4">Edit Hero Content</h3>
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Heading"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            />
            <input
              className="w-full mb-3 border p-2 rounded"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <input
              className="w-full mb-4 border p-2 rounded"
              placeholder="CTA Text"
              value={formData.cta}
              onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default HeroBlock;
