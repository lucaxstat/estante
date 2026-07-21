'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 4200);
    return () => clearTimeout(timer);
  }, [onClose]);

  const className = ['toast', type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : 'toast-info'].join(' ');

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p>{message}</p>
        <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">Fechar</button>
      </div>
    </div>
  );
}
