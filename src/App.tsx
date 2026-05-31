import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Learn from '@/pages/Learn';
import Dashboard from '@/pages/Dashboard';
import Community from '@/pages/Community';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn/:moduleId" element={<Learn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
