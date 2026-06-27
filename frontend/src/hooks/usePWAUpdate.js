import { useEffect, useState, useCallback } from 'react';

export default function usePWAUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }, [waitingWorker]);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;

    const handleUpdate = (reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setIsUpdateAvailable(true);
          }
        });
      });
    };

    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        handleUpdate(reg);

        // Check for updates every 30 minutes while the app is open
        const interval = setInterval(() => {
          reg.update();
        }, 30 * 60 * 1000);

        return () => clearInterval(interval);
      })
      .catch((error) => {
        console.error('StudyBuddy SW registration failed:', error);
      });

    // Listen for controllerchange to auto-reload once the new SW activates
    const onControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return { isUpdateAvailable, applyUpdate };
}
