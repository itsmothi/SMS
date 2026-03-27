import React, { useState } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ModalProps {
  onClose: () => void;
  token: string;
  onSuccess: () => void;
}

export const CreateUserModal: React.FC<ModalProps> = ({ onClose, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    role_name: 'STUDENT',
    full_name: '',
    email: '',
    branch: '',
    year: '',
    department: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <Card title="Create New User" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFF' }}>
        {error && <div className="brutal-border mb-4" style={{ backgroundColor: 'var(--secondary-color)', padding: '12px' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input label="Username" value={formData.username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, username: e.target.value})} required />
          <Input label="DOB (YYYY-MM-DD)" type="date" value={formData.dob} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, dob: e.target.value})} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 800 }}>ROLE</label>
            <select 
              className="brutal-border brutal-shadow" 
              style={{ padding: '12px', backgroundColor: '#FFF' }}
              value={formData.role_name}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, role_name: e.target.value})}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
            </select>
          </div>
          <Input label="Full Name" value={formData.full_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, full_name: e.target.value})} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})} required />
          
          {formData.role_name === 'STUDENT' ? (
            <>
              <Input label="Branch" value={formData.branch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, branch: e.target.value})} />
              <Input label="Year" type="number" value={formData.year} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, year: e.target.value})} />
            </>
          ) : (
            <Input label="Department" value={formData.department} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, department: e.target.value})} />
          )}

          <div className="flex gap-4 mt-4">
            <Button type="submit" variant="accent" fullWidth>Create</Button>
            <Button type="button" variant="danger" fullWidth onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const AssignCourseModal: React.FC<ModalProps> = ({ onClose, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    teacher_id: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/assign-course', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign course');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <Card title="Assign Course to Teacher" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#FFF' }}>
        {error && <div className="brutal-border mb-4" style={{ backgroundColor: 'var(--secondary-color)', padding: '12px' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input label="Course Code" value={formData.course_code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, course_code: e.target.value})} placeholder="e.g. CS101" required />
          <Input label="Course Name" value={formData.course_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, course_name: e.target.value})} placeholder="e.g. Data Structures" required />
          <Input label="Teacher ID" type="number" value={formData.teacher_id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, teacher_id: e.target.value})} required />
          
          <div className="flex gap-4 mt-4">
            <Button type="submit" variant="accent" fullWidth>Assign</Button>
            <Button type="button" variant="danger" fullWidth onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
