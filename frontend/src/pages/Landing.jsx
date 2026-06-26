import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, BookOpen, BarChart3, Sparkles, Target, Heart, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import TeddyCompanion from '../components/teddy/TeddyCompanion.jsx';

const features = [
  {
    icon: Timer,
    title: 'Beautiful Pomodoro',
    desc: 'Focus sessions with ambient sounds, fullscreen mode, and animated progress rings.',
    color: 'violet',
  },
  {
    icon: BookOpen,
    title: 'Cozy Journal',
    desc: 'Daily reflections with mood tracking and a warm, distraction-free writing space.',
    color: 'rose',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Visualize your focus time, streaks, and subject-wise progress over time.',
    color: 'teal',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    desc: 'Set daily, weekly, and monthly goals. Stay accountable, celebrate wins.',
    color: 'amber',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    desc: 'Get personalized YouTube playlists, sheets, and articles based on your study habits.',
    color: 'sky',
  },
  {
    icon: Heart,
    title: 'Teddy Companion',
    desc: 'An emotional mascot that reacts to your streaks, goals, and study patterns.',
    color: 'violet',
  },
];

const testimonials = [
  { name: 'Aryan', text: 'StudyBuddy made my DSA grind so much more enjoyable. The teddy is adorable!' },
  { name: 'Priya', text: 'Finally an app that understands college life. The exam updates are super helpful.' },
  { name: 'Rohan', text: 'The focus timer with rain sounds is my new superpower.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <span className="text-lg font-display font-bold text-stone-800">StudyBuddy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:inline-flex px-4 py-2 rounded-xl text-stone-600 hover:bg-white/60 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="cozy" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="violet" className="mb-4">✨ AI-powered study companion</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-stone-800 leading-tight mb-6">
              Study smarter, <br />
              <span className="text-gradient">stay cozy.</span>
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-lg">
              The productivity app that combines focus timers, emotional companionship, academic tracking, and smart recommendations — all in one beautiful space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button variant="cozy" size="lg" className="w-full sm:w-auto">
                  Start Your Journey <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Already a Buddy? Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-300 to-rose-300 rounded-full blur-3xl opacity-30 animate-pulse-soft" />
              <TeddyCompanion state="excited" message="Let us ace those goals together!" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-3">Everything you need to thrive</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Notion-like organization meets Forest-like focus with a sprinkle of Duolingo gamification.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-stone-800 text-lg mb-2">{feature.title}</h3>
                  <p className="text-stone-500 text-sm">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Preview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto glass-card rounded-[2.5rem] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-4">Immersive Focus Mode</h2>
          <p className="text-stone-500 mb-8 max-w-2xl mx-auto">
            Enter fullscreen focus mode with ambient rain sounds, animated progress rings, and a cheering teddy. Distractions? Not here.
          </p>
          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center shadow-inner">
              <div className="w-52 h-52 rounded-full border-8 border-violet-200 border-t-violet-500 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                <span className="text-3xl font-bold text-stone-700 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '8s' }}>25:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 text-center mb-12">Loved by students</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-bold text-stone-800 text-sm">— {t.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-stone-800 mb-6">Ready to make studying addictive?</h2>
          <p className="text-stone-500 mb-8 text-lg">Join thousands of students turning focus into a daily habit.</p>
          <Link to="/register">
            <Button variant="cozy" size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-stone-200">
        <div className="max-w-6xl mx-auto text-center text-stone-500 text-sm">
          <p>Made with 🧸 for students everywhere · StudyBuddy</p>
        </div>
      </footer>
    </div>
  );
}
