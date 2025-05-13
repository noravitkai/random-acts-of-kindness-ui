"use client";

import { ReactNode } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { KindnessAct } from "@/types/act";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState, useEffect } from "react";

interface ActCardProps {
  act: KindnessAct;
  isSaved: boolean;
  onSave: (actId: string) => void;
  children?: ReactNode;
}

export default function ActCard({
  act,
  isSaved,
  onSave,
  children,
}: ActCardProps) {
  const { user } = useAuth();

  const [savedState, setSavedState] = useState(isSaved);
  useEffect(() => {
    setSavedState(isSaved);
  }, [isSaved]);

  return (
    <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
      <div className="relative z-10 border-2 border-black rounded-lg bg-background p-6 h-full flex flex-col">
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-start mb-4">
              <h2 className="text-lg font-bold flex-1">{act.title}</h2>
              <div className="relative inline-block ml-4 shrink-0">
                <span className="relative z-10 px-3 py-1 text-xs font-semibold text-background bg-secondary rounded-md">
                  {act.difficulty.charAt(0).toUpperCase() +
                    act.difficulty.slice(1)}
                </span>
                <div className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-md border-2 border-dashed border-black z-0"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{act.description}</p>
          </div>

          {children && <div className="mt-4">{children}</div>}

          <div className="flex justify-start mt-4">
            {user?.role !== "admin" && (
              <button
                onClick={() => {
                  setSavedState((prev) => !prev);
                  onSave(act._id);
                }}
                aria-label={savedState ? "Unsave Act" : "Save Act"}
                className="relative group transition-transform ease-in-out duration-300 cursor-pointer"
              >
                {/* Heart Icon */}
                {savedState ? (
                  <HeartSolid className="w-6 h-6 text-primary transform transition-transform duration-300 ease-in-out hover:scale-110" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-gray-400 transform transition-transform duration-300 ease-in-out hover:scale-110" />
                )}

                {/* Tooltip */}
                <div
                  className={`absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded px-3 py-[4px] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ${
                    savedState
                      ? "bg-primary text-background"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  <span
                    className={`absolute left-[-4px] top-1/2 -translate-y-1/2 -rotate-45 w-2 h-2 transform origin-center ${
                      savedState ? "bg-primary" : "bg-gray-400"
                    }`}
                  ></span>
                  {savedState ? "Unsave" : "Save"}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
