import { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/utils/fetcher";
import type { KindnessAct, NewAct, CompletedAct, SavedAct } from "@/types/act";

/**
 * Fetch approved kindness acts
 * @returns an object containing:
 *   - acts: array of approved KindnessAct items
 *   - loading: boolean indicating fetch in progress
 *   - error: string error message or null
 *  - refetch: function to manually refresh
 */
export function useKindnessActs(userId?: string) {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActs = useCallback(() => {
    setLoading(true);
    const url = userId
      ? `http://localhost:4000/api/acts/user`
      : "http://localhost:4000/api/acts";

    const options = userId
      ? {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("lsToken") || "",
          },
        }
      : {};

    fetcher<KindnessAct[]>(url, options)
      .then((data) => {
        setActs(data || []);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchActs();
  }, [fetchActs]);

  return { acts, loading, error, refetch: fetchActs };
}

/**
 * Fetch the list of acts a user has completed
 * @param userId – ID of the specific user
 * @returns an object containing:
 *  - completed: array of CompletedAct items
 * - loading: boolean indicating fetch in progress
 * - error: string error message or null
 * - refetch: function to manually refresh
 */
export function useCompletedActs(userId: string) {
  const [completed, setCompleted] = useState<CompletedAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompleted = useCallback(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID is required to fetch completed acts.");
      return;
    }

    setLoading(true);

    fetcher<CompletedAct[]>(`http://localhost:4000/api/completed/${userId}`)
      .then((data) => {
        setCompleted(data || []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchCompleted();
  }, [fetchCompleted]);

  return { completed, loading, error, refetch: fetchCompleted };
}

/**
 * Fetch the list of acts a user has saved
 * @returns an object containing:
 *   - savedActs: array of SavedAct items
 *   - loading: boolean indicating fetch in progress
 *   - error: string error message or null
 *   - refetch: function to manually refresh
 */
export function useSavedActs() {
  const [savedActs, setSavedActs] = useState<SavedAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedActs = useCallback(() => {
    setLoading(true);

    fetcher<SavedAct[]>("http://localhost:4000/api/saved", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("lsToken") || "",
      },
    })
      .then((data) => {
        setSavedActs(data || []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSavedActs();
  }, [fetchSavedActs]);

  /**
   * Unsave act (without marking it as completed)
   * @param savedId – ID of the saved act to unsave
   * @returns message from the server
   */
  async function unsaveAct(savedId: string): Promise<{ message: string }> {
    const result = await fetcher<{ message: string }>(
      `http://localhost:4000/api/saved/${savedId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lsToken") || "",
        },
      }
    );
    if (!result) {
      throw new Error("Failed to unsave act: no response from server.");
    }
    return result;
  }

  /**
   * Mark a saved act as completed
   * @param savedId – ID of the saved act to mark as completed
   * @returns message from the server
   */
  async function completeAct(savedId: string): Promise<{ message: string }> {
    const result = await fetcher<{ message: string }>(
      `http://localhost:4000/api/saved/${savedId}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lsToken") || "",
        },
      }
    );
    if (!result) {
      throw new Error("Failed to complete act: no response from server.");
    }
    return result;
  }

  return {
    savedActs,
    loading,
    error,
    refetch: fetchSavedActs,
    unsaveAct,
    completeAct,
  };
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
