export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <span className="text-red-500 text-xl">!</span>
      </div>
      <p className="text-slate-700 font-medium">Something went wrong</p>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">
        {message || 'Please try again in a moment.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
