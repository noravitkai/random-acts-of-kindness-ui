"use client";

import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { updateAct } from "@/hooks/acts/useActs";

interface ActStatusProps {
  open: boolean;
  onClose: () => void;
  actId: string;
  status: "approved" | "rejected";
  onSuccess?: () => void;
}

export default function ActStatus({
  open,
  onClose,
  actId,
  status,
  onSuccess,
}: ActStatusProps) {
  const verb = status === "approved" ? "Approve" : "Reject";
  const title = status === "approved" ? "Accept Idea" : "Deny Suggestion";
  const description =
    status === "approved"
      ? "Are you sure you want to approve this kindness act? It will become visible to everyone."
      : "Are you sure you want to reject this kindness act? It cannot be undone.";

  const handleConfirm = async () => {
    try {
      await updateAct(actId, { status });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

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
                {title}
              </DialogTitle>
              <button onClick={onClose} className="cursor-pointer">
                <XCircleIcon className="w-6 h-6 text-gray-900 hover:text-secondary transition duration-300" />
              </button>
            </div>
            <p className="mb-6">{description}</p>
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
                  onClick={handleConfirm}
                  className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition duration-300 cursor-pointer"
                >
                  {verb}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
