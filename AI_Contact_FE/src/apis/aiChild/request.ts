export interface CreateAiChildRequest {
  name: string;
}

export interface UpdateAiChildRequest {
  name: string;
  imageUrl: string;
  growthLevel: number;
  experiencePoints: number;
}
