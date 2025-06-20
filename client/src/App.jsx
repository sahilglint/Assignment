import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import LayoutCanvas from './components/LayoutCanvas';
import Landingpage1 from './components/Landingpage1';
import Landingpage2 from './components/Landingpage2';

const App = () => (
  <Router>
    <div className="h-screen w-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/landing/page-1" element={<Landingpage1 />} />
            <Route path="/landing/page-2" element={<Landingpage2 />} />
            <Route path="/" element={<LayoutCanvas />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
