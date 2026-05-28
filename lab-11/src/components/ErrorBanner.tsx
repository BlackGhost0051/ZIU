interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="error-banner" role="alert">
      <span>⚠️ {message}</span>
      <button onClick={onRetry} className="retry-btn">Spróbuj ponownie</button>
    </div>
  );
}
