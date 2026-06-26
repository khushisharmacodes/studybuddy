import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Target } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import useGoalStore from '../store/goalStore.js';

export default function Goals() {
  const { goals, fetchGoals, addGoal, toggleGoal, deleteGoal } = useGoalStore();
  const [filter, setFilter] = useState('daily');
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'daily', targetValue: 1, unit: 'sessions' });

  useEffect(() => {
    fetchGoals(filter);
  }, [fetchGoals, filter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    await addGoal({ ...newGoal, type: filter });
    setNewGoal({ title: '', type: 'daily', targetValue: 1, unit: 'sessions' });
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-stone-800">Goals</h1>
          <p className="text-stone-500">Track what matters, one goal at a time.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant="cozy">
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'New Goal'}
        </Button>
      </div>

      <div className="flex gap-2">
        {['daily', 'weekly', 'monthly'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === t ? 'bg-violet-500 text-white' : 'bg-white/60 text-stone-600 hover:bg-violet-50'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass-card rounded-3xl p-6 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Goal title"
                placeholder="e.g., Complete 3 DSA problems"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                required
              />
              <Input
                label="Target value"
                type="number"
                min="1"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
              />
            </div>
            <Button type="submit" variant="cozy">Add Goal</Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {goals.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-stone-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No {filter} goals yet. Add your first!</p>
            </div>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal._id} hover={false} className="flex items-center gap-4">
              <button
                onClick={() => toggleGoal(goal._id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  goal.isCompleted ? 'bg-violet-500 border-violet-500' : 'border-stone-300 hover:border-violet-400'
                }`}
              >
                {goal.isCompleted && <Check className="w-4 h-4 text-white" />}
              </button>
              <div className="flex-1">
                <p className={`font-medium ${goal.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                  {goal.title}
                </p>
                <p className="text-xs text-stone-500">
                  {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                </p>
              </div>
              <Badge variant={goal.isCompleted ? 'teal' : 'violet'}>{goal.type}</Badge>
              <button onClick={() => deleteGoal(goal._id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
