export const LoadingSpinner = () => {
  return (
    <div
      className="inline-block size-4 animate-spin rounded-full border-y-2 border-white"
      role="status"
    >
      <span className="sr-only">読み込み中...</span>
    </div>
  );
};
