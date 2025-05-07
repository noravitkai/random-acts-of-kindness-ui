"use client";

import type { KindnessAct } from "@/types/act";

interface ActCardProps {
  act: KindnessAct;
}

export default function ActCard({ act }: ActCardProps) {
  return (
    <div className="border rounded-md p-4 shadow-sm space-y-2">
      <h3 className="text-lg font-semibold">{act.title}</h3>
      <p className="text-sm text-zinc-600">{act.description}</p>
      <span className="inline-block bg-zinc-200 px-2 py-1 text-xs rounded">
        {act.difficulty}
      </span>
    </div>
  );
}
