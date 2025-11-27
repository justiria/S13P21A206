// GalleryPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import PhotoBookModal from "../components/PhotoBookModal";
import Sidebar from "../components/Sidebar";
import "../styles/GalleryPage.css";
import "../styles/MainPages.css";

import { MediaApi } from "../apis/media";
import type {
  MediaFileDto,
  MediaThumbnailDto,
  MediaThumbnailListResponse,
  PaginationInfo,
} from "../apis/media/response";

// id 기반 시드 랜덤 (0~1)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const rotationFromId = (id: number) => {
  // -10° ~ 10° 범위 각도 반환
  //   return Math.round((seededRandom(id) * 20 - 10) * 10) / 10;
  // -20° ~ 20° 범위 각도 반환
  return Math.round((seededRandom(id) * 40 - 20) * 10) / 10;
};

// FlipBook ref에서 필요한 메서드 shape만 정의 (DictionaryPage와 동일)
type FlipbookRef = {
  pageFlip(): {
    flipNext(): void;
    flipPrev(): void;
    turnToPage: (index: number) => void;
  };
};

export default function PhotoBook() {
  // ----- 필터/정렬 상태
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("전체");
  const [isTypeDropDownOpen, setIsTypeDropDownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("전체");
  const [viewMode, setViewMode] = useState<"all" | "favorite">("all");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  // ----- 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  // ----- 페이지네이션
  const [limit] = useState(24); // 서버 페이지당 24개 (좌12 + 우12)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // ----- FlipBook 관련 (flip 페이지 index)
  const bookRef = useRef<FlipbookRef | null>(null);
  const [activeFlipPage, setActiveFlipPage] = useState(0); // flip-book 기준 페이지 index

  // 서버 페이지별 썸네일 캐시: { 0: MediaThumbnailDto[0..23], 1: ..., ... }
  const [pagesCache, setPagesCache] = useState<
    Record<number, MediaThumbnailDto[]>
  >({});

  // ----- 모달 상태
  const [fullMedia, setFullMedia] = useState<MediaFileDto | null>(null);
  const [currentIndexInSide, setCurrentIndexInSide] = useState<number | null>(
    null
  );

  // ----- 연도/타입 목록
  const years = ["전체", "2025년", "2024년", "2023년", "2022년"];
  const types = ["전체", "이미지", "비디오"];

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".calendar-btn") &&
        !target.closest(".calendar-dropdown")
      ) {
        setIsDropDownOpen(false);
      }
      if (
        !target.closest(".type-filter-btn") &&
        !target.closest(".type-dropdown")
      ) {
        setIsTypeDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 필터/정렬 변경 시: 책을 첫 페이지로 리셋 + 캐시 초기화
  useEffect(() => {
    setPagesCache({});
    setActiveFlipPage(0);
    void loadServerPage(0, { replace: true });
  }, [viewMode, sortDir, selectedYear, selectedType]);

  // 초기 로드
  useEffect(() => {
    if (!(0 in pagesCache)) void loadServerPage(0, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------ 유틸: 현재 필터를 API 파라미터로 변환
  const buildQuery = (page: number) => {
    let dateFrom: string | undefined;
    let dateTo: string | undefined;
    if (selectedYear !== "전체") {
      const year = selectedYear.replace("년", "");
      dateFrom = `${year}-01-01`;
      dateTo = `${year}-12-31`;
    }
    let fileType: "IMAGE" | "VIDEO" | undefined;
    if (selectedType === "이미지") fileType = "IMAGE";
    else if (selectedType === "비디오") fileType = "VIDEO";

    return {
      page,
      limit,
      sortDir,
      favoriteOnly: viewMode === "favorite",
      dateFrom,
      dateTo,
      fileType,
    } as const;
  };

  // ------ 서버 페이지 로더(지연 로딩 & 캐시)
  async function loadServerPage(
    serverPage: number,
    opts?: { replace?: boolean }
  ) {
    try {
      const params = buildQuery(serverPage);
      const res: MediaThumbnailListResponse = await MediaApi.fetchThumbnails(
        params
      );
      const mapped = res.mediaFiles
        .map((item) => ({ ...item, isFavorite: item.favorite }))
        .sort((a, b) =>
          sortDir === "desc"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      setPagination(res.pagination);
      setPagesCache((prev) => {
        const next = opts?.replace ? {} : { ...prev };
        next[serverPage] = mapped;
        return next;
      });
    } catch (e) {
      console.error("페이지 로드 실패:", e);
    }
  }

  // ------ flip-page → serverPage/side 계산
  const flipToServer = (flipIdx: number) => {
    const serverPage = Math.floor(flipIdx / 2);
    const side: "left" | "right" = flipIdx % 2 === 0 ? "left" : "right";
    return { serverPage, side };
  };

  // ------ FlipBook: 페이지 전환 시점에 로딩 (서버 페이지 기준으로 프리패치)
  const handleFlip = (e: any) => {
    const targetFlip = e.data as number;
    setActiveFlipPage(targetFlip);

    const { serverPage } = flipToServer(targetFlip);
    if (!(serverPage in pagesCache)) void loadServerPage(serverPage);

    // 이웃 flip 페이지들에 해당하는 서버 페이지를 프리패치
    const neighbors = [targetFlip - 1, targetFlip + 1].filter((i) => i >= 0);
    const neighborServerPages = new Set(
      neighbors.map((i) => Math.floor(i / 2))
    );
    neighborServerPages.forEach((sp) => {
      if (!(sp in pagesCache)) void loadServerPage(sp);
    });
  };

  // ------ 업로드 처리(끝나면 현재 서버 페이지만 새로고침)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const allowedVideoExtensions = ["mp4", "mov", "3gp", "mkv"];

    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/")) return true;
      if (file.type.startsWith("video/")) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext && allowedVideoExtensions.includes(ext)) return true;
        alert(
          `${file.name}: 지원하지 않는 비디오 형식입니다. (mp4, mov, 3gp, mkv만 가능)`
        );
        return false;
      }
      alert(`${file.name}: 지원하지 않는 파일 형식입니다.`);
      return false;
    });
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < validFiles.length; i++) {
      const f = validFiles[i];
      try {
        setUploadProgress({ current: i + 1, total: validFiles.length });
        await MediaApi.uploadImage({ file: f });
        successCount++;
      } catch (err) {
        console.error("업로드 실패:", f.name, err);
        failCount++;
      }
    }
    setIsUploading(false);

    const { serverPage } = flipToServer(activeFlipPage);
    await loadServerPage(serverPage);
    alert(`업로드 완료!\n성공: ${successCount}개\n실패: ${failCount}개`);
    e.target.value = "";
  };

  // ------ 썸네일 클릭 → 상세 로드 & 모달
  const handleThumbnailClick = (id: number, idxInSide: number) => {
    MediaApi.fetchMedia(id)
      .then((media) => {
        setFullMedia({ ...media, favorite: media.favorite });
        setCurrentIndexInSide(idxInSide);
      })
      .catch(console.error);
  };

  // ------ 현재 flip-page의 side 목록(12개) 계산
  const useSideList = () => {
    const { serverPage, side } = flipToServer(activeFlipPage);
    const list = pagesCache[serverPage] ?? [];
    const slice = side === "left" ? list.slice(0, 12) : list.slice(12, 24);
    return { serverPage, side, slice };
  };

  // ------ 모달 내 좌우 이동(현재 side의 12개 내에서만)
  const handlePrevInModal = () => {
    if (currentIndexInSide == null) return;
    const { slice } = useSideList();
    if (slice.length === 0) return;
    const prev = (currentIndexInSide + slice.length - 1) % slice.length;
    const id = slice[prev]?.id;
    if (id) handleThumbnailClick(id, prev);
  };
  const handleNextInModal = () => {
    if (currentIndexInSide == null) return;
    const { slice } = useSideList();
    if (slice.length === 0) return;
    const next = (currentIndexInSide + 1) % slice.length;
    const id = slice[next]?.id;
    if (id) handleThumbnailClick(id, next);
  };

  // ------ 모달 닫기
  const handleClose = () => {
    setCurrentIndexInSide(null);
    setFullMedia(null);
  };

  // ------ 즐겨찾기 토글(캐시 & 모달 동기화)
  const handleFavoriteUpdate = async (mediaId: number) => {
    try {
      const response = await MediaApi.toggleFavorite(mediaId);
      const newFav = response.favorite;

      const { serverPage } = flipToServer(activeFlipPage);
      setPagesCache((prev) => {
        const copy = { ...prev };
        const list = copy[serverPage];
        if (list) {
          copy[serverPage] = list.map((t) =>
            t.id === mediaId ? { ...t, isFavorite: newFav } : t
          );
        }
        return copy;
      });

      if (fullMedia?.id === mediaId)
        setFullMedia({ ...fullMedia, favorite: newFav });
    } catch (e) {
      console.error("즐겨찾기 토글 실패:", e);
    }
  };

  // ------ 삭제(현재 서버 페이지에서 제거 후 재로드)
  const handleDelete = async () => {
    if (!fullMedia) return;
    if (!window.confirm("정말로 이 사진을 삭제하시겠습니까?")) return;

    try {
      await MediaApi.deleteMedia(fullMedia.id);
      handleClose();

      const { serverPage } = flipToServer(activeFlipPage);
      setPagesCache((prev) => {
        const copy = { ...prev };
        const list = copy[serverPage] ?? [];
        copy[serverPage] = list.filter((t) => t.id !== fullMedia.id);
        return copy;
      });

      await loadServerPage(serverPage);
      alert("사진이 삭제되었습니다.");
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ------ 포토그리드 렌더(한 페이지=12칸만)
  const renderPhotoGrid = (
    list: MediaThumbnailDto[] | undefined,
    side: "left" | "right"
  ) => {
    const all = list ?? [];
    const slice = side === "left" ? all.slice(0, 12) : all.slice(12, 24);

    return (
      <div className={`photobook single ${side}`}>
        <div className={`photo-grid ${side}`}>
          {Array.from({ length: 12 }).map((_, i) => {
            const item = slice[i];
            const rot = item ? rotationFromId(item.id) : 0;
            return (
              <div
                className="photo-box"
                key={`${side}-${i}`}
                style={item ? { transform: `rotate(${rot}deg)` } : undefined}
              >
                {item && (
                  <img
                    src={item.thumbnailUrl}
                    alt={`thumb-${item.id}`}
                    onClick={() => handleThumbnailClick(item.id, i)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 총 flip 페이지 수 = 서버 totalPages * 2 (좌/우)
  const totalFlipPages = Math.max((pagination?.totalPages ?? 1) * 2, 2);

  // FlipBook 재생성 키
  const pagesKey = useMemo(() => {
    return [
      "flip",
      viewMode,
      sortDir,
      selectedYear,
      selectedType,
      totalFlipPages,
    ].join("|");
  }, [viewMode, sortDir, selectedYear, selectedType, totalFlipPages]);

  // 좌/우 화살표 (책장 넘기기)
  const flipPrev = () => bookRef.current?.pageFlip().flipPrev();
  const flipNext = () => bookRef.current?.pageFlip().flipNext();

  const canPrev = activeFlipPage > 0;
  const canNext = activeFlipPage < totalFlipPages - 1;

  // 화면 상단 "페이지 정보"는 서버 페이지 기준으로 표기
  const serverPageDisplay = Math.floor(activeFlipPage / 2) + 1;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4># 기록 # 공유 </h4>
          <h3>갤러리 📸</h3>
        </div>
        <div className="gallery-container-wrapper">
          {" "}
          {/* 상단 액션 바(필터/정렬/업로드) */}
          <div className="gallery-top-bar">
            <div className="gallery-tabs">
              <button
                className={viewMode === "all" ? "fav-btn active" : "fav-btn"}
                onClick={() => {
                  setViewMode("all");
                  bookRef.current?.pageFlip().turnToPage(0);
                }}
              >
                전체
              </button>
              <button
                className={
                  viewMode === "favorite" ? "fav-btn active" : "fav-btn"
                }
                onClick={() => {
                  setViewMode("favorite"); 
                  bookRef.current?.pageFlip().turnToPage(0);
                }}
              >
                즐겨찾기
              </button>
            </div>

            <div className="gallery-actions">
              <button
                className={`sort-btn ${sortDir === "desc" ? "active" : ""}`}
                onClick={() => {
                  setSortDir("desc");
                  bookRef.current?.pageFlip().turnToPage(0);
                }}
              >
                최신순
              </button>
              <button
                className={`sort-btn ${sortDir === "asc" ? "active" : ""}`}
                onClick={() => {
                  setSortDir("asc");
                  bookRef.current?.pageFlip().turnToPage(0);
                }}
              >
                오래된순
              </button>

              {/* 연도 필터 */}
              <button
                className="calendar-btn"
                onClick={() => {
                  setIsDropDownOpen((o) => !o);
                  setIsTypeDropDownOpen(false);
                }}
              >
                📅
                {isDropDownOpen && (
                  <div className="calendar-dropdown">
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`dropdown-item ${
                          selectedYear === year ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsDropDownOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </button>

              {/* 타입 필터 */}
              <button
                className={`calendar-btn ${isTypeDropDownOpen ? "active" : ""}`}
                onClick={() => {
                  setIsTypeDropDownOpen((o) => !o);
                  setIsDropDownOpen(false);
                }}
              >
                📁
                {isTypeDropDownOpen && (
                  <div className="type-dropdown">
                    {types.map((type) => (
                      <div
                        key={type}
                        className={`dropdown-item ${
                          selectedType === type ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedType(type);
                        }}
                      >
                        {type === "전체" && "📁 전체"}
                        {type === "이미지" && "🖼️ 이미지"}
                        {type === "비디오" && "🎬 비디오"}
                      </div>
                    ))}
                  </div>
                )}
              </button>

              {/* 업로드 */}
              <label className="upload-label">
                추억 업로드 ( 🖼️ / 🎬 )
                <input
                  type="file"
                  multiple
                  accept="image/*,.mp4,.mov,.3gp,.mkv"
                  onChange={handleUpload}
                />
              </label>
            </div>
          </div>
          {/* 책처럼 넘기는 포토북 (flip-page 당 12칸) */}
          <div className="gallery-wrapper">
            <div className="dictionary-container">
              <button
                className="arrow left"
                onClick={flipPrev}
                disabled={!canPrev}
              >
                〈
              </button>

              <div className="dictionary-book">
                <div className="dictionary-page-mock">
                  <div className="flip-page mock-page"></div>
                  <div className="flip-page mock-page"></div>
                </div>

                <HTMLFlipBook
                  style={{}}
                  key={pagesKey}
                  ref={bookRef as any}
                  className="flipbook"
                  width={734 / 2}
                  height={467}
                  size="stretch"
                  minWidth={320}
                  maxWidth={1000}
                  minHeight={420}
                  maxHeight={1400}
                  startPage={0}
                  flippingTime={700}
                  startZIndex={10}
                  drawShadow={true}
                  maxShadowOpacity={0.3}
                  autoSize={true}
                  showCover={false}
                  mobileScrollSupport={true}
                  usePortrait={true}
                  useMouseEvents={false}
                  swipeDistance={30}
                  clickEventForward={true}
                  showPageCorners={false}
                  disableFlipByClick={true}
                  onFlip={handleFlip}
                >
                  {Array.from({ length: totalFlipPages }).map((_, flipIdx) => {
                    const { serverPage, side } = flipToServer(flipIdx);
                    const list = pagesCache[serverPage];
                    return (
                      <div
                        key={`flip-${flipIdx}`}
                        className="gallery-flip-page flip-page photobook-page"
                      >
                        {renderPhotoGrid(list, side)}
                      </div>
                    );
                  })}
                </HTMLFlipBook>
              </div>

              <button
                className="arrow right"
                onClick={flipNext}
                disabled={!canNext}
              >
                〉
              </button>
            </div>

            {/* 페이지 정보: 서버 페이지 기준 */}
            {pagination && (
              <div className="page-info">
                {pagination.totalPages == 0 ? 0 : serverPageDisplay} /{" "}
                {pagination.totalPages}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 업로드 로딩 오버레이 */}
      {isUploading && (
        <div className="upload-overlay">
          <div className="upload-modal">
            <div className="upload-spinner">⏳</div>
            <h3>파일 업로드 중...</h3>
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (uploadProgress.current / uploadProgress.total) * 100
                    }%`,
                  }}
                />
              </div>
              <p>
                {uploadProgress.current} / {uploadProgress.total} 완료
              </p>
            </div>
            <p>잠시만 기다려주세요...</p>
          </div>
        </div>
      )}

      {/* 모달 */}
      {currentIndexInSide !== null && fullMedia && (
        <PhotoBookModal
          onClose={handleClose}
          hasPrev={true}
          hasNext={true}
          onPrev={handlePrevInModal}
          onNext={handleNextInModal}
          isFavorite={fullMedia.favorite}
          onFavoriteToggle={() => handleFavoriteUpdate(fullMedia.id)}
          onDelete={handleDelete}
        >
          {fullMedia.fileType === "VIDEO" ? (
            <video
              src={fullMedia.fileUrl}
              controls
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          ) : (
            <img
              src={fullMedia.fileUrl}
              alt="full-media"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </PhotoBookModal>
      )}
    </div>
  );
}
