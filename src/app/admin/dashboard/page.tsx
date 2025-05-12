"use client";
import React, { useState } from "react";
import ActStatus from "@/components/acts/ActStatus";
import { useAuth } from "@/hooks/auth/useAuth";
import ActTable from "@/components/acts/ActTable";
import { useAllActs } from "@/hooks/acts/useActs";
import ActForm from "@/components/acts/ActForm";
import ActDelete from "@/components/acts/ActDelete";
import { KindnessAct } from "@/types/act";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/layout/Footer";

export default function Dashboard() {
  const { logout } = useAuth();
  const { acts, refetch } = useAllActs();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAct, setSelectedAct] = useState<KindnessAct | null>(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusModalAct, setStatusModalAct] = useState<KindnessAct | null>(
    null
  );
  const [statusAction, setStatusAction] = useState<"approved" | "rejected">(
    "approved"
  );

  return (
    <>
      <main className="p-6 sm:p-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="w-full flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Dashboard
            </h1>
            <div className="flex gap-4">
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  onClick={logout}
                  className="relative z-10 flex items-center gap-x-2 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary cursor-pointer"
                >
                  Logout
                </button>
              </div>
              <div className="relative group inline-block">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <button
                  onClick={() => setOpenAddModal(true)}
                  className="relative z-10 flex items-center gap-x-2 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background transition ease-in-out duration-300 hover:bg-secondary cursor-pointer"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add an Act
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full max-w-7xl">
            <ActTable
              acts={acts}
              isAdminView
              onEdit={(act) => {
                setSelectedAct(act);
                setOpenEditModal(true);
              }}
              onDelete={(act) => {
                setSelectedAct(act);
                setOpenDeleteModal(true);
              }}
              onApprove={(act) => {
                setStatusModalAct(act);
                setStatusAction("approved");
                setOpenStatusModal(true);
              }}
              onReject={(act) => {
                setStatusModalAct(act);
                setStatusAction("rejected");
                setOpenStatusModal(true);
              }}
            />
            <ActForm
              open={openAddModal}
              onClose={() => setOpenAddModal(false)}
              onSuccess={refetch}
              submitLabel="Submit"
            />
            {selectedAct && (
              <>
                <ActForm
                  open={openEditModal}
                  onClose={() => {
                    setOpenEditModal(false);
                    setSelectedAct(null);
                  }}
                  onSuccess={refetch}
                  initialData={selectedAct}
                  submitLabel="Save"
                />
                <ActDelete
                  open={openDeleteModal}
                  onClose={() => {
                    setOpenDeleteModal(false);
                    setSelectedAct(null);
                  }}
                  actId={selectedAct._id}
                  onSuccess={refetch}
                />
              </>
            )}
            {statusModalAct && (
              <ActStatus
                open={openStatusModal}
                onClose={() => setOpenStatusModal(false)}
                actId={statusModalAct._id}
                status={statusAction}
                onSuccess={() => {
                  refetch();
                  setOpenStatusModal(false);
                }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
