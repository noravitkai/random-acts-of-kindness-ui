"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { createAct, updateAct } from "@/hooks/acts/useActs";
import type { KindnessAct, NewAct } from "@/types/act";

interface ActFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  submitLabel: string;
  initialData?: KindnessAct;
}

/**
 * Form modal for suggesting or editing a kindness act.
 * Used by both users and admins, depending on the role.
 * @param {ActFormProps} props – open state, form mode, and callbacks
 * @returns {JSX.Element}
 */
export default function ActForm({
  open,
  onClose,
  onSuccess,
  submitLabel,
  initialData,
}: ActFormProps) {
  const token = localStorage.getItem("lsToken") || "";
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isAdmin = decodedToken?.role === "admin";

  const [form, setForm] = useState<NewAct>(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "easy",
  }));

  // reset form when modal opens or initialData changes
  React.useEffect(() => {
    setForm({
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficulty: initialData?.difficulty || "easy",
    });
  }, [open, initialData]);

  const [submitting, setSubmitting] = useState(false);

  /**
   * Handles input change and updates form state.
   * @param {React.ChangeEvent} e – input field event
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits the form – creates or updates a kindness act.
   * Adds status depending on whether user is an admin or not.
   * @param {React.FormEvent} e – the form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (initialData) {
        const updatedAct = isAdmin
          ? { ...form, status: "approved" }
          : { ...form, status: "pending" };
        await updateAct(initialData._id, updatedAct as NewAct);
      } else {
        const newAct = isAdmin
          ? { ...form, status: "approved" }
          : { ...form, status: "pending" };
        await createAct(newAct);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ===== Add/Edit Form Modal ===== */}
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-gray-900"
                >
                  {initialData
                    ? "Update Suggested Kindness Act"
                    : "Share a Kindness Idea"}
                </DialogTitle>
                <button onClick={onClose} className="cursor-pointer">
                  <XCircleIcon className="w-6 h-6 text-gray-900 hover:text-secondary transition duration-300" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Describe what someone would do when completing it"
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
                      className="relative z-10 rounded-md border-2 border-black bg-background text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-secondary hover:text-background transition duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="relative group inline-block">
                    <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition duration-300 cursor-pointer"
                    >
                      {submitting ? "Saving..." : submitLabel}
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
