export interface KindnessAct {
  _id: string;
  title: string;
  description: string;
  category?: string; // TODO: Make required once backend implementation will be done
  difficulty: "easy" | "medium" | "hard";
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export type NewAct = Pick<
  KindnessAct,
  "title" | "description" | "category" | "difficulty"
>;

export type CompletedAct = {
  _id: string;
  act: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  completedAt: string;
};

export type SavedAct = {
  _id: string;
  act: string;
  user: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  savedAt: string;
};
