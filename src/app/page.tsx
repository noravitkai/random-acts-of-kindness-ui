"use client";

import { useState, Fragment } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import ActCard from "@/components/acts/ActCard";
import { useKindnessActs } from "@/hooks/acts/useActs";
import { Transition } from "@headlessui/react";

export default function HomePage() {
  const { acts, loading, error } = useKindnessActs();

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleSaveAct = async (actId: string) => {
    try {
      const token = localStorage.getItem("lsToken");
      if (!token) {
        setNotification({
          type: "warning",
          message:
            "Oops! You need to log in to save acts. If you’re new here, first sign up!",
        });
        return;
      }

      const res = await fetch("http://localhost:4000/api/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ act: actId }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setNotification({
          type: "error",
          message: `Uh-oh! Something just went wrong: ${error}`,
        });
        return;
      }

      setNotification({
        type: "success",
        message: "Yay! Saved successfully. Keep spreading kindness!",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Uh-oh! An unexpected error occurred. Try again, please.",
      });
    }
  };

  if (loading) return <p className="p-8">Loading acts…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  if (acts.length === 0) return <p className="p-8">No acts found.</p>;

  return (
    <>
      <Transition
        show={!!notification}
        as={Fragment}
        enter="transform transition ease-out duration-300"
        enterFrom="translate-y-2 opacity-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 z-50 flex items-start px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end z-50">
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-background shadow-lg ring-1 ring-black/5 z-50">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    {notification?.type === "success" && (
                      <CheckCircleIcon className="w-6 h-6 text-primary" />
                    )}
                    {notification?.type === "error" && (
                      <ExclamationCircleIcon className="w-6 h-6 text-primary" />
                    )}
                    {notification?.type === "warning" && (
                      <ExclamationTriangleIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {notification?.message}
                    </p>
                    {notification?.type === "warning" && (
                      <div className="mt-2 flex gap-3">
                        <a
                          href="/login"
                          className="text-sm font-medium text-primary flex items-center gap-1 hover:text-secondary transition ease-in-out duration-300 cursor-pointer"
                        >
                          Login <span className="text-xs">→</span>
                        </a>
                        <a
                          href="/signup"
                          className="text-sm font-medium text-primary flex items-center gap-1 hover:text-secondary transition ease-in-out duration-300 cursor-pointer"
                        >
                          Signup <span className="text-xs">→</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => setNotification(null)}
                      className="inline-flex rounded-md bg-background text-gray-400 hover:text-gray-500 transition ease-in-out duration-300 cursor-pointer"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <main className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {acts.map((act) => (
          <ActCard key={act._id} act={act} onSave={handleSaveAct} />
        ))}
      </main>
    </>
  );
}
