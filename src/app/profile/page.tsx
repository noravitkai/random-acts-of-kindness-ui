"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  useKindnessActs,
  createAct,
  updateAct,
  deleteAct,
} from "@/hooks/acts/useActs";
import { useAuth } from "@/hooks/auth/useAuth";
import type { KindnessAct, NewAct } from "@/types/kindnessAct";

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
        <Modal
          title="Share a Kindness Idea"
          onClose={() => setOpenAddModal(false)}
        >
          <KindnessForm
            submitLabel="Submit"
            onClose={() => setOpenAddModal(false)}
            onSuccess={refetch}
          />
        </Modal>
      )}

      {openEditModal && selectedAct && (
        <Modal
          title="Update Suggested Kindness Act"
          onClose={() => setOpenEditModal(false)}
        >
          <KindnessForm
            submitLabel="Save"
            onClose={() => setOpenEditModal(false)}
            initialData={selectedAct}
            onSuccess={refetch}
          />
        </Modal>
      )}

      {openDeleteModal && selectedAct && (
        <Modal
          title="Remove Act of Kindness"
          onClose={() => setOpenDeleteModal(false)}
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete this kindness idea? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="relative z-10 rounded-md border-2 border-black bg-background text-gray-900 px-4 py-2 text-sm font-semibold transition ease-in-out duration-300 hover:bg-secondary hover:text-background focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary focus:outline-none cursor-pointer"
                  onClick={async () => {
                    try {
                      await deleteAct(selectedAct._id);
                      setOpenDeleteModal(false);
                      refetch();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <Dialog open onClose={onClose} className="relative z-50">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />
    <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl transition-all w-full max-w-lg sm:p-6 data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="mb-4 flex items-center justify-between">
            <DialogTitle
              as="h3"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="w-6 h-6 text-gray-900 transition ease-in-out duration-300 hover:text-secondary" />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

const KindnessForm: React.FC<{
  submitLabel: string;
  onClose: () => void;
  initialData?: KindnessAct;
  onSuccess?: () => void;
}> = ({ submitLabel, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState<NewAct>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "easy",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (initialData) {
        await updateAct(initialData._id, {
          ...form,
          status: "pending",
        } as NewAct & { status: "pending" });
      } else {
        await createAct(form);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="Give the act a clear title"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what someone would do when completing"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
        />
      </div>
      <div>
        <label
          htmlFor="difficulty"
          className="block text-sm font-medium text-gray-700"
        >
          Difficulty
        </label>
        <select
          id="difficulty"
          name="difficulty"
          required
          value={form.difficulty}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4">
        <div className="relative group inline-block">
          <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 rounded-md border-2 border-black bg-background text-gray-900 px-4 py-2 text-sm font-semibold transition ease-in-out duration-300 hover:bg-secondary hover:text-background focus:outline-none cursor-pointer"
          >
            Cancel
          </button>
        </div>
        <div className="relative group inline-block">
          <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <button
            type="submit"
            disabled={submitting}
            className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary focus:outline-none cursor-pointer"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Page;
