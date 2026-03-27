import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const TeacherDashboard: React.FC = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/teacher/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '32px' }}>
      <h1>Teacher Dashboard</h1>
      
      <Card title="My Courses" bgColor="var(--secondary-color)">
        {courses.length === 0 ? (
          <p>No courses assigned to you yet.</p>
        ) : (
          <Table headers={['Course Code', 'Course Name', 'Actions']}>
            {courses.map((course, index) => (
              <TableRow key={course.id} isLast={index === courses.length - 1}>
                <TableCell>{course.course_code}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>
                  <Button variant="primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>View Students</Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
