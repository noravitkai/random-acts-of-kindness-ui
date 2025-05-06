"use client";

import ActCard from "@/components/acts/ActCard";
import { useKindnessActs } from "@/hooks/acts/useActs";

export default function HomePage() {
  const { acts, loading, error } = useKindnessActs();

  if (loading) return <p className="p-8">Loading acts…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  if (acts.length === 0) return <p className="p-8">No acts found.</p>;

  return (
    <main className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {acts.map((act) => (
        <ActCard key={act._id} act={act} />
      ))}
    </main>
  );
}
