import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const Toolbar = () => {
  const dispatch = useDispatch();
  const { past, future } = useSelector(state => state.layout);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/landing/page-1', label: 'Landing-Page 1' },
    { href: '/landing/page-2', label: 'Landing-Page 2' },
  ];

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between relative px-6 z-40">
      <div className="text-xl font-bold">
        <Link to="/">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative group text-white font-semibold"
          >
            {link.label}
            <span className="absolute left-0 bottom-[-1px] w-0 h-0.5 bg-green-400 transition-all duration-300 delay-100 group-hover:w-full"></span>

          </a>
        ))}
      </nav>

      <div className="hidden md:flex">
        <button
          onClick={() => dispatch(ActionCreators.undo())}
          disabled={past.length === 0}
          className="bg-white text-black px-3 py-1 rounded mr-2 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={() => dispatch(ActionCreators.redo())}
          disabled={future.length === 0}
          className="bg-white text-black px-3 py-1 rounded disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      <div className="md:hidden flex flex-row-reverse items-center gap-2 z-50">
        <button
          className="text-white text-2xl"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => dispatch(ActionCreators.undo())}
            disabled={past.length === 0}
            className="bg-white text-black px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={() => dispatch(ActionCreators.redo())}
            disabled={future.length === 0}
            className="bg-white text-black px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            Redo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 right-0 w-3/4 max-w-xs h-full bg-gray-800 text-white p-6 flex flex-col gap-6 z-40"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-lg border-b border-white pb-2 hover:text-gray-300 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Toolbar;
