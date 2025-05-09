"use client";

import React, { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { KindnessAct } from "@/types/act";

interface ActTableProps {
  acts: KindnessAct[];
  currentUserId?: string;
  isAdminView?: boolean;
  onEdit: (act: KindnessAct) => void;
  onDelete: (act: KindnessAct) => void;
  onApprove?: (act: KindnessAct) => void;
  onReject?: (act: KindnessAct) => void;
}

export default function ActTable({
  acts,
  currentUserId,
  isAdminView = false,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: ActTableProps) {
  const displayedActs = isAdminView
    ? acts
    : acts.filter((act) => act.createdBy?._id === currentUserId);

  const actsToRender = [...displayedActs].sort((a, b) => {
    if (isAdminView) {
      const statusOrder =
        (a.status === "pending" ? 0 : 1) - (b.status === "pending" ? 0 : 1);
      if (statusOrder !== 0) return statusOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const [page, setPage] = useState(0);
  const itemsPerPage = 20;
  const paginatedActs = actsToRender.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

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
            {actsToRender.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-left text-gray-500">
                  No suggestions yet. Share a kind act to get started!
                </td>
              </tr>
            ) : (
              paginatedActs.map((act) => {
                const canEditOrDelete =
                  isAdminView || act.status === "approved";
                const isPending = isAdminView && act.status === "pending";
                return (
                  <tr
                    key={act._id}
                    className={`border-t border-gray-300 ${
                      isAdminView && act.status === "pending"
                        ? "bg-primary/10"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4">{act.title}</td>
                    <td className="px-6 py-4">{act.status}</td>
                    <td className="px-6 py-4">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => onApprove?.(act)}
                            className="transition duration-300 hover:text-green-600 cursor-pointer"
                            title="Approve"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onReject?.(act)}
                            className="transition duration-300 hover:text-red-600 cursor-pointer"
                            title="Reject"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
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
        <div className="flex justify-center p-4 space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPage((p) =>
                (p + 1) * itemsPerPage >= actsToRender.length ? p : p + 1
              )
            }
            disabled={(page + 1) * itemsPerPage >= actsToRender.length}
            className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
