"use client";

import React, { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useKindnessActs, useCompletedActs } from "@/hooks/acts/useActs";
import { useAuth } from "@/hooks/auth/useAuth";
import type { KindnessAct } from "@/types/kindnessAct";
import ActForm from "@/components/acts/ActForm";
import ActDelete from "@/components/acts/ActDelete";

const Page: React.FC = () => {
  const { acts, loading, error, refetch } = useKindnessActs();
  const { logout, user } = useAuth();
  const { completed } = useCompletedActs(user?.id || "");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAct, setSelectedAct] = useState<KindnessAct | null>(null);

  // Pagination state for card of completed acts
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const paginatedCompleted = completed.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section className="p-6 sm:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Kindness Score Card */}
          <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
            <div className="relative z-10 border-2 border-black rounded-lg bg-background p-6 h-full">
              <h2 className="text-lg font-bold mb-2">Total Kindness Score</h2>
              <p className="text-4xl font-extrabold text-primary">
                {completed.length}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                You&#39;ve completed {completed.length} acts of kindness
              </p>
              {completed.length > 0 ? (
                <p className="text-sm italic text-gray-500 mt-4 pl-2 border-l-4 border-primary">
                  You’re already making a difference – keep going!
                </p>
              ) : (
                <p className="text-sm italic text-gray-500 mt-4 pl-2 border-l-4 border-primary">
                  Even small kindness acts can make big differences.
                </p>
              )}
            </div>
          </div>

          {/* Completed Acts Card */}
          <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
            <div className="relative z-10 border-2 border-black rounded-lg bg-background p-6 h-full">
              <h2 className="text-lg font-bold mb-4">
                Completed Acts of Kindness
              </h2>
              {completed.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No kindness acts completed yet. Start with one small act
                  today.
                </p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {paginatedCompleted.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircleIcon className="w-5 h-5 mt-0.5 text-primary" />
                        <div className="flex flex-col">
                          <span>{item.act?.title || "Untitled"}</span>
                          <span className="text-xs text-gray-500">
                            Completed on{" "}
                            {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                      className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage((prev) =>
                          (prev + 1) * itemsPerPage >= completed.length
                            ? prev
                            : prev + 1
                        )
                      }
                      disabled={(page + 1) * itemsPerPage >= completed.length}
                      className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Saved Acts Card */}
          <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
            <div className="relative z-10 border-2 border-black rounded-lg bg-background p-6 sm:p-8 h-full">
              <h2 className="text-lg font-bold mb-2 text-foreground">
                Saved Acts of Kindness
              </h2>
              <p className="text-sm italic text-gray-400">Coming soon…</p>
            </div>
          </div>

          {/* Share Idea Card */}
          <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
            <div className="relative z-10 border-2 border-black rounded-lg bg-background p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-2 text-foreground">
                  Share a Kindness Idea
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Have a small or meaningful act of kindness in mind? You can
                  suggest it here so that you and others can complete it.
                  Let&#39;s build a kinder world together, one suggestion at a
                  time!
                  <FaceSmileIcon className="inline-block w-4 h-4 text-secondary align-middle ml-1" />
                </p>
              </div>
              <div className="flex justify-end">
                <div className="relative group inline-block">
                  <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <button
                    onClick={() => setOpenAddModal(true)}
                    className="relative z-10 flex items-start gap-x-2 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary cursor-pointer"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    Suggest a Kind Act
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Acts Table */}
        <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
          <div className="overflow-x-auto bg-background border-2 border-black rounded-lg shadow relative z-10">
            <table className="min-w-full text-sm text-foreground">
              <thead className="bg-primary text-foreground text-left uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-background font-bold">
                    Suggestions
                  </th>
                  <th className="px-6 py-4 text-background font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-background font-bold">Added</th>
                  <th className="px-6 py-4 text-background font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-6 py-4" colSpan={4}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-6 py-4 text-red-500" colSpan={4}>
                      {error}
                    </td>
                  </tr>
                ) : acts.length === 0 ? (
                  <tr>
                    <td className="px-6 py-4" colSpan={4}>
                      No kindness acts submitted yet.
                    </td>
                  </tr>
                ) : (
                  acts.map((act) => (
                    <tr key={act._id} className="border-t border-gray-300">
                      <td className="px-6 py-4">{act.title}</td>
                      <td className="px-6 py-4">{act.status}</td>
                      <td className="px-6 py-4">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {act.status === "approved" ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedAct(act);
                                setOpenEditModal(true);
                              }}
                              className="transition duration-300 hover:text-secondary cursor-pointer"
                              aria-label="Edit"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAct(act);
                                setOpenDeleteModal(true);
                              }}
                              className="transition duration-300 hover:text-secondary cursor-pointer"
                              aria-label="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled
                              className="opacity-40 cursor-not-allowed"
                              aria-label="Edit disabled"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              disabled
                              className="opacity-40 cursor-not-allowed"
                              aria-label="Delete disabled"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-6xl mx-auto flex justify-end">
        <div className="relative group inline-block">
          <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <button
            onClick={logout}
            className="relative z-10 flex items-start gap-x-2 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {openAddModal && (
        <ActForm
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={refetch}
          submitLabel="Submit"
        />
      )}

      {openEditModal && selectedAct && (
        <ActForm
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSuccess={refetch}
          initialData={selectedAct}
          submitLabel="Save"
        />
      )}

      {openDeleteModal && selectedAct && (
        <ActDelete
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          actId={selectedAct._id}
          onSuccess={refetch}
        />
      )}
    </section>
  );
};

export default Page;
