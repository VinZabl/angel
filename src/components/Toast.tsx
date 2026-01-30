import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const onCloseRef = useRef(onClose);
  const [isExiting, setIsExiting] = useState(false);
  
  // Keep the ref up to date
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Set up the timer only once when mounted
  useEffect(() => {
    // Start exit animation after duration
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    // Actually close after exit animation completes (300ms)
    const closeTimer = setTimeout(() => {
      onCloseRef.current();
    }, duration + 300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-out ${
        isExiting 
          ? 'opacity-0 translate-x-full' 
          : 'opacity-100 translate-x-0 animate-slide-in-right'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-900">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
