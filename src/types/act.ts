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
  act: Pick<KindnessAct, "_id" | "title">;
  completedAt: string;
};

export type SavedAct = {
  _id: string;
  user: string;
  act: Pick<KindnessAct, "_id" | "title" | "description">;
  savedAt: string;
};
