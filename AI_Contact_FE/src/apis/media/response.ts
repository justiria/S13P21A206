/* 파일 타입(enum) */
export type FileType = "IMAGE" | "VIDEO";

/* 단일 미디어 전체 정보 */
export interface MediaFileDto {
  id: number;
  fileUrl: string;
  thumbnailUrl: string;
  fileType: FileType;
  favorite: boolean;
  uploadDate: string; // LocalDate → ISO 문자열
}

/* 썸네일 전용 정보 */
export interface MediaThumbnailDto {
  id: number;
  thumbnailUrl: string;
  favorite: boolean;
  createdAt: string;
}

/* 페이징 정보 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/* 썸네일 리스트 응답 */
export interface MediaThumbnailListResponse {
  mediaFiles: MediaThumbnailDto[];
  pagination: PaginationInfo;
}

/* 전체 미디어 리스트 응답 */
export interface MediaListResponse {
  mediaFiles: MediaFileDto[];
  pagination: PaginationInfo;
}

/* 즐겨찾기 토글 응답 */
export interface FavoriteResponse {
  mediaId: number;
  favorite: boolean;
}

/* 삭제 응답 */
export interface DeleteMediaResponse {
  message: string;
  deletedMediaId: number;
}
