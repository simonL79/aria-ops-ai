
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to HomePage component
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
