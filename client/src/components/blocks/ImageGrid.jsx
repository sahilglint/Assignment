import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('imageGrid');
    if (stored) setImages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('imageGrid', JSON.stringify(images));
    localStorage.setItem('layoutConfig', JSON.stringify({ blocks: images }));
  }, [images]);

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const uploadedUrl = await uploadToContentful(file);
        const newImages = [...images, { src: uploadedUrl, caption }];
        setImages(newImages);
        setCaption('');
        toast.success('Image added successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToContentful = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file)); 
      }, 1000);
    });
  };

  const deleteImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
  };

  const openEditModal = (idx) => {
    setEditIdx(idx);
    setEditValue(images[idx].caption);
  };

  const handleEditSave = () => {
    const updated = [...images];
    updated[editIdx].caption = editValue;
    setImages(updated);
    setEditIdx(null);
    setEditValue('');
    toast.success('Content updated successfully!');
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter image caption..."
          className="border border-gray-300 shadow-sm px-4 py-2 rounded-lg w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleImageClick}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Upload Image
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map(({ src, caption }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative group overflow-hidden rounded-xl shadow-lg bg-white"
          >
            <img
              src={src || `https://placehold.co/200x150?text=${idx + 1}`}
              alt="grid"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => openEditModal(idx)}
                className="bg-white text-black px-3 py-1 text-xs rounded hover:bg-gray-200 shadow"
              >
                Edit
              </button>
              <button
                onClick={() => deleteImage(idx)}
                className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 shadow"
              >
                Delete
              </button>
            </div>
            {caption && (
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-sm px-2 py-1 truncate">
                {caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {editIdx !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Caption</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditIdx(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
