import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

interface FocusTrapProps {
  children: React.ReactNode;
  onEscape?: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function FocusTrap({ children, onEscape, triggerRef }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
        .filter(el => !el.closest('[aria-hidden="true"]'));

    const firstFocusable = getFocusable()[0];
    firstFocusable?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Escape') {
        onEscape?.();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [onEscape, triggerRef]);

  return <div ref={containerRef}>{children}</div>;
}
