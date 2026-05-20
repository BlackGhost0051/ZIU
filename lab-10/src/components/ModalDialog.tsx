import { FocusTrap } from './FocusTrap';

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function ModalDialog({ isOpen, onClose, title, children, triggerRef }: ModalDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <FocusTrap onEscape={onClose} triggerRef={triggerRef}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: '2rem',
            maxWidth: 480,
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <h2
            id="modal-title"
            style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}
          >
            {title}
          </h2>
          <div>{children}</div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Zamknij
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
