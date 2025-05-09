"use client";

import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { KindnessAct } from "@/types/act";

interface ActTableProps {
  acts: KindnessAct[];
  currentUserId?: string;
  isAdminView?: boolean;
  onEdit: (act: KindnessAct) => void;
  onDelete: (act: KindnessAct) => void;
}

export default function ActTable({
  acts,
  currentUserId,
  isAdminView = false,
  onEdit,
  onDelete,
}: ActTableProps) {
  const displayedActs = isAdminView
    ? acts
    : acts.filter((act) => act.createdBy?._id === currentUserId);

  return (
    <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
      <div className="overflow-x-auto bg-background border-2 border-black rounded-lg shadow relative z-10">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-left uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-background font-bold">
                Suggestions
              </th>
              <th className="px-6 py-4 text-background font-bold">Status</th>
              <th className="px-6 py-4 text-background font-bold">Added</th>
              <th className="px-6 py-4 text-background font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedActs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-left text-gray-500">
                  No suggestions yet. Share a kind act to get started!
                </td>
              </tr>
            ) : (
              displayedActs.map((act) => {
                const canEditOrDelete =
                  isAdminView || act.status === "approved";
                return (
                  <tr key={act._id} className="border-t border-gray-300">
                    <td className="px-6 py-4">{act.title}</td>
                    <td className="px-6 py-4">{act.status}</td>
                    <td className="px-6 py-4">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => onEdit(act)}
                        disabled={!canEditOrDelete}
                        className={`transition duration-300 hover:text-secondary ${
                          canEditOrDelete
                            ? "cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        aria-label="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(act)}
                        disabled={!canEditOrDelete}
                        className={`transition duration-300 hover:text-secondary ${
                          canEditOrDelete
                            ? "cursor-pointer"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        aria-label="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
