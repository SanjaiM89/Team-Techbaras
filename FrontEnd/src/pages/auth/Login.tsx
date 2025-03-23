import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-dark flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-dark-light rounded-xl p-8 shadow-xl"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-dark-lighter p-4 rounded-full">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-8">Sign in to continue your fitness journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <LogIn className="mr-2" size={20} />
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-semibold">
              Sign up!
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;