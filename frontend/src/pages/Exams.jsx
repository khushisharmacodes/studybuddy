import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, FileText, Clock } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import useDashboardStore from '../store/dashboardStore.js';

export default function Exams() {
  const { exams, examStatus, isLoading, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-stone-800">Academic Updates</h1>
        <p className="text-stone-500">Official updates from NIT Kurukshetra.</p>
      </div>

      <Card className={`border-l-4 ${examStatus?.hasUpdate ? 'border-l-teal-500' : 'border-l-amber-500'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${examStatus?.hasUpdate ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-stone-800">Schedule Status</h3>
            <p className="text-stone-600 mt-1">{examStatus?.message || 'Checking official sources...'}</p>
            {examStatus?.lastCheckedAt && (
              <p className="text-xs text-stone-400 mt-2">Last checked: {new Date(examStatus.lastCheckedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </Card>

      <h3 className="font-display font-bold text-stone-800 text-xl flex items-center gap-2">
        <Calendar className="w-5 h-5 text-violet-500" /> Upcoming Exams
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : exams.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-stone-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming exams found. We will keep checking the official website.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover={false}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-bold text-stone-800">{exam.title}</h4>
                      <Badge variant={exam.isPostponed ? 'amber' : exam.isRevised ? 'rose' : 'sky'}>
                        {exam.isPostponed ? 'Postponed' : exam.isRevised ? 'Revised' : exam.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-stone-500">{exam.subject}</p>
                    {exam.venue && <p className="text-xs text-stone-400 mt-1">Venue: {exam.venue}</p>}
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-stone-800">
                      {exam.date ? new Date(exam.date).toLocaleDateString() : 'Date TBA'}
                    </p>
                    {exam.time && <p className="text-sm text-stone-500">{exam.time}</p>}
                    {exam.sourceUrl && (
                      <a href={exam.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-600 hover:underline flex items-center gap-1 mt-1 md:justify-end">
                        <FileText className="w-3 h-3" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
