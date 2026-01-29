import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PolicyConsentModalProps {
  message: string;
  onAccept: () => void;
  onReject: () => void;
}

const PolicyConsentModal: React.FC<PolicyConsentModalProps> = ({ message, onAccept, onReject }) => {
  return (
    <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-semibold text-cafe-text mb-4">Please read</h2>
        <div className="flex-1 overflow-y-auto min-h-0 mb-6">
          <p className="text-sm text-cafe-textMuted whitespace-pre-wrap">{message}</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 border-2 border-cafe-primary/30 text-cafe-text hover:border-cafe-primary hover:bg-cafe-primary/10"
          >
            <XCircle className="h-5 w-5" />
            Reject
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-cafe-primary to-cafe-secondary text-white hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="h-5 w-5" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyConsentModal;
