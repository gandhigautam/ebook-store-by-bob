import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const STYLES = {
  success: 'bg-green-900/40 border-green-600 text-green-300',
  error: 'bg-red-900/40 border-red-600 text-red-300',
  info: 'bg-blue-900/40 border-blue-600 text-blue-300',
  warning: 'bg-yellow-900/40 border-yellow-600 text-yellow-300',
};

export default function Alert({ type, message, onDismiss, className }: AlertProps) {
  const Icon = ICONS[type];
  return (
    <div className={clsx('flex items-start gap-3 border rounded-lg px-4 py-3 text-sm', STYLES[type], className)}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
