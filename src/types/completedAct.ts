export interface CompletedAct {
  _id: string;
  user: string;
  act: {
    _id: string;
    title: string;
    description?: string;
  };
  completedAt: string;
}
