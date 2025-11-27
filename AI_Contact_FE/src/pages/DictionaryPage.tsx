import React, { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/Sidebar";
import "../styles/DictionaryPage.css";

import { NicknameApi } from "../apis/nickname/api";
import type { NicknameItem } from "../apis/nickname/response";
import DictionaryPageCard from "../components/DictionaryPageCard";

// 유틸: ISO 문자열을 'YYYY-MM-DD HH:mm:ss'로 포맷팅
function formatDate(iso: string): string {
  const d = new Date(iso);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

// Raw API 데이터 타입
interface RawNickname {
  id: number;
  nickname: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 로컬 상태 타입: NicknameItem + updated_at
export type LocalNickname = NicknameItem & { updated_at: string };

// API 응답을 로컬 타입으로 변환
function mapRawToItem(raw: RawNickname): LocalNickname {
  return {
    id: raw.id,
    word: raw.nickname,
    description: raw.description,
    created_at: formatDate(raw.createdAt),
    updated_at: formatDate(raw.updatedAt),
  };
}

// FlipBook ref에서 필요한 메서드 shape만 정의
type FlipbookRef = {
  pageFlip(): {
    flipNext(): void;
    flipPrev(): void;
    turnToPage: (index: number) => void;
  };
};

// ✅ 추가: localStorage 유틸과 키
const LS_KEY = "nicknames"; // ← localStorage key

function saveNicknamesToLocal(items: LocalNickname[]) {
  try {
    // word 값만 배열로 추출
    const words = items.map((item) => item.word);
    localStorage.setItem(LS_KEY, JSON.stringify(words)); // ← 저장
  } catch (e) {
    console.warn("Failed to save nicknames to localStorage:", e);
  }
}

function loadNicknamesFromLocal(): LocalNickname[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // 최소한의 타입 검증 (id, word 존재 여부)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (x) => x && typeof x.id === "number" && typeof x.word === "string"
      );
    }
    return null;
  } catch {
    return null;
  }
}

const DictionaryPage: React.FC = () => {
  const [nicknames, setNicknames] = useState<LocalNickname[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // FlipBook 제어용
  const bookRef = useRef<FlipbookRef | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // 리마운트 후 이동해야 하는 페이지를 큐에 저장
  const [pendingPage, setPendingPage] = useState<number | null>(null);

  // ✅ 최초 마운트 시 localStorage 먼저 반영 → 이어서 서버 최신화
  useEffect(() => {
    const cached = loadNicknamesFromLocal(); // ← localStorage 로드
    if (cached && cached.length > 0) {
      setNicknames(cached);
    }
    // 이후 서버에서 최신 목록으로 동기화
    fetchNicknames();
  }, []);

  const fetchNicknames = async (): Promise<LocalNickname[]> => {
    try {
      const res = await NicknameApi.getAll();
      const rawList = (res as any).data as RawNickname[];
      const items = rawList.map(mapRawToItem);
      // 숫자 문자열은 숫자 비교, 그 외 문자열은 한글 가나다순 비교
      items.sort((a, b) => {
        const numA = parseFloat(a.word);
        const numB = parseFloat(b.word);
        const isNumA = !isNaN(numA);
        const isNumB = !isNaN(numB);
        if (isNumA && isNumB) return numA - numB;
        return a.word.localeCompare(b.word, "ko");
      });
      setNicknames(items);
      saveNicknamesToLocal(items); // ✅ 변경: 서버 데이터로 로컬 저장 갱신
      return items;
    } catch (err) {
      console.error("닉네임 목록 불러오기 실패", err);
      return [];
    }
  };

  // ✅ 페이지 구성에 종속된 key (길이/목록 변경 시 FlipBook 리마운트)
  const pagesKey = useMemo(
    () =>
      nicknames.length === 0 ? "empty" : nicknames.map((n) => n.id).join(","),
    [nicknames]
  );

  // ✅ FlipBook이 리마운트된 뒤에 보류된 이동을 수행
  useEffect(() => {
    if (pendingPage != null) {
      // 다음 프레임에서 안전하게 호출
      requestAnimationFrame(() => {
        bookRef.current?.pageFlip().turnToPage(pendingPage);
        setCurrentPage(pendingPage);
        setPendingPage(null);
      });
    }
  }, [pagesKey, pendingPage]);

  // 모달 열기 함수들
  const openCreateModal = () => {
    setModalMode("create");
    setTerm("");
    setDescription("");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: LocalNickname) => {
    setModalMode("edit");
    setTerm(item.word);
    setDescription(item.description ?? "");
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  // 저장 핸들러: 생성/수정 후 항상 리스트 재조회 및 해당 페이지로 이동 (리마운트 후 이동을 위해 pendingPage 사용)
  const handleSave = async () => {
    try {
      if (modalMode === "create") {
        const createRes = await NicknameApi.create({ word: term, description });
        const rawCreated = (createRes as any).data as RawNickname;
        const createdItem = mapRawToItem(rawCreated);

        const items = await fetchNicknames(); // ✅ 서버 동기화 + localStorage 저장
        const idx = items.findIndex((it) => it.id === createdItem.id);
        if (idx >= 0) setPendingPage(idx);
      } else if (modalMode === "edit" && editingId != null) {
        await NicknameApi.update(editingId, { word: term, description });
        const items = await fetchNicknames(); // ✅ 서버 동기화 + localStorage 저장
        const idx = items.findIndex((it) => it.id === editingId);
        if (idx >= 0) setPendingPage(idx);
      }
    } catch (err) {
      console.error("단어 추가/수정 실패", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  // 삭제 핸들러: 삭제 후 리스트 재조회 및 페이지 보정 (pendingPage로 처리)
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await NicknameApi.delete(id);
      const items = await fetchNicknames(); // ✅ 서버 동기화 + localStorage 저장
      const last = Math.max(items.length - 1, 0);
      const next = Math.min(currentPage, last);
      setPendingPage(next);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const flipPrev = () => bookRef.current?.pageFlip().flipPrev();
  const flipNext = () => bookRef.current?.pageFlip().flipNext();

  const totalPages = Math.max(nicknames.length, 1); // 최소 한 페이지(빈 페이지) 보장
  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h4># 우리 # 둘만의 </h4>
          <h3>애칭 백과사전 📖</h3>
        </div>

        <div className="dictionary-container-wrapper">
          <div className="upload-btn-wrapper">
            <button className="upload-btn" onClick={openCreateModal}>
              😘 애칭 등록
            </button>
          </div>

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
                key={pagesKey}
                ref={bookRef as any}
                className="flipbook"
                style={{}}
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
                showPageCorners={false} // 타입 충돌 회피용 필수 prop
                disableFlipByClick={true} // 타입 충돌 회피용 필수 prop
                onFlip={(e: any) => setCurrentPage(e.data)}
              >
                {nicknames.length === 0 ? (
                  <div key="empty" className="flip-page dictionary-page">
                    <div className="dictionary-page">
                      <div className="dictionary-page-header">
                        <div className="page-title">
                          첫 애칭을 등록해 보세요
                        </div>
                      </div>
                      <div className="description"></div>
                      <div className="time-info" />
                    </div>
                  </div>
                ) : (
                  nicknames.map((item) => (
                    <DictionaryPageCard
                      key={`p-${item.id}`}
                      item={item}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))
                )}
                <div key="empty" className="flip-page dictionary-page">
                  <div className="dictionary-page">
                    <div className="dictionary-page-header">
                      <div className="page-title">✨</div>
                    </div>
                    <div className="description">
                      오른쪽 위 <b>애칭 등록</b> 버튼을 눌러 새로운 애칭을
                      추가할 수 있어요.
                    </div>
                    <div className="time-info" />
                  </div>
                </div>
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
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          hasNext={false}
          hasPrev={false}
        >
          <div className="modal">
            <h3>{modalMode === "create" ? "애칭 등록" : "애칭 편집"}</h3>
            <input
              type="text"
              placeholder="애칭"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <textarea
              placeholder="설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DictionaryPage;