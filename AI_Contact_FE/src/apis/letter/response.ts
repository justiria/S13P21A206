
export type UnreadLettersCountResponse = number;
export type LettersResponse = BabyLetterResponse[];

export type BabyLetterResponse = {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
};

