import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBlock } from '../redux/layoutSlice';
import { v4 as uuid } from 'uuid';
import { FaChevronLeft, FaChevronRight, FaImage, FaThLarge, FaColumns } from 'react-icons/fa';

const COMPONENTS = [
  { type: 'hero', label: 'Hero Block', icon: <FaImage className="text-xl" /> },
  { type: 'twoColumn', label: 'Two Column Row', icon: <FaColumns className="text-xl" /> },
  { type: 'imageGrid', label: '2×2 Image Grid', icon: <FaThLarge className="text-xl" /> }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAdd = (type) => {
    let data;
    if (type === 'hero')
      data = {
        heading: 'Heading',
        subtitle: 'Subtitle',
        cta: 'Click Me',
        backgroundImage: ''
      };
    if (type === 'twoColumn')
      data = {
        left: {
          heading: 'Left Heading',
          subtitle: 'Left Sub',
          cta: 'Click Me'
        },
        right: { image: '' }
      };
    if (type === 'imageGrid') data = { images: ['', '', '', ''] };

    dispatch(addBlock({ id: uuid(), type, data }));
  };

  return (
    <div
      className={`transition-all duration-300 fixed md:static z-30 ${
        collapsed || isSmallScreen ? 'w-16' : 'w-[65vw] sm:w-[40vw] md:w-1/3'
      } bg-white border-r h-screen overflow-y-auto relative flex-shrink-0`}
    >
      <div className="p-4">
        {!isSmallScreen && (
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} mb-4`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 z-10"
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        )}

        {!collapsed && !isSmallScreen && <h2 className="text-lg font-semibold mb-4">Add Component</h2>}
        <div className="flex flex-col gap-4">
          {COMPONENTS.map((c) => (
            <button
              key={c.type}
              onClick={() => handleAdd(c.type)}
              className={`flex items-center gap-2 p-4 bg-gray-100 rounded hover:bg-gray-200 transition-all duration-300 ${
                collapsed || isSmallScreen ? 'justify-center' : 'justify-start'
              }`}
              title={collapsed || isSmallScreen ? c.label : ''}
            >
              <span className="transition-transform duration-300 transform hover:scale-110">
                {c.icon}
              </span>
              {!collapsed && !isSmallScreen && <span className="truncate">{c.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
