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
import Header from "@/components/layout/Header";

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
      <main>
        <section className="p-8 sm:p-10 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Header
              title="Admin Panel and Tools"
              description="Manage, approve, reject, edit, moderate, and guide user-contributed ideas of kindness to keep the community inspired."
              buttons={[
                {
                  label: (
                    <>
                      <PlusCircleIcon className="w-5 h-5" />
                      Add an Act
                    </>
                  ),
                  onClick: () => setOpenAddModal(true),
                },
                {
                  label: "Logout",
                  onClick: logout,
                  primary: true,
                },
              ]}
            />
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
        </section>
      </main>
      <Footer />
    </>
  );
}
