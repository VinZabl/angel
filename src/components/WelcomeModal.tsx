import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  username: string;
  onClose: () => void;
  onGetStarted: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ username, onClose, onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cafe-text/70 hover:text-cafe-text transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cafe-primary to-cafe-secondary rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-cafe-text mb-2">
            Welcome {username}!
          </h2>
          <p className="text-cafe-text/70 mb-6">
            You have successfully logged in. Enjoy exclusive member benefits!
          </p>
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="px-6 py-3 bg-gradient-to-r from-cafe-primary to-cafe-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
