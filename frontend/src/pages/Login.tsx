import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        
        if (response.data.user.is_first_login) {
          navigate('/change-password');
        } else {
          // Redirect based on role
          switch (response.data.user.role) {
            case 'ADMIN': return navigate('/admin');
            case 'TEACHER': return navigate('/teacher');
            case 'STUDENT': return navigate('/student');
            default: return navigate('/');
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--primary-color)' }}>
      <Card title="LOGIN TO SMS" className="w-full" style={{ maxWidth: '400px', backgroundColor: '#FFF' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && <div style={{ backgroundColor: 'var(--secondary-color)', padding: '12px', fontWeight: 800 }} className="brutal-border">{error}</div>}
          <Input 
            label="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your username"
            required
          />
          <Input 
            label="Password" 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password (default: YYYY-MM-DD)"
            required
          />
          <Button type="submit" fullWidth variant="accent">Submit</Button>
        </form>
      </Card>
    </div>
  );
};
