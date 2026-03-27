import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const StudentDashboard: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [percentage, setPercentage] = useState<number>(0);
  const [marks, setMarks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, attendanceRes, marksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/student/profile', { headers }),
          axios.get('http://localhost:5000/api/student/attendance', { headers }),
          axios.get('http://localhost:5000/api/student/marks', { headers })
        ]);
        
        if (profileRes.data.success) setProfile(profileRes.data.profile);
        if (attendanceRes.data.success) {
            setAttendance(attendanceRes.data.attendance);
            setPercentage(attendanceRes.data.percentage);
        }
        if (marksRes.data.success) setMarks(marksRes.data.marks);
      } catch (error) {
        console.error('Failed to fetch student data', error);
      }
    };
    fetchData();
  }, [token]);

  if (!profile) return <div>Loading Profile...</div>;

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '32px' }}>
      <h1>Student Dashboard</h1>
      
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Card title="My Profile" bgColor="white">
            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Branch:</strong> {profile.branch}</p>
            <p><strong>Year:</strong> {profile.year}</p>
        </Card>

        <Card title="Attendance Overview" bgColor={percentage >= 75 ? 'var(--accent-color)' : 'var(--primary-color)'}>
            <h2 style={{ fontSize: '3rem', margin: 0 }}>{percentage}%</h2>
            <p><strong>Total Classes:</strong> {attendance.length}</p>
        </Card>
      </div>

      <Card title="Recent Marks" bgColor="var(--secondary-color)">
        {marks.length === 0 ? (
          <p>No marks recorded yet.</p>
        ) : (
          <Table headers={['Course', 'Assessment', 'Max Marks', 'Obtained']}>
            {marks.map((m, index) => (
              <TableRow key={index} isLast={index === marks.length - 1}>
                <TableCell>{m.course_code}</TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.max_marks}</TableCell>
                <TableCell>{m.marks_obtained}</TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
