import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
          <div className="max-w-md glass-card rounded-[2.5rem] p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-stone-800 mb-2">Oops! Something broke</h2>
            <p className="text-stone-500 mb-6">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <Button onClick={() => window.location.reload()} variant="cozy">
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
