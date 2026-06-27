import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button.jsx';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
const EAR_THRESHOLD = 0.18;
const DROWSY_FRAMES_THRESHOLD = 10;
const NO_FACE_FRAMES_THRESHOLD = 15;

const playAlertSound = async () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (error) {
    console.error('Alert sound failed', error);
  }
};

const calculateEAR = (eye) => {
  const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const vertical1 = dist(eye[1], eye[5]);
  const vertical2 = dist(eye[2], eye[4]);
  const horizontal = dist(eye[0], eye[3]);
  return (vertical1 + vertical2) / (2 * horizontal);
};

export default function FocusGuard({ isRunning, onDrowsy }) {
  const [enabled, setEnabled] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('off');
  const [alertShown, setAlertShown] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const drowsyFrameCount = useRef(0);
  const noFaceFrameCount = useRef(0);
  const lastAlertTime = useRef(0);

  const stopCamera = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('off');
    setAlertShown(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('active');
    } catch (error) {
      console.error('Camera access failed', error);
      setStatus('error');
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadModels = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Failed to load face-api models', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const detect = useCallback(async () => {
    if (!videoRef.current || !enabled || !isRunning) {
      frameRef.current = requestAnimationFrame(detect);
      return;
    }

    const video = videoRef.current;
    if (video.paused || video.ended || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(detect);
      return;
    }

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (detection) {
      noFaceFrameCount.current = 0;
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      const leftEAR = calculateEAR(leftEye);
      const rightEAR = calculateEAR(rightEye);
      const avgEAR = (leftEAR + rightEAR) / 2;

      if (avgEAR < EAR_THRESHOLD) {
        drowsyFrameCount.current += 1;
      } else {
        drowsyFrameCount.current = Math.max(0, drowsyFrameCount.current - 1);
      }

      if (drowsyFrameCount.current > DROWSY_FRAMES_THRESHOLD) {
        const now = Date.now();
        if (now - lastAlertTime.current > 5000) {
          lastAlertTime.current = now;
          playAlertSound();
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          notifyUser('Wake up, buddy!', 'You look sleepy — stay focused 🧸');
          setAlertShown(true);
          onDrowsy?.();
          setTimeout(() => setAlertShown(false), 3000);
        }
      }
    } else {
      noFaceFrameCount.current += 1;
      if (noFaceFrameCount.current > NO_FACE_FRAMES_THRESHOLD) {
        const now = Date.now();
        if (now - lastAlertTime.current > 8000) {
          lastAlertTime.current = now;
          playAlertSound();
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          notifyUser('Where did you go?', 'Focus Guard cannot see you 🧸');
          setAlertShown(true);
          onDrowsy?.();
          setTimeout(() => setAlertShown(false), 3000);
        }
      }
    }

    frameRef.current = requestAnimationFrame(detect);
  }, [enabled, isRunning, onDrowsy]);

  useEffect(() => {
    if (enabled) {
      if (!modelsLoaded) {
        loadModels().then(() => startCamera());
      } else {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [enabled, modelsLoaded, loadModels, startCamera, stopCamera]);

  useEffect(() => {
    if (enabled && isRunning && modelsLoaded) {
      frameRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, isRunning, modelsLoaded, detect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {enabled ? <Camera className="w-4 h-4 text-violet-600" /> : <CameraOff className="w-4 h-4 text-stone-400" />}
          <span className="text-sm font-medium text-stone-700">Focus Guard</span>
        </div>
        <Button
          type="button"
          variant={enabled ? 'cozy' : 'secondary'}
          size="sm"
          onClick={async () => {
            if (!enabled) await requestNotificationPermission();
            setEnabled(!enabled);
          }}
          isLoading={loading}
        >
          {enabled ? 'On' : 'Off'}
        </Button>
      </div>

      {enabled && (
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover opacity-80" muted playsInline />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute bottom-2 left-2 text-[10px] text-white/70 bg-black/40 px-2 py-1 rounded-lg">
            {status === 'active' ? 'Monitoring...' : status === 'error' ? 'Camera error' : 'Starting...'}
          </div>
        </div>
      )}

      {alertShown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Wake up, buddy! Stay focused 🧸</span>
        </motion.div>
      )}

      <p className="text-xs text-stone-400">
        Focus Guard uses your camera to detect drowsiness. Video never leaves your device.
      </p>
    </div>
  );
}
