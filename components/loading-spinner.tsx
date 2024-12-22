export function LoadingSpinner() {
  return (
    <div
      className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"
      role="status"
    >
      <span className="sr-only">読み込み中...</span>
    </div>
  );
}
