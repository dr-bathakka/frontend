import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { LogOut, BookOpen, Calendar, Bell, TrendingUp, Edit, Trash2, Plus, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [homework, setHomework] = useState([]);
  const [exams, setExams] = useState([]);
  const [notices, setNotices] = useState([]);
  const [progress, setProgress] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [homeworkDialog, setHomeworkDialog] = useState(false);
  const [examDialog, setExamDialog] = useState(false);
  const [noticeDialog, setNoticeDialog] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  // Form states
  const [homeworkForm, setHomeworkForm] = useState({
    subject: '',
    description: '',
    due_date: ''
  });

  const [examForm, setExamForm] = useState({
    subject: '',
    date: '',
    syllabus: '',
    type: 'Midterm'
  });

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || userData.type !== 'student') {
      navigate('/student/login');
      return;
    }

    setUser(userData);
    fetchAllData();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchHomework(),
        fetchExams(),
        fetchNotices(),
        fetchProgress(),
        fetchTimetable()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomework = async () => {
    try {
      const response = await axios.get(`${API}/homework`, {
        headers: getAuthHeaders()
      });
      setHomework(response.data);
    } catch (error) {
      toast.error('Failed to fetch homework');
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API}/exams`, {
        headers: getAuthHeaders()
      });
      setExams(response.data);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API}/notices`, {
        headers: getAuthHeaders()
      });
      setNotices(response.data);
    } catch (error) {
      toast.error('Failed to fetch notices');
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API}/progress`, {
        headers: getAuthHeaders()
      });
      setProgress(response.data);
    } catch (error) {
      toast.error('Failed to fetch progress');
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`${API}/timetable`, {
        headers: getAuthHeaders()
      });
      setTimetable(response.data);
    } catch (error) {
      toast.error('Failed to fetch timetable');
    }
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`${API}/homework`, 
        { ...homeworkForm, class_name: userData.class_name },
        { headers: getAuthHeaders() }
      );
      toast.success('Homework created successfully');
      setHomeworkForm({ subject: '', description: '', due_date: '' });
      setHomeworkDialog(false);
      fetchHomework();
      fetchProgress();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create homework');
    }
  };

  const handleUpdateHomework = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/homework/${editingHomework.id}`, homeworkForm, {
        headers: getAuthHeaders()
      });
      toast.success('Homework updated successfully');
      setHomeworkForm({ subject: '', description: '', due_date: '' });
      setEditingHomework(null);
      setHomeworkDialog(false);
      fetchHomework();
    } catch (error) {
      toast.error('Failed to update homework');
    }
  };

  const handleDeleteHomework = async (id) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;
    try {
      await axios.delete(`${API}/homework/${id}`, {
        headers: getAuthHeaders()
      });
      toast.success('Homework deleted successfully');
      fetchHomework();
      fetchProgress();
    } catch (error) {
      toast.error('Failed to delete homework');
    }
  };

  const handleToggleHomeworkStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await axios.post(`${API}/homework/${id}/status`, 
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success(`Homework marked as ${newStatus}`);
      fetchHomework();
      fetchProgress();
    } catch (error) {
      toast.error('Failed to update homework status');
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`${API}/exams`, 
        { ...examForm, class_name: userData.class_name },
        { headers: getAuthHeaders() }
      );
      toast.success('Exam created successfully');
      setExamForm({ subject: '', date: '', syllabus: '', type: 'Midterm' });
      setExamDialog(false);
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create exam');
    }
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/exams/${editingExam.id}`, examForm, {
        headers: getAuthHeaders()
      });
      toast.success('Exam updated successfully');
      setExamForm({ subject: '', date: '', syllabus: '', type: 'Midterm' });
      setEditingExam(null);
      setExamDialog(false);
      fetchExams();
    } catch (error) {
      toast.error('Failed to update exam');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await axios.delete(`${API}/exams/${id}`, {
        headers: getAuthHeaders()
      });
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`${API}/notices`, 
        { ...noticeForm, class_name: userData.class_name },
        { headers: getAuthHeaders() }
      );
      toast.success('Notice posted successfully');
      setNoticeForm({ title: '', message: '' });
      setNoticeDialog(false);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await axios.delete(`${API}/notices/${id}`, {
        headers: getAuthHeaders()
      });
      toast.success('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const openEditHomework = (hw) => {
    setEditingHomework(hw);
    setHomeworkForm({
      subject: hw.subject,
      description: hw.description,
      due_date: hw.due_date
    });
    setHomeworkDialog(true);
  };

  const openEditExam = (exam) => {
    setEditingExam(exam);
    setExamForm({
      subject: exam.subject,
      date: exam.date,
      syllabus: exam.syllabus,
      type: exam.type
    });
    setExamDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getUrgencyBadge = (exam) => {
    const color = exam.urgency_color;
    const days = exam.days_remaining;
    
    let badgeClass = 'bg-green-100 text-green-800';
    let text = `${days} days left`;
    
    if (color === 'red') {
      badgeClass = 'bg-red-100 text-red-800';
      text = days === 0 ? 'TODAY!' : 'TOMORROW!';
    } else if (color === 'orange') {
      badgeClass = 'bg-orange-100 text-orange-800';
      text = `${days} days left`;
    } else if (color === 'yellow') {
      badgeClass = 'bg-yellow-100 text-yellow-800';
      text = `${days} days left`;
    } else if (color === 'gray') {
      badgeClass = 'bg-gray-100 text-gray-800';
      text = 'Past date';
    }
    
    return <Badge className={badgeClass}>{text}</Badge>;
  };

  const isClassRep = user?.role === 'class_rep';

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

  const pendingReminders = homework.filter(hw => hw.reminder && hw.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
                  {isClassRep && (
                    <Badge className="bg-indigo-600 text-white">Class Representative</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">Class {user?.class_name}</p>
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

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Smart Reminders */}
        {pendingReminders.length > 0 && (
          <Card className="border-l-4 border-l-orange-500 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                Pending Homework Reminders
              </CardTitle>
              <CardDescription>These subjects have class tomorrow!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingReminders.map((hw) => (
                  <div key={hw.id} className="flex items-center gap-2 text-orange-800">
                    <Bell className="w-4 h-4" />
                    <span className="font-semibold">{hw.subject}</span> homework pending - Class tomorrow!
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Section */}
        {progress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-800">Overall Progress</span>
                  <span className="text-indigo-600 font-bold">{progress.overall_progress}%</span>
                </div>
                <Progress value={progress.overall_progress} className="h-3" />
                <p className="text-sm text-slate-600 mt-2">
                  {progress.completed_homework} of {progress.total_homework} homework completed
                </p>
              </div>

              {progress.subject_progress && progress.subject_progress.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <p className="font-semibold text-slate-800">Subject-wise Progress</p>
                  {progress.subject_progress.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">{subject.subject}</span>
                        <span className="text-sm text-slate-600">
                          {subject.completed}/{subject.total} ({Math.round(subject.progress)}%)
                        </span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Homework Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Homework Assignments
              </CardTitle>
              {isClassRep && (
                <Dialog open={homeworkDialog} onOpenChange={setHomeworkDialog}>
                  <DialogTrigger asChild>
                    <Button
                      data-testid="add-homework-btn"
                      onClick={() => {
                        setEditingHomework(null);
                        setHomeworkForm({ subject: '', description: '', due_date: '' });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Homework
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingHomework ? 'Edit Homework' : 'Add New Homework'}</DialogTitle>
                      <DialogDescription>
                        {editingHomework ? 'Update homework details' : 'Create a new homework assignment'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editingHomework ? handleUpdateHomework : handleCreateHomework} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hw_subject">Subject</Label>
                        <Input
                          data-testid="homework-subject-input"
                          id="hw_subject"
                          value={homeworkForm.subject}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                          placeholder="Mathematics"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hw_description">Description</Label>
                        <Textarea
                          data-testid="homework-description-input"
                          id="hw_description"
                          value={homeworkForm.description}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                          placeholder="Complete Chapter 5 exercises"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hw_due_date">Due Date</Label>
                        <Input
                          data-testid="homework-due-date-input"
                          id="hw_due_date"
                          type="date"
                          value={homeworkForm.due_date}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, due_date: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        data-testid="submit-homework-btn"
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {editingHomework ? 'Update' : 'Create'} Homework
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {homework.map((hw) => (
                <div
                  key={hw.id}
                  data-testid={`homework-item-${hw.id}`}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    hw.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-800">{hw.subject}</h3>
                        {hw.status === 'completed' && (
                          <Badge className="bg-green-600 text-white">Completed</Badge>
                        )}
                        {hw.reminder && hw.status === 'pending' && (
                          <Badge className="bg-orange-600 text-white">
                            <Bell className="w-3 h-3 mr-1" />
                            Class Tomorrow
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-2">{hw.description}</p>
                      <p className="text-sm text-slate-500">
                        Due: {new Date(hw.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        data-testid={`toggle-homework-${hw.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleHomeworkStatus(hw.id, hw.status)}
                        className={hw.status === 'completed' ? 'text-green-600' : 'text-gray-400'}
                      >
                        {hw.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </Button>
                      {isClassRep && (
                        <>
                          <Button
                            data-testid={`edit-homework-${hw.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditHomework(hw)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`delete-homework-${hw.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHomework(hw.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {homework.length === 0 && (
                <p className="text-center text-slate-600 py-8">No homework assignments yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exams Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Upcoming Exams
              </CardTitle>
              {isClassRep && (
                <Dialog open={examDialog} onOpenChange={setExamDialog}>
                  <DialogTrigger asChild>
                    <Button
                      data-testid="add-exam-btn"
                      onClick={() => {
                        setEditingExam(null);
                        setExamForm({ subject: '', date: '', syllabus: '', type: 'Midterm' });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
                      <DialogDescription>
                        {editingExam ? 'Update exam details' : 'Create a new exam'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editingExam ? handleUpdateExam : handleCreateExam} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="exam_subject">Subject</Label>
                        <Input
                          data-testid="exam-subject-input"
                          id="exam_subject"
                          value={examForm.subject}
                          onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                          placeholder="Mathematics"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exam_date">Date</Label>
                        <Input
                          data-testid="exam-date-input"
                          id="exam_date"
                          type="date"
                          value={examForm.date}
                          onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exam_syllabus">Syllabus</Label>
                        <Textarea
                          data-testid="exam-syllabus-input"
                          id="exam_syllabus"
                          value={examForm.syllabus}
                          onChange={(e) => setExamForm({ ...examForm, syllabus: e.target.value })}
                          placeholder="Chapters 1-5"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exam_type">Type</Label>
                        <Select
                          value={examForm.type}
                          onValueChange={(value) => setExamForm({ ...examForm, type: value })}
                        >
                          <SelectTrigger data-testid="exam-type-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Midterm">Midterm</SelectItem>
                            <SelectItem value="Final">Final</SelectItem>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Test">Test</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        data-testid="submit-exam-btn"
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {editingExam ? 'Update' : 'Create'} Exam
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exams
                .filter(exam => exam.days_remaining >= 0)
                .sort((a, b) => a.days_remaining - b.days_remaining)
                .map((exam) => (
                  <div
                    key={exam.id}
                    data-testid={`exam-item-${exam.id}`}
                    className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-slate-800">{exam.subject} Exam</h3>
                          {getUrgencyBadge(exam)}
                        </div>
                        <p className="text-slate-600 mb-1">Syllabus: {exam.syllabus}</p>
                        <p className="text-sm text-slate-500">
                          Type: {exam.type} • Date: {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                      {isClassRep && (
                        <div className="flex items-center gap-2">
                          <Button
                            data-testid={`edit-exam-${exam.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditExam(exam)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`delete-exam-${exam.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExam(exam.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {exams.filter(exam => exam.days_remaining >= 0).length === 0 && (
                <p className="text-center text-slate-600 py-8">No upcoming exams</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notices Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Class Notices
              </CardTitle>
              {isClassRep && (
                <Dialog open={noticeDialog} onOpenChange={setNoticeDialog}>
                  <DialogTrigger asChild>
                    <Button
                      data-testid="add-notice-btn"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Notice
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Post New Notice</DialogTitle>
                      <DialogDescription>Share important information with your class</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNotice} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notice_title">Title</Label>
                        <Input
                          data-testid="notice-title-input"
                          id="notice_title"
                          value={noticeForm.title}
                          onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                          placeholder="Important Notice"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notice_message">Message</Label>
                        <Textarea
                          data-testid="notice-message-input"
                          id="notice_message"
                          value={noticeForm.message}
                          onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                          placeholder="Enter your message here..."
                          rows={4}
                          required
                        />
                      </div>
                      <Button
                        data-testid="submit-notice-btn"
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Post Notice
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  data-testid={`notice-item-${notice.id}`}
                  className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{notice.title}</h3>
                      <p className="text-slate-600 mb-2">{notice.message}</p>
                      <p className="text-xs text-slate-500">
                        Posted: {new Date(notice.date_posted).toLocaleDateString()}
                      </p>
                    </div>
                    {isClassRep && (
                      <Button
                        data-testid={`delete-notice-${notice.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {notices.length === 0 && (
                <p className="text-center text-slate-600 py-8">No notices posted yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timetable Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Class Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timetable.length > 0 ? (
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const dayEntries = timetable.filter(t => t.day === day).sort((a, b) => a.period - b.period);
                  if (dayEntries.length === 0) return null;

                  return (
                    <div key={day}>
                      <h3 className="font-bold text-slate-800 mb-2">{day}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-3 bg-indigo-50 rounded-lg text-center border border-indigo-200"
                          >
                            <p className="text-xs text-slate-600 mb-1">Period {entry.period}</p>
                            <p className="font-semibold text-slate-800 text-sm">{entry.subject}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-slate-600 py-8">No timetable available yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
