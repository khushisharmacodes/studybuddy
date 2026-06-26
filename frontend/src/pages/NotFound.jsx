import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import TeddyCompanion from '../components/teddy/TeddyCompanion.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
      <div className="max-w-md text-center">
        <TeddyCompanion state="sad" message="I could not find that page." className="mb-6" />
        <h1 className="text-5xl font-display font-bold text-stone-800 mb-2">404</h1>
        <p className="text-stone-500 mb-8">The page you are looking for does not exist.</p>
        <Link to="/dashboard">
          <Button variant="cozy">
            <Search className="w-4 h-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
