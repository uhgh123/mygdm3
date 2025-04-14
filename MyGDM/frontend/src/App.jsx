import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import GdmLogPage from './pages/GdmLogPage';
import ReadDataPage from './pages/ReadDataPage';
import ExportDataPage from './pages/ExportDataPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import RemindersPage from './pages/RemindersPage';
import ForumHome from './pages/ForumHome';
import ForumCategoryPage from './pages/ForumCategoryPage';
import NewForumPost from './pages/NewForumPost';
import ForumPostPage from './pages/ForumPostPage';
import FaqPage from './pages/FaqPage';
import useReminderNotifications from './hooks/useReminderNotifications';
import { Toaster } from 'react-hot-toast';
import './styles/utilities.css';
import RecipesPage from './pages/RecipesPage';
import RecipeDetail from './pages/RecipeDetail';
import AboutGDM from './pages/AboutGDM';
import InformationPage from './pages/InformationPage';
import SettingsPage from './pages/SettingsPage'; // 👈 at the top


function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <GdmLogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          }
        />
        {/* New Recipe Detail Route */}
        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/read"
          element={
            <ProtectedRoute>
              <ReadDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/export"
          element={
            <ProtectedRoute>
              <ExportDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <RemindersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FaqPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutGDM />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about/faq"
          element={
            <ProtectedRoute>
              <FaqPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about/information"
          element={
            <ProtectedRoute>
              <InformationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <ForumHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/category/:id"
          element={
            <ProtectedRoute>
              <ForumCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/new/:id"
          element={
            <ProtectedRoute>
              <NewForumPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/post/:id"
          element={
            <ProtectedRoute>
              <ForumPostPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;