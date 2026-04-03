import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Series from './pages/Series';
import Admin from './pages/Admin';
import Media from './pages/Media';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="series/:seriesId" element={<Series />} />
          <Route path="admin" element={<Admin />} />
          <Route path="media" element={<Media />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
