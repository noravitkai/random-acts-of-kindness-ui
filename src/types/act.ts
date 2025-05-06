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
