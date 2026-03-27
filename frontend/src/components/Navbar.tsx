import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav 
      className="brutal-border brutal-shadow flex justify-between items-center" 
      style={{ padding: '16px 32px', backgroundColor: 'var(--secondary-color)', marginBottom: '32px' }}
    >
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>SMS SYSTEM</h1>
      <div className="flex items-center gap-4">
        <span style={{ fontWeight: 800 }}>Role: {user.role}</span>
        <Button variant="danger" onClick={handleLogout}>Log Out</Button>
      </div>
    </nav>
  );
};
