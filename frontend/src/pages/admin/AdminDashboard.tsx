import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { CreateUserModal, AssignCourseModal } from './AdminModals';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [teachers, setTeachers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const fetchStats = async () => {
    try {
      const authHeader = { Authorization: `Bearer ${token}` };
      const [statsRes, teachersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard-stats', { headers: authHeader }),
        axios.get('http://localhost:5000/api/admin/teachers', { headers: authHeader })
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (teachersRes.data.success) setTeachers(teachersRes.data.teachers);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch admin data', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <Button onClick={fetchStats} variant="secondary">Refresh Data</Button>
      </div>

      {error && (
        <div className="brutal-border mb-6" style={{ backgroundColor: 'var(--secondary-color)', padding: '15px', color: 'black', fontWeight: 800, border: '3px solid black', marginBottom: '20px' }}>
          ⚠️ ERROR: {error}
        </div>
      )}

      <div className="grid gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <Card title="Total Students" bgColor="var(--primary-color)">
          <h2 style={{ fontSize: '3rem', margin: 0 }}>{stats.students}</h2>
        </Card>
        <Card title="Total Teachers" bgColor="var(--secondary-color)">
          <h2 style={{ fontSize: '3rem', margin: 0 }}>{stats.teachers}</h2>
        </Card>
        <Card title="Total Courses" bgColor="var(--accent-color)">
          <h2 style={{ fontSize: '3rem', margin: 0 }}>{stats.courses}</h2>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-4" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card title="Quick Actions">
            <Button variant="secondary" className="w-full mb-4" style={{ width: '100%', marginBottom: '10px' }} onClick={() => setShowUserModal(true)}>Create New User</Button>
            <Button variant="accent" className="w-full" style={{ width: '100%' }} onClick={() => setShowCourseModal(true)}>Assign Course</Button>
        </Card>
      </div>

      <div className="mt-8" style={{ marginTop: '30px' }}>
        <Card title="Teacher Directory (For Course Assignment)">
          <Table headers={['Teacher ID', 'Name', 'Email', 'Department']}>
            {teachers.map((t, index) => (
              <TableRow key={t.id} isLast={index === teachers.length - 1}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.full_name}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>{t.department}</TableCell>
              </TableRow>
            ))}
          </Table>
          {teachers.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No teachers found. Use "Create New User" to add one.</p>}
        </Card>
      </div>

      {showUserModal && <CreateUserModal token={token!} onClose={() => setShowUserModal(false)} onSuccess={fetchStats} />}
      {showCourseModal && <AssignCourseModal token={token!} onClose={() => setShowCourseModal(false)} onSuccess={fetchStats} />}
    </div>
  );
};
