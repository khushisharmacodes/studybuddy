import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import useAuthStore from '../store/authStore.js';
import { BRANCH_OPTIONS } from '../utils/branches.js';
import subjectService from '../services/subjectService.js';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [previewSubjects, setPreviewSubjects] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: 'NIT Kurukshetra',
    branch: '',
    semester: '',
    dailyStudyGoal: 120,
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  useEffect(() => {
    let cancelled = false;
    if (form.branch && form.semester) {
      subjectService
        .previewSubjects(form.branch, form.semester)
        .then(({ data }) => {
          if (!cancelled) setPreviewSubjects(data.subjects || []);
        })
        .catch(() => {
          if (!cancelled) setPreviewSubjects([]);
        });
    } else {
      setPreviewSubjects([]);
    }
    return () => { cancelled = true; };
  }, [form.branch, form.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        ...form,
        semester: Number(form.semester) || 1,
        dailyStudyGoal: Number(form.dailyStudyGoal) || 120,
      });
      navigate('/dashboard');
    } catch {
      // handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-[2.5rem] p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-violet-500 to-rose-400 flex items-center justify-center text-white shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-stone-800 mb-2">Join StudyBuddy</h1>
          <p className="text-stone-500">Start your cozy productivity journey today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="College"
              placeholder="College"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Branch / Stream</label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                required
              >
                <option value="">Select branch</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Semester"
              type="number"
              placeholder="1-8"
              min="1"
              max="12"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
            />
            <Input
              label="Daily Goal (mins)"
              type="number"
              placeholder="120"
              value={form.dailyStudyGoal}
              onChange={(e) => setForm({ ...form, dailyStudyGoal: e.target.value })}
            />
          </div>

          {previewSubjects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Subjects in your semester</label>
              <div className="flex flex-wrap gap-2">
                {previewSubjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm">
              {error}
            </motion.div>
          )}

          <Button type="submit" variant="cozy" size="lg" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-stone-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
