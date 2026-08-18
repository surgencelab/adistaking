'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Toast, type ToastTone } from '@/components/ui/Toast';

interface ToastItem {
  id: number;
  tone: ToastTone;
  title?: string;
  message: ReactNode;
}

type PushToast = (message: ReactNode, tone?: ToastTone, title?: string) => void;

const ToastContext = createContext<PushToast>(() => {});

const LIFETIME_MS = 4_200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback<PushToast>((message, tone = 'info', title) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), LIFETIME_MS);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 200,
        }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title}>
            {t.message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
