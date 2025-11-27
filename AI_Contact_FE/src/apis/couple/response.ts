export type MyCodeResponse = {
  verificationCode: string;
};

export type CoupleJoinResponse = {
  matched: boolean;
  partnerId: number | null;
};

export type CoupleInfoResponse = {
  coupleId: number;
  user1Id: number;
  user2Id: number;
  matchedAt: string; // ISO format
  startDate: string | null;
  coupleName: string | null;
};

export type PartnerInfoResponse = {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string | null;
  birthDate: string | null;
};
