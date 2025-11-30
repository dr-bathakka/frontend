import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { GraduationCap, BookOpen, Bell } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-4 rounded-full shadow-lg">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
            Homework Buddy
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Never miss a deadline. Stay organized. Track your progress. Your personal homework and exam management system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Homework Tracking</h3>
            <p className="text-slate-600">Get intelligent reminders based on your class timetable. Never forget homework again.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Exam Countdown</h3>
            <p className="text-slate-600">Color-coded exam alerts that get more urgent as the date approaches. Always be prepared.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Progress Analytics</h3>
            <p className="text-slate-600">Track your completion rate overall and by subject. See your academic growth.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            data-testid="student-login-btn"
            onClick={() => navigate('/student/login')} 
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Student Login
          </Button>
          <Button 
            data-testid="admin-login-btn"
            onClick={() => navigate('/admin/login')} 
            size="lg"
            variant="outline"
            className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;