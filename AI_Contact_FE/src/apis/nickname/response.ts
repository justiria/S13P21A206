export type NicknameItem = {
  id: number;
  word: string;
  description?: string;
  created_at: string;
};

export interface NicknameListResponse {
  nicknames: NicknameItem[];
  pagination: {
    current_page: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface NicknameCreateResponse {
  couple_nickname: NicknameItem;
}

export interface NicknameUpdateResponse {
  couple_nickname: NicknameItem;
}
