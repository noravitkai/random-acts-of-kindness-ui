"use client";

import React, { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useKindnessActs } from "@/hooks/acts/useActs";
import { useAuth } from "@/hooks/auth/useAuth";
import type { KindnessAct } from "@/types/kindnessAct";
import ActForm from "@/components/acts/ActForm";
import ActDelete from "@/components/acts/ActDelete";

const Page: React.FC = () => {
  const { acts, loading, error, refetch } = useKindnessActs();
  const { logout } = useAuth();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAct, setSelectedAct] = useState<KindnessAct | null>(null);

  return (
    <section className="p-6 sm:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Act Ideas You’ve Shared
          </h1>
          <div className="relative group inline-block">
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <button
              onClick={() => setOpenAddModal(true)}
              className="relative z-10 flex items-start gap-x-2 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary cursor-pointer"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Suggest Act
            </button>
          </div>
        </div>

        <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
          <div className="overflow-x-auto bg-background border-2 border-black rounded-lg shadow relative z-10">
            <table className="min-w-full text-sm text-foreground">
              <thead className="bg-primary text-foreground text-left uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-background font-bold">Title</th>
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
