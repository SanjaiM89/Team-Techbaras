import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PostureCorrection from './pages/workout/PostureCorrection'; // ✅ Import added
import MealPrep from './pages/MealPrep';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding/user-details" element={<UserDetails />} />
            <Route path="/onboarding/fitness-profile" element={<FitnessProfile />} />
            <Route path="/onboarding/body-metrics" element={<BodyMetrics />} />
            <Route path="/onboarding/experience" element={<Experience />} />
            <Route path="/onboarding/assistance" element={<Assistance />} />
            <Route path="/onboarding/schedule" element={<Schedule />} />
            <Route path="/onboarding/notifications" element={<Notifications />} />
            <Route path="/onboarding/goals" element={<Goals />} />
            <Route path="/onboarding/photo" element={<Photo />} />
            
            {/* Dashboard with Navigation */}
            <Route path="/" element={
              <>
                <Dashboard />
                <Navigation />
              </>
            } />

            {/* Workout Section */}
            <Route path="/workout" element={
              <>
                <Workout />
                <Navigation />
              </>
            } />
            <Route path="/workout/strength" element={<StrengthWorkout />} />
            <Route path="/workout/cardio" element={<CardioWorkout />} />
            <Route path="/workout/recovery" element={<RecoveryWorkout />} />
            <Route path="/workout/physiotherapy" element={<PhysiotherapyWorkout />} />
            <Route path="/workout/posture-correction" element={<PostureCorrection />} /> {/* ✅ Added */}

            {/* Meals Section */}
            <Route path="/meals" element={
              <>
                <MealPrep />
                <Navigation />
              </>
            } />

            {/* Settings Section */}
            <Route path="/settings" element={
              <>
                <Settings />
                <Navigation />
              </>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
