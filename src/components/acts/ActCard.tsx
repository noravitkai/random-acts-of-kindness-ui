"use client";

import { useState, useEffect, ReactNode } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { KindnessAct } from "@/types/act";

interface ActCardProps {
  act: KindnessAct;
  isSaved?: boolean;
  onSave: (actId: string) => void;
  children?: ReactNode;
}

export default function ActCard({
  act,
  isSaved = false,
  onSave,
  children,
}: ActCardProps) {
  const [saved, setSaved] = useState(isSaved);

  useEffect(() => {
    setSaved(isSaved);
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
            <button
              onClick={() => {
                onSave(act._id);
                setSaved(!saved);
              }}
              aria-label={saved ? "Unsave Act" : "Save Act"}
              className="transition-transform ease-in-out duration-300 cursor-pointer"
            >
              {saved ? (
                <HeartSolid className="w-6 h-6 text-primary transform transition-transform duration-300 ease-in-out hover:scale-110" />
              ) : (
                <HeartOutline className="w-6 h-6 text-gray-400 transform transition-transform duration-300 ease-in-out hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
