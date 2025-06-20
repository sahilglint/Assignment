import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TwoColumnRow = () => {
  const defaultContent = {
    heading: 'Default Heading',
    subtitle: 'This is a sample subtitle for two-column layout.',
    cta: 'Click Me',
  };

  const [content, setContent] = useState(defaultContent);
  const [formData, setFormData] = useState(defaultContent);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imageSrc, setImageSrc] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('twoColumnRowData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContent(parsed);
      setFormData(parsed);
    } else {
      setContent(defaultContent);
      setFormData(defaultContent);
    }

    const firstImage = getRandomImage();
    setImageSrc(firstImage);
    setNextImage(firstImage);

    const preloadImage = () => {
      const next = getRandomImage();
      const img = new Image();
      img.src = next;
      img.onload = () => {
        setNextImage(next);
        setIsFading(true);
        setTimeout(() => {
          setImageSrc(next);
          setIsFading(false);
        }, 1000);
      };
    };

    const interval = setInterval(preloadImage, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRandomImage = () =>
    `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 10000)}`;

  const openEdit = () => {
    setFormData(content);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setContent(formData);
    localStorage.setItem('twoColumnRowData', JSON.stringify(formData));
    toast.success('Two Column Row updated!');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-lg overflow-hidden my-8 relative">
      <button
        onClick={openEdit}
        className="absolute top-2 right-4 z-20 bg-white/20 hover:bg-black/30 p-2 rounded-full transition"
        title="Edit Two Column Row"
      >
        <FiEdit size={20} />
      </button>

      <div className="flex flex-col-reverse md:flex-row items-center gap-8 py-10 px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={content.heading + content.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                {content.heading}
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">
                {content.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl shadow-md text-white font-medium"
          >
            {content.cta}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 relative min-h-[250px] h-auto aspect-video md:aspect-auto"
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Current"
              className={`w-full h-full object-cover rounded-xl absolute inset-0 transition-opacity duration-1000 ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
          {nextImage && isFading && (
            <img
              src={nextImage}
              alt="Next"
              className="w-full h-full object-cover rounded-xl absolute inset-0 opacity-100 transition-opacity duration-1000"
            />
          )}
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-black relative">
            <h3 className="text-xl font-semibold mb-4">Edit Two Column Content</h3>
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

export default TwoColumnRow;
