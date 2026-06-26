import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Heart, Frown, Smile, Zap, Coffee, Meh } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import useJournalStore from '../store/journalStore.js';

const moods = [
  { key: 'happy', label: 'Happy', icon: Smile, color: 'amber' },
  { key: 'motivated', label: 'Motivated', icon: Zap, color: 'violet' },
  { key: 'calm', label: 'Calm', icon: Coffee, color: 'teal' },
  { key: 'tired', label: 'Tired', icon: Meh, color: 'stone' },
  { key: 'stressed', label: 'Stressed', icon: Frown, color: 'rose' },
  { key: 'sad', label: 'Sad', icon: Heart, color: 'sky' },
];

export default function Journal() {
  const { journals, fetchJournals, addJournal, deleteJournal } = useJournalStore();
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [entry, setEntry] = useState({ title: '', content: '', mood: 'calm', productivityRating: 5 });

  useEffect(() => {
    fetchJournals(search);
  }, [fetchJournals, search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!entry.content.trim()) return;
    await addJournal(entry);
    setEntry({ title: '', content: '', mood: 'calm', productivityRating: 5 });
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-stone-800">Journal</h1>
          <p className="text-stone-500">Reflect on your day, track your mood.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant="cozy">
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'New Entry'}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          placeholder="Search your entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 border border-stone-200 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
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
            <Input
              label="Title"
              placeholder="How was today?"
              value={entry.title}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setEntry({ ...entry, mood: m.key })}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                      entry.mood === m.key ? 'bg-violet-500 text-white' : 'bg-white/60 text-stone-600 hover:bg-violet-50'
                    }`}
                  >
                    <m.icon className="w-4 h-4" /> {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Productivity Rating</label>
              <input
                type="range"
                min="1"
                max="10"
                value={entry.productivityRating}
                onChange={(e) => setEntry({ ...entry, productivityRating: Number(e.target.value) })}
                className="w-full accent-violet-500"
              />
              <p className="text-right text-sm text-stone-600">{entry.productivityRating}/10</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Journal Entry</label>
              <textarea
                rows="5"
                placeholder="Write your thoughts here..."
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-stone-200 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 resize-none"
                required
              />
            </div>
            <Button type="submit" variant="cozy">Save Entry</Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {journals.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-stone-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No journal entries yet. Start reflecting today.</p>
            </div>
          </Card>
        ) : (
          journals.map((journal) => {
            const mood = moods.find((m) => m.key === journal.mood) || moods[2];
            return (
              <Card key={journal._id} hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-stone-800">{journal.title}</h3>
                      <Badge variant={mood.color}><mood.icon className="w-3 h-3 mr-1" />{mood.label}</Badge>
                    </div>
                    <p className="text-stone-600 whitespace-pre-wrap text-sm">{journal.content}</p>
                    <p className="text-xs text-stone-400 mt-3">
                      {new Date(journal.createdAt).toLocaleDateString()} · Productivity: {journal.productivityRating}/10
                    </p>
                  </div>
                  <button onClick={() => deleteJournal(journal._id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
