import { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/utils/fetcher";
import type { KindnessAct, NewAct, CompletedAct, SavedAct } from "@/types/act";

// ===== Public =====

/**
 * Loads approved acts for homepage
 * @returns acts, loading, error, refetch
 */
export function useKindnessActs() {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = "https://random-acts-of-kindness-api.onrender.com/api/acts";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lsToken") || "",
        },
      };
      const data = await fetcher<KindnessAct[]>(url, options);
      setActs(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActs();
  }, [fetchActs]);

  return { acts, loading, error, refetch: fetchActs };
}

// ===== Authenticated User =====

/**
 * Loads acts created by the logged-in user
 * @returns acts, loading, error, refetch
 */
export function useUserActs() {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserActs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        "https://random-acts-of-kindness-api.onrender.com/api/acts/user";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lsToken") || "",
        },
      };
      const data = await fetcher<KindnessAct[]>(url, options);
      setActs(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserActs();
  }, [fetchUserActs]);

  return { acts, loading, error, refetch: fetchUserActs };
}

/**
 * Loads completed acts for the given user
 * @param userId – user’s ID
 * @returns completed acts of kindness, loading, error, refetch
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

    fetcher<CompletedAct[]>(
      `https://random-acts-of-kindness-api.onrender.com/api/completed/${userId}`
    )
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
 * Loads acts the given user has saved
 * @returns saved acts of kindness, loading, error, helpers
 */
export function useSavedActs() {
  const [savedActs, setSavedActs] = useState<SavedAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedActs = useCallback(() => {
    setLoading(true);

    fetcher<SavedAct[]>(
      "https://random-acts-of-kindness-api.onrender.com/api/saved",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lsToken") || "",
        },
      }
    )
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
   * Unsaves act (without marking it as completed)
   * @param savedId – ID of the saved act to unsave
   * @returns message from the server
   */
  async function unsaveAct(savedId: string): Promise<{ message: string }> {
    const result = await fetcher<{ message: string }>(
      `https://random-acts-of-kindness-api.onrender.com/api/saved/${savedId}`,
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
   * Marks a saved act as completed
   * @param savedId – ID of the saved act to mark as completed
   * @returns message from the server
   */
  async function completeAct(savedId: string): Promise<{ message: string }> {
    const result = await fetcher<{ message: string }>(
      `https://random-acts-of-kindness-api.onrender.com/api/saved/${savedId}/complete`,
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

// ===== Admin-Only =====

/**
 * Loads all acts for admin dashboard
 * @returns acts, loading, error, refetch
 */
export function useAllActs() {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllActs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher<KindnessAct[]>(
        "https://random-acts-of-kindness-api.onrender.com/api/acts/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("lsToken") || "",
          },
        }
      );
      setActs(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActs();
  }, [fetchAllActs]);

  return { acts, loading, error, refetch: fetchAllActs };
}

// ===== CRUD =====

/**
 * Creates new kindness act with a status depending on the user role
 * @param payload – new act details
 * @returns the created act from the server
 */
export async function createAct(payload: NewAct): Promise<KindnessAct> {
  const token = localStorage.getItem("lsToken") || "";
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const isAdmin = decodedToken.role === "admin";

  // Force pending status for non-admins
  const actPayload = isAdmin ? payload : { ...payload, status: "pending" };

  const result = await fetcher<KindnessAct>(
    "https://random-acts-of-kindness-api.onrender.com/api/acts",
    {
      method: "POST",
      body: JSON.stringify(actPayload),
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }
  );
  if (!result) {
    throw new Error("Failed to create: no data returned.");
  }
  return result;
}

/**
 * Updates an existing act with a satus depending on the user role
 * @param id – act ID
 * @param payload – details of the updated kindness act
 * @returns message with updated act
 */
export async function updateAct(
  id: string,
  payload: Partial<NewAct> & { status?: "pending" | "approved" | "rejected" }
): Promise<{ message: string; updatedAct: KindnessAct }> {
  const token = localStorage.getItem("lsToken") || "";
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const isAdmin = decodedToken.role === "admin";

  // Force pending status for non-admins
  const actPayload = isAdmin ? payload : { ...payload, status: "pending" };

  const result = await fetcher<{ message: string; updatedAct: KindnessAct }>(
    `https://random-acts-of-kindness-api.onrender.com/api/acts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(actPayload),
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }
  );
  if (result == null) {
    throw new Error("Failed to update act: no response from server.");
  }
  return result;
}

/**
 * Deletes a kindness act
 * Admins can delete any; users only their own acts
 * @param id – act ID
 * @returns server message
 */
export async function deleteAct(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("lsToken") || "";

  const result = await fetcher<{ message: string }>(
    `https://random-acts-of-kindness-api.onrender.com/api/acts/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }
  );
  if (result == null) {
    throw new Error("Failed to delete: no response from server.");
  }
  return result;
}
