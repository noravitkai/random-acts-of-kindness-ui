"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { deleteAct } from "@/hooks/acts/useActs";

interface ActDeleteProps {
  open: boolean;
  onClose: () => void;
  actId: string;
  onSuccess?: () => void;
}

/**
 * Called by admin from the dashboard. Calls deleteAct and handles close/success.
 * @param {ActDeleteProps} props – open state, act ID, and callback handlers
 * @returns {JSX.Element} – dialog modal for confirming and deleting acts
 */
export default function ActDelete({
  open,
  onClose,
  actId,
  onSuccess,
}: ActDeleteProps) {
  /**
   * Handles delete
   * Closes modal and triggers success callback if successful
   */
  const handleDelete = async () => {
    try {
      await deleteAct(actId);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  {
    /* ===== Delete Confirmation Modal ===== */
  }
  return (
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
                Remove Act of Kindness
              </DialogTitle>
              <button onClick={onClose} className="cursor-pointer">
                <XCircleIcon className="w-6 h-6 text-gray-900 hover:text-secondary transition duration-300" />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this kindness idea? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  onClick={onClose}
                  className="relative z-10 rounded-md border-2 border-black bg-background text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-secondary hover:text-background transition duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  onClick={handleDelete}
                  className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition duration-300 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
