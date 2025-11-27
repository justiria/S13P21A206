import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { MediaListRequest, UploadMediaRequest } from "./request";
import type {
  DeleteMediaResponse,
  FavoriteResponse,
  MediaFileDto,
  MediaListResponse,
  MediaThumbnailListResponse,
} from "./response";

/* GET 쿼리스트링 생성 헬퍼 */
function buildQuery(params: Record<string, any>) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      qp.append(key, String(val));
    }
  });
  return qp.toString() ? `?${qp.toString()}` : "";
}

export const MediaApi = {
  /* 1) 전체 미디어 조회 → Promise<MediaListResponse> */
  fetchMediaList: (params: MediaListRequest) =>
    apiFetch<ApiResponse<MediaListResponse>>(
      `/media${buildQuery(params)}`
    ).then((res) => res.data),

  /* 2) 썸네일만 조회 → Promise<MediaThumbnailListResponse> */
  fetchThumbnails: (params: MediaListRequest) =>
    apiFetch<ApiResponse<MediaThumbnailListResponse>>(
      `/media/thumbnails${buildQuery(params)}`
    ).then((res) => res.data),

  /* 3) 단일 미디어 상세 조회 → Promise<MediaFileDto> */
  fetchMedia: (id: number) =>
    apiFetch<ApiResponse<MediaFileDto>>(`/media/${id}`).then((res) => res.data),

  /* 4) 이미지 업로드 → Promise<MediaFileDto> */
  uploadImage: ({ file }: UploadMediaRequest) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<ApiResponse<MediaFileDto>>("/media/images", {
      method: "POST",
      body: form,
    }).then((res) => res.data);
  },

  /* 5) 비디오 업로드 → Promise<MediaFileDto> */
  uploadVideo: ({ file }: UploadMediaRequest) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<ApiResponse<MediaFileDto>>("/media/videos", {
      method: "POST",
      body: form,
    }).then((res) => res.data);
  },

  /* 6) 미디어 삭제 → Promise<DeleteMediaResponse> */
  deleteMedia: (id: number) =>
    apiFetch<ApiResponse<DeleteMediaResponse>>(`/media/${id}`, {
      method: "DELETE",
    }).then((res) => res.data),

  /* 7) 즐겨찾기 토글 → Promise<FavoriteResponse> */
  toggleFavorite: (id: number) =>
    apiFetch<ApiResponse<FavoriteResponse>>(`/media/${id}/favorite`, {
      method: "POST",
    }).then((res) => res.data),
};
