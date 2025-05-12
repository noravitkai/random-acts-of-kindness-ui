"use client";

import { useState, useEffect, Fragment } from "react";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { BookmarkIcon, BookmarkSlashIcon } from "@heroicons/react/24/solid";
import ActCard from "@/components/acts/ActCard";
import { useKindnessActs, useSavedActs } from "@/hooks/acts/useActs";
import { useAuth } from "@/hooks/auth/useAuth";
import { Transition } from "@headlessui/react";

export default function HomePage() {
  const { acts, loading, error } = useKindnessActs();
  const { user } = useAuth();
  const { savedActs, refetch: refetchSavedActs } = useSavedActs();

  useEffect(() => {
    if (user?.id) {
      refetchSavedActs();
    }
  }, [user?.id, refetchSavedActs]);

  const [notification, setNotification] = useState<{
    type: "saved" | "unsaved" | "warning" | "error";
    message: string;
  } | null>(null);

  const handleSaveAct = async (actId: string) => {
    try {
      const token = localStorage.getItem("lsToken");

      if (!token || !user?.id || user.role === "admin") {
        setNotification({
          type: "warning",
          message:
            user?.role === "admin"
              ? "Admins cannot save acts."
              : "Oops! You need to log in to save acts. If you’re new here, first sign up!",
        });
        setTimeout(() => setNotification(null), 5000);
        return;
      }

      const savedAct = savedActs.find((saved) => saved.act._id === actId);
      const isAlreadySaved = !!savedAct;
      const endpoint = isAlreadySaved
        ? `http://localhost:4000/api/saved/${savedAct._id}`
        : "http://localhost:4000/api/saved";
      const method = isAlreadySaved ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: isAlreadySaved ? null : JSON.stringify({ act: actId }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setNotification({
          type: "error",
          message: `Uh-oh! Something just went wrong: ${error}`,
        });
        setTimeout(() => setNotification(null), 5000);
        return;
      }

      refetchSavedActs();

      if (isAlreadySaved) {
        setNotification({
          type: "unsaved",
          message:
            "Unsaved! Removed from your saved list. You can always come back to it.",
        });
      } else {
        setNotification({
          type: "saved",
          message: "Yay! Saved successfully. Keep spreading kindness!",
        });
      }

      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Uh-oh! An unexpected error occurred. Try again, please.",
      });
      setTimeout(() => setNotification(null), 5000);
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
                    {notification?.type === "saved" && (
                      <BookmarkIcon className="w-6 h-6 text-primary" />
                    )}
                    {notification?.type === "unsaved" && (
                      <BookmarkSlashIcon className="w-6 h-6 text-primary" />
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
      <main className="p-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-2xl font-bold">
            Random Acts of Kindness <span className="text-primary">•</span> A
            Journey to a Kinder World
          </h1>
          <p className="mt-2 max-w-4xl text-base text-gray-600">
            Save simple kindness missions, sign up or log in to complete them,
            and suggest your own – track your progress and inspire others along
            the way.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {acts.map((act) => (
            <ActCard
              key={act._id}
              act={act}
              onSave={handleSaveAct}
              isSaved={savedActs.some((saved) => saved.act._id === act._id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
