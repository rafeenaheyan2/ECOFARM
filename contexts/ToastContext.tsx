
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X as CloseIcon } from 'lucide-react';

type ToastType = 'SUCCESS' | 'ERROR';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl min-w-[300px] max-w-md animate-in slide-in-from-right-10 duration-300 ${
              toast.type === 'SUCCESS' 
                ? 'bg-[#006400] text-white' 
                : 'bg-[#B22222] text-white'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'SUCCESS' ? (
                <CheckCircle size={22} className="text-emerald-300" />
              ) : (
                <XCircle size={22} className="text-red-300" />
              )}
            </div>
            <p className="flex-grow font-bold text-sm leading-tight">{toast.message}</p>
            <button className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
              <CloseIcon size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
