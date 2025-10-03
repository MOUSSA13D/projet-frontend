// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import authService from '../services/authService';

let logoutTimer;

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        authService.logout(); // Déconnexion auto après 2 minutes
      }, 30000); // 2 minutes = 120000 ms
    };

    // Événements qui signifient activité utilisateur
    const events = ['click', 'mousemove', 'keydown', 'scroll'];
    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Démarrer le timer dès qu’on entre
    resetTimer();

    // Nettoyage quand le composant est démonté
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
