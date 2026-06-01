import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import VocabularyPage from './pages/VocabularyPage';
import GrammarPage from './pages/GrammarPage';
import SpeakingPage from './pages/SpeakingPage';
import ListeningPage from './pages/ListeningPage';
import ProgressPage from './pages/ProgressPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/"
            element={
              <>
                <Header />
                <HomePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/courses"
            element={
              <>
                <Header />
                <CoursesPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <>
                <Header />
                <CourseDetailPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/study/vocabulary"
            element={
              <>
                <VocabularyPage />
              </>
            }
          />
          <Route
            path="/study/grammar"
            element={
              <>
                <GrammarPage />
              </>
            }
          />
          <Route
            path="/study/speaking"
            element={
              <>
                <SpeakingPage />
              </>
            }
          />
          <Route
            path="/study/listening"
            element={
              <>
                <ListeningPage />
              </>
            }
          />
          <Route
            path="/progress"
            element={
              <>
                <Header />
                <ProgressPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/community"
            element={
              <>
                <Header />
                <CommunityPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <ProfilePage />
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
