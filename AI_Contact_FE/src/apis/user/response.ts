export type MeUserResponse = {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string | null;
  birthDate: string | null;
  coupleStatus: "SINGLE" | "COUPLED" | string;
  coupleId: number | null;
  createdAt: string;
  updatedAt: string;
};
