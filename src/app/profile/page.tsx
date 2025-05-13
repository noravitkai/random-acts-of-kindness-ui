"use client";

import React, { useState } from "react";
import { PlusCircleIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  useUserActs,
  useCompletedActs,
  useSavedActs,
} from "@/hooks/acts/useActs";
import { useAuth } from "@/hooks/auth/useAuth";
import type { KindnessAct, SavedAct, CompletedAct } from "@/types/act";
import ActForm from "@/components/acts/ActForm";
import ActDelete from "@/components/acts/ActDelete";
import ActTable from "@/components/acts/ActTable";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

const Page: React.FC = () => {
  const { logout, user } = useAuth();
  const { acts, refetch } = useUserActs();
  const router = useRouter();

  const [savedActs, setSavedActs] = useState<SavedAct[]>([]);
  const [completed, setCompleted] = useState<CompletedAct[]>([]);

  const {
    savedActs: savedActsData,
    refetch: refetchSavedActs,
    loading: loadingSaved,
  } = useSavedActs();
  const { completed: completedData, loading: loadingCompleted } =
    useCompletedActs(user?.id || "");

  React.useEffect(() => {
    if (savedActsData !== undefined) setSavedActs(savedActsData);
  }, [savedActsData]);

  React.useEffect(() => {
    if (completedData !== undefined) setCompleted(completedData);
  }, [completedData]);

  const handleMarkAsCompleted = async (savedAct: SavedAct) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/saved/${savedAct._id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("lsToken") || "",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to mark act as completed");
        const errorData = await res.json();
        console.error("Error details:", errorData);
        return;
      }

      const updatedSavedActs = savedActs.filter(
        (act) => act._id !== savedAct._id
      );
      const newCompletedAct: CompletedAct = {
        _id: savedAct._id,
        act: savedAct.act,
        title: savedAct.title,
        description: savedAct.description,
        category: savedAct.category,
        difficulty: savedAct.difficulty,
        completedAt: new Date().toISOString(),
      };

      await refetchSavedActs();
      await refetch();

      setSavedActs(updatedSavedActs);
      setCompleted((prevCompleted) => [newCompletedAct, ...prevCompleted]);
    } catch (error) {
      console.error("Error marking act as completed:", error);
    }
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAct, setSelectedAct] = useState<KindnessAct | null>(null);

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const paginatedCompleted = [...completed]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const [savedPage, setSavedPage] = useState(0);
  const savedItemsPerPage = 3;
  const paginatedSavedActs = [...savedActs]
    .sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    )
    .slice(
      savedPage * savedItemsPerPage,
      savedPage * savedItemsPerPage + savedItemsPerPage
    );

  return (
    <>
      <section className="p-8 sm:p-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Header
            title={<>Hello, Kind Soul!</>}
            description="Make kindness a daily habit! Keep track of your saved and completed kindness acts, celebrate, and share your ideas to keep kindness going."
            buttons={[
              { label: "Home", onClick: () => router.push("/") },
              { label: "Logout", onClick: logout, primary: true },
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Kindness Score Card */}
            <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
              <div className="relative z-10 border-2 border-black rounded-lg bg-background p-8 h-full">
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
              <div className="relative z-10 border-2 border-black rounded-lg bg-background p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-2">
                    Completed Acts of Kindness
                  </h2>
                  {loadingCompleted ? (
                    <p className="text-sm text-gray-500">
                      Loading list of completed kindness acts…
                    </p>
                  ) : completed.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No kindness acts completed yet. Start with one small act
                      today!
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {paginatedCompleted.map((item: CompletedAct) => (
                        <li
                          key={item._id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircleIcon className="w-5 h-5 mt-0.5 text-primary" />
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-gray-500">
                              Completed on{" "}
                              {new Date(item.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-2">
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Saved Acts Card */}
            <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
              <div className="relative z-10 border-2 border-black rounded-lg bg-background p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-2">
                    Saved Acts of Kindness
                  </h2>
                  {loadingSaved ? (
                    <p className="text-sm text-gray-500">
                      Loading list of saved kindness acts…
                    </p>
                  ) : savedActs.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No saved acts here yet – add some acts from the collection
                      and let the good vibes roll!
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {paginatedSavedActs.map((savedAct: SavedAct) => (
                        <li
                          key={savedAct._id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <button
                            onClick={() => handleMarkAsCompleted(savedAct)}
                            className="flex items-center justify-center w-4 h-4 mt-0.5 border-2 border-primary rounded-full cursor-pointer transition duration-300 ease-in-out hover:bg-primary group"
                            aria-label="Mark as completed"
                          >
                            <CheckIcon className="w-2.5 h-2.5 text-transparent group-hover:text-background transition-all duration-300 ease-in-out stroke-[3]" />
                          </button>
                          <div className="flex flex-col">
                            <span>{savedAct.title}</span>
                            <span className="text-xs text-gray-500">
                              Saved on{" "}
                              {new Date(savedAct.savedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    onClick={() =>
                      setSavedPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={savedPage === 0}
                    className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setSavedPage((prev) =>
                        (prev + 1) * savedItemsPerPage >= savedActs.length
                          ? prev
                          : prev + 1
                      )
                    }
                    disabled={
                      (savedPage + 1) * savedItemsPerPage >= savedActs.length
                    }
                    className="text-sm font-medium text-gray-600 hover:text-secondary transition ease-in-out duration-300 disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Share Idea Card */}
            <div className="relative before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border-2 before:border-dashed before:border-black before:content-['']">
              <div className="relative z-10 border-2 border-black rounded-lg bg-background p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-2">
                    Share a Kindness Idea
                  </h2>
                  <p className="text-sm text-gray-600">
                    Have a small or meaningful act of kindness in mind? You can
                    suggest it here so that you and others can complete it.
                    Let&#39;s build a kinder world together, one suggestion at a
                    time!
                    <FaceSmileIcon className="inline-block w-4 h-4 text-secondary align-middle ml-1" />
                  </p>
                </div>
                <div className="flex justify-end mt-2">
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
          <ActTable
            acts={acts}
            currentUserId={user?.id}
            onEdit={(act) => {
              setSelectedAct(act);
              setOpenEditModal(true);
            }}
            onDelete={(act) => {
              setSelectedAct(act);
              setOpenDeleteModal(true);
            }}
          />
        </div>

        <ActForm
          open={openAddModal}
          onClose={() => {
            setOpenAddModal(false);
            setSelectedAct(null);
          }}
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
      </section>
      <Footer />
    </>
  );
};

export default Page;
