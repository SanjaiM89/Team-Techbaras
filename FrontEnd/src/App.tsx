import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserDetails from './pages/onboarding/UserDetails';
import FitnessProfile from './pages/onboarding/FitnessProfile';
import BodyMetrics from './pages/onboarding/BodyMetrics';
import Experience from './pages/onboarding/Experience';
import Assistance from './pages/onboarding/Assistance';
import Schedule from './pages/onboarding/Schedule';
import Notifications from './pages/onboarding/Notifications';
import Goals from './pages/onboarding/Goals';
import Photo from './pages/onboarding/Photo';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import StrengthWorkout from './pages/workout/Strength';
import CardioWorkout from './pages/workout/Cardio';
import RecoveryWorkout from './pages/workout/Recovery';
import PhysiotherapyWorkout from './pages/workout/Physiotherapy';
import PostureCorrection from './pages/workout/PostureCorrection';
import MealPrep from './pages/MealPrep';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signup" replace />; // Redirect to signup if no token
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Onboarding Routes */}
            <Route
              path="/onboarding"
              element={<Navigate to="/onboarding/user-details" replace />}
            />
            <Route
              path="/onboarding/user-details"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/fitness-profile"
              element={
                <ProtectedRoute>
                  <FitnessProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/body-metrics"
              element={
                <ProtectedRoute>
                  <BodyMetrics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/experience"
              element={
                <ProtectedRoute>
                  <Experience />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/assistance"
              element={
                <ProtectedRoute>
                  <Assistance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/photo"
              element={
                <ProtectedRoute>
                  <Photo />
                </ProtectedRoute>
              }
            />

            {/* Protected Dashboard and Workout Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <Navigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <Navigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout"
              element={
                <ProtectedRoute>
                  <Workout />
                  <Navigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/strength"
              element={
                <ProtectedRoute>
                  <StrengthWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/cardio"
              element={
                <ProtectedRoute>
                  <CardioWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/recovery"
              element={
                <ProtectedRoute>
                  <RecoveryWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/physiotherapy"
              element={
                <ProtectedRoute>
                  <PhysiotherapyWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/posture-correction"
              element={
                <ProtectedRoute>
                  <PostureCorrection />
                </ProtectedRoute>
              }
            />

            {/* Protected Meals and Settings Routes */}
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <MealPrep />
                  <Navigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                  <Navigation />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;