
import React from 'react';
import { Navigate } from 'react-router-dom';

// We'll just redirect to the root path when HomePage is visited
const HomePage = () => {
  return <Navigate to="/" replace />;
};

export default HomePage;
