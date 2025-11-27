export interface ComicStripsResponse {
  id: number;
  imageUrl: string;
}

export interface ComicStripsListResponse {
  id: number;
  imageUrl: string;
  title: string | null;
  createdAt: string; // ISO 날짜 문자열
}
