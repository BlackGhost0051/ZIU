import { AnimatePresence, motion } from 'framer-motion';
import { toastVariants } from '../animations';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface Props {
  toasts: Toast[];
}

const typeColors: Record<string, string> = {
  success: '#1a3a1a',
  error: '#3a0000',
  info: '#1a1a3a',
};

const typeBorders: Record<string, string> = {
  success: '#22c55e',
  error: '#e50914',
  info: '#0043FF',
};

export function ToastContainer({ toasts }: Props) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              background: typeColors[t.type ?? 'info'],
              border: `1px solid ${typeBorders[t.type ?? 'info']}`,
              borderRadius: 10,
              padding: '0.65rem 1.1rem',
              color: '#e8e8f0',
              fontSize: '0.9rem',
              minWidth: 220,
              maxWidth: 340,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
