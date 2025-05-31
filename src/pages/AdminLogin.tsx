
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginGateway from '@/components/auth/AdminLoginGateway';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLoginComplete = (success: boolean) => {
    if (success) {
      navigate('/admin');
    }
  };

  return <AdminLoginGateway onComplete={handleLoginComplete} />;
};

export default AdminLogin;
