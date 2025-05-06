import { useState, useEffect } from "react";
import { fetcher } from "@/utils/fetcher";
import type { KindnessAct } from "@/types/act";

export function useActs() {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher<KindnessAct[]>("http://localhost:4000/api/acts")
      .then((data) => {
        const approved = data?.filter((a) => a.status === "approved") || [];
        setActs(approved);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { acts, loading, error };
}
