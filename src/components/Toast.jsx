import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, isExiting: false }]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, isExiting: true } : t)
      );
      // Remove from DOM after animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, isExiting: true } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { id, message, type, isExiting } = toast;

  const bgColor = {
    info: 'bg-amber-100 border-amber-300 text-amber-900',
    success: 'bg-green-100 border-green-300 text-green-900',
    error: 'bg-red-100 border-red-300 text-red-900',
    warning: 'bg-orange-100 border-orange-300 text-orange-900',
  }[type] || 'bg-amber-100 border-amber-300 text-amber-900';

  const icon = {
    info: '💡',
    success: '✓',
    error: '✕',
    warning: '⚠',
  }[type] || '💡';

  return (
    <div
      className={`
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        ${bgColor}
        px-4 py-3 rounded-xl border shadow-lg
        flex items-center gap-3
        pointer-events-auto
        min-w-[280px] max-w-[90vw]
      `}
      role="alert"
    >
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-current opacity-60 hover:opacity-100 transition-opacity p-1"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
