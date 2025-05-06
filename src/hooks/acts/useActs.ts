import { useState, useEffect } from "react";
import { fetcher } from "@/utils/fetcher";
import type { KindnessAct, NewAct } from "@/types/kindnessAct";
import type { CompletedAct } from "@/types/completedAct";

/**
 * Fetch approved kindness acts
 * @returns an object containing:
 *   - acts: array of approved KindnessAct items
 *   - loading: boolean indicating fetch in progress
 *   - error: string error message or null
 */
export function useKindnessActs() {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActs = () => {
    setLoading(true);
    fetcher<KindnessAct[]>("http://localhost:4000/api/acts")
      .then((data) => {
        setActs(data || []);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActs();
  }, []);

  return { acts, loading, error, refetch: fetchActs };
}

/**
 * Fetch the list of acts a user has completed
 * @param userId – ID of the specific user
 */
export function useCompletedActs(userId: string) {
  const [completed, setCompleted] = useState<CompletedAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetcher<CompletedAct[]>(`http://localhost:4000/api/completed/${userId}`)
      .then((data) => {
        if (data) {
          setCompleted(data);
        } else {
          setError("No completed acts found");
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { completed, loading, error };
}

/**
 * Create a new act
 * @param payload – NewAct containing title, description, category, and difficulty
 * @returns the created KindnessAct object from the server
 * @throws Error if the server returns no data
 */
export async function createAct(payload: NewAct): Promise<KindnessAct> {
  const result = await fetcher<KindnessAct>("http://localhost:4000/api/acts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!result) {
    throw new Error("Failed to create: no data returned.");
  }
  return result;
}

/**
 * Update an existing act
 * @param id – ID of the act to update
 * @param payload – NewAct payload with updated fields
 * @returns an object with:
 *   - message: confirmation from the server
 *   - updatedAct: the updated KindnessAct object
 * @throws Error if the server response is null
 */
export async function updateAct(
  id: string,
  payload: NewAct & { status?: "pending" | "approved" | "rejected" }
): Promise<{ message: string; updatedAct: KindnessAct }> {
  const result = await fetcher<{ message: string; updatedAct: KindnessAct }>(
    `http://localhost:4000/api/acts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
  if (result == null) {
    throw new Error("Failed to update act: no response from server.");
  }
  return result;
}

/**
 * Delete a kindness act
 * @param id – ID of the act to delete
 * @returns an object with:
 *   - message: confirmation from the server
 * @throws Error if the server response is null
 */
export async function deleteAct(id: string): Promise<{ message: string }> {
  const result = await fetcher<{ message: string }>(
    `http://localhost:4000/api/acts/${id}`,
    { method: "DELETE" }
  );
  if (result == null) {
    throw new Error("Failed to delete: no response from server.");
  }
  return result;
}
