export type CoupleMatchingRequest = {
  partnerId: number;
  startDate?: string | null;
  coupleName?: string | null;
};

export type CoupleJoinRequest = {
  verificationCode: string;
};

export type CoupleUpdateRequest = {
  startDate?: string | null;
  coupleName?: string | null;
};
