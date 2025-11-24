
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import ChapterReader from './pages/ChapterReader';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course/:courseId/module/:moduleId/chapter/:chapterId" element={<ChapterReader />} />
      </Routes>
    </Router>
  );
}

export default App;
