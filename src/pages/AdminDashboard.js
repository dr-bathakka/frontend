import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { LogOut, Users, Calendar, Home, Trash2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = Array.from({ length: 10 }, (_, i) => i + 1);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    class_name: '',
    username: '',
    password: '',
    role: 'student'
  });

  // Timetable form state
  const [timetableForm, setTimetableForm] = useState({
    class_name: '',
    day: 'Monday',
    period: 1,
    subject: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || userData.type !== 'admin') {
      navigate('/admin/login');
      return;
    }

    setUser(userData);
    fetchStudents();
    fetchTimetable();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/admin/students`, {
        headers: getAuthHeaders()
      });
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`${API}/admin/timetable`, {
        headers: getAuthHeaders()
      });
      setTimetable(response.data);
    } catch (error) {
      toast.error('Failed to fetch timetable');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/students`, studentForm, {
        headers: getAuthHeaders()
      });
      toast.success('Student created successfully');
      setStudentForm({
        name: '',
        class_name: '',
        username: '',
        password: '',
        role: 'student'
      });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create student');
    }
  };

  const handleUpdateRole = async (studentId, newRole) => {
    try {
      await axios.put(`${API}/admin/students/${studentId}/role`, 
        { role: newRole },
        { headers: getAuthHeaders() }
      );
      toast.success('Role updated successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/timetable`, timetableForm, {
        headers: getAuthHeaders()
      });
      toast.success('Timetable entry created successfully');
      setTimetableForm({
        class_name: '',
        day: 'Monday',
        period: 1,
        subject: ''
      });
      fetchTimetable();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create timetable entry');
    }
  };

  const handleDeleteTimetable = async (id) => {
    try {
      await axios.delete(`${API}/admin/timetable/${id}`, {
        headers: getAuthHeaders()
      });
      toast.success('Timetable entry deleted');
      fetchTimetable();
    } catch (error) {
      toast.error('Failed to delete timetable entry');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Home className="w-6 h-6 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button
              data-testid="logout-btn"
              onClick={handleLogout}
              variant="outline"
              className="text-slate-600 hover:text-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="students" data-testid="students-tab">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="timetable" data-testid="timetable-tab">
              <Calendar className="w-4 h-4 mr-2" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="overview" data-testid="overview-tab">
              <Home className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Student</CardTitle>
                <CardDescription>Add a new student account with credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        data-testid="student-name-input"
                        id="name"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class_name">Class</Label>
                      <Input
                        data-testid="student-class-input"
                        id="class_name"
                        value={studentForm.class_name}
                        onChange={(e) => setStudentForm({ ...studentForm, class_name: e.target.value })}
                        placeholder="10A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        data-testid="student-username-input"
                        id="username"
                        value={studentForm.username}
                        onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                        placeholder="john_doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        data-testid="student-password-input"
                        id="password"
                        type="password"
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={studentForm.role}
                        onValueChange={(value) => setStudentForm({ ...studentForm, role: value })}
                      >
                        <SelectTrigger data-testid="student-role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Regular Student</SelectItem>
                          <SelectItem value="class_rep">Class Representative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    data-testid="create-student-btn"
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Student
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Students ({students.length})</CardTitle>
                <CardDescription>Manage student accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      data-testid={`student-item-${student.username}`}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-sm text-slate-600">
                          @{student.username} • Class {student.class_name}
                        </p>
                      </div>
                      <Select
                        value={student.role}
                        onValueChange={(value) => handleUpdateRole(student.id, value)}
                      >
                        <SelectTrigger className="w-48" data-testid={`role-select-${student.username}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Regular Student</SelectItem>
                          <SelectItem value="class_rep">Class Representative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="text-center text-slate-600 py-8">No students created yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Timetable Entry</CardTitle>
                <CardDescription>Set up class schedule (5 days × 10 periods)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTimetable} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tt_class">Class</Label>
                      <Input
                        data-testid="timetable-class-input"
                        id="tt_class"
                        value={timetableForm.class_name}
                        onChange={(e) => setTimetableForm({ ...timetableForm, class_name: e.target.value })}
                        placeholder="10A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select
                        value={timetableForm.day}
                        onValueChange={(value) => setTimetableForm({ ...timetableForm, day: value })}
                      >
                        <SelectTrigger data-testid="timetable-day-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period">Period</Label>
                      <Select
                        value={String(timetableForm.period)}
                        onValueChange={(value) => setTimetableForm({ ...timetableForm, period: parseInt(value) })}
                      >
                        <SelectTrigger data-testid="timetable-period-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERIODS.map((period) => (
                            <SelectItem key={period} value={String(period)}>Period {period}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        data-testid="timetable-subject-input"
                        id="subject"
                        value={timetableForm.subject}
                        onChange={(e) => setTimetableForm({ ...timetableForm, subject: e.target.value })}
                        placeholder="Mathematics"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    data-testid="create-timetable-btn"
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Entry
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timetable Entries ({timetable.length})</CardTitle>
                <CardDescription>View and manage all timetable entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DAYS.map((day) => {
                    const dayEntries = timetable.filter(t => t.day === day);
                    if (dayEntries.length === 0) return null;

                    return (
                      <div key={day} className="mb-4">
                        <h3 className="font-bold text-slate-800 mb-2">{day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {dayEntries.sort((a, b) => a.period - b.period).map((entry) => (
                            <div
                              key={entry.id}
                              data-testid={`timetable-entry-${entry.day}-${entry.period}`}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-semibold text-sm text-slate-800">
                                  Period {entry.period}: {entry.subject}
                                </p>
                                <p className="text-xs text-slate-600">Class {entry.class_name}</p>
                              </div>
                              <Button
                                data-testid={`delete-timetable-${entry.id}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTimetable(entry.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {timetable.length === 0 && (
                    <p className="text-center text-slate-600 py-8">No timetable entries yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-indigo-600">{students.length}</CardTitle>
                  <CardDescription>Total Students</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-green-600">
                    {students.filter(s => s.role === 'class_rep').length}
                  </CardTitle>
                  <CardDescription>Class Representatives</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-blue-600">{timetable.length}</CardTitle>
                  <CardDescription>Timetable Entries</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
