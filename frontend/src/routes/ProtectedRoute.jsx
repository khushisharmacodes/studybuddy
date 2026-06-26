import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

function hasAuthToken() {
  return Boolean(localStorage.getItem('studybuddy_token'));
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated || hasAuthToken() ? children : <Navigate to="/login" replace />;
}
