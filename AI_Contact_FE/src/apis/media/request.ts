export interface MediaListRequest {
  page?: number;
  limit?: number;
  sortDir?: "asc" | "desc"; // 'asc' = 오래된순, 'desc' = 최신순
  favoriteOnly?: boolean;
  dateFrom?: string; // ISO 문자열
  dateTo?: string; // ISO 문자열
  fileType?: "IMAGE" | "VIDEO";
}

export interface UploadMediaRequest {
  file: File;
}

export interface ThumbnailRequest extends MediaListRequest {}
