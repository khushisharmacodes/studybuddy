import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Users, FileText, Bell, Megaphone } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import useAuthStore from '../store/authStore.js';
import adminService from '../services/adminService.js';

export default function Admin() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [examForm, setExamForm] = useState({ title: '', subject: '', date: '', type: 'other' });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'general' });
  const [announcement, setAnnouncement] = useState({ title: '', message: '', type: 'general' });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    adminService.getStats().then(({ data }) => setStats(data.stats)).catch(console.error);
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createExam(examForm);
      setMessage('Exam created successfully');
      setExamForm({ title: '', subject: '', date: '', type: 'other' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create exam');
    }
    setLoading(false);
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createNotice(noticeForm);
      setMessage('Notice created successfully');
      setNoticeForm({ title: '', content: '', category: 'general' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create notice');
    }
    setLoading(false);
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminService.broadcastAnnouncement(announcement);
      setMessage(`Announcement broadcast to ${data.count} users`);
      setAnnouncement({ title: '', message: '', type: 'general' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to broadcast');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-violet-600" />
        <div>
          <h1 className="text-3xl font-display font-bold text-stone-800">Admin Panel</h1>
          <p className="text-stone-500">Manage academic data and announcements.</p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-2xl bg-violet-50 text-violet-800 text-sm font-medium">
          {message}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="!p-4 text-center">
            <Users className="w-6 h-6 mx-auto text-violet-600 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{stats.users}</p>
            <p className="text-xs text-stone-500">Users</p>
          </Card>
          <Card className="!p-4 text-center">
            <FileText className="w-6 h-6 mx-auto text-violet-600 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{stats.exams}</p>
            <p className="text-xs text-stone-500">Exams</p>
          </Card>
          <Card className="!p-4 text-center">
            <Bell className="w-6 h-6 mx-auto text-violet-600 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{stats.notices}</p>
            <p className="text-xs text-stone-500">Notices</p>
          </Card>
          <Card className="!p-4 text-center">
            <Megaphone className="w-6 h-6 mx-auto text-violet-600 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{stats.sessions}</p>
            <p className="text-xs text-stone-500">Sessions</p>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-4">Create Exam</h3>
          <form onSubmit={handleCreateExam} className="space-y-3">
            <Input
              placeholder="Exam title"
              value={examForm.title}
              onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
              required
            />
            <Input
              placeholder="Subject"
              value={examForm.subject}
              onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
            />
            <Input
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
            />
            <select
              value={examForm.type}
              onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="other">Other</option>
              <option value="midterm">Midterm</option>
              <option value="endterm">End Term</option>
              <option value="quiz">Quiz</option>
              <option value="practical">Practical</option>
            </select>
            <Button type="submit" variant="cozy" className="w-full" disabled={loading}>
              Create Exam
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-4">Create Notice</h3>
          <form onSubmit={handleCreateNotice} className="space-y-3">
            <Input
              placeholder="Notice title"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-300 min-h-[80px]"
            />
            <select
              value={noticeForm.category}
              onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="general">General</option>
              <option value="exam">Exam</option>
              <option value="postponement">Postponement</option>
              <option value="revised">Revised</option>
            </select>
            <Button type="submit" variant="cozy" className="w-full" disabled={loading}>
              Create Notice
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-bold text-stone-800 mb-4">Broadcast Announcement</h3>
        <form onSubmit={handleBroadcast} className="space-y-3">
          <Input
            placeholder="Announcement title"
            value={announcement.title}
            onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Message"
            value={announcement.message}
            onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/60 border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-300 min-h-[100px]"
            required
          />
          <Button type="submit" variant="cozy" className="w-full" disabled={loading}>
            Broadcast to All Users
          </Button>
        </form>
      </Card>
    </div>
  );
}
