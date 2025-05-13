import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface FetchStatusProps {
  loading: boolean;
  error: string | null;
  loadingMessage?: string;
  errorMessagePrefix?: string;
}

export default function FetchStatus({
  loading,
  error,
  loadingMessage = "Loading…",
  errorMessagePrefix = "Error:",
}: FetchStatusProps) {
  if (loading || error) {
    return (
      <main className="p-6 sm:p-10 min-h-screen">
        <div className="max-w-7xl mx-auto flex items-center justify-start">
          <p className="text-xl flex items-center gap-2 text-gray-900 font-medium">
            {loading ? (
              <ArrowPathIcon
                className="w-6 h-6 text-primary animate-spin [animation-duration:2s]"
                strokeWidth={2}
              />
            ) : (
              <ExclamationCircleIcon
                className="w-6 h-6 text-primary"
                strokeWidth={2}
              />
            )}
            {loading ? loadingMessage : `${errorMessagePrefix} ${error}`}
          </p>
        </div>
      </main>
    );
  }
  return null;
}
