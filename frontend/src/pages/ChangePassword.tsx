import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, isFirstLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Password updated successfully! Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
      <Card title={isFirstLogin ? "FIRST LOGIN: CHANGE PASSWORD" : "CHANGE PASSWORD"} style={{ maxWidth: '500px', width: '100%' }}>
        {isFirstLogin && <p style={{ fontWeight: 600, color: 'var(--primary-color)' }}>You must change your default password to continue.</p>}
        {error && <div className="brutal-border" style={{ backgroundColor: 'var(--secondary-color)', padding: '12px', fontWeight: 800 }}>{error}</div>}
        {success && <div className="brutal-border" style={{ backgroundColor: 'var(--accent-color)', padding: '12px', fontWeight: 800 }}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <Input 
            label="New Password" 
            type="password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
          />
          <Input 
            label="Confirm New Password" 
            type="password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />
          <Button type="submit" fullWidth variant="primary">Update Password</Button>
        </form>
      </Card>
    </div>
  );
};
