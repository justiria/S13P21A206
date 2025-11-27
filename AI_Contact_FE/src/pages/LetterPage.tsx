import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUnreadLettersCount } from "../apis/letter/useUnreadLettersCounts";
import backgroundImage from "../assets/images/Letter.png";
import Sidebar from "../components/Sidebar";
import "../styles/LetterPage.css";
import "../styles/MainPages.css";
// ⬇generate 유틸만 사용 (canGenerateToday는 무제한 모드면 굳이 안 써도 됨)
import {
  canGenerateToday,
  generateLetter as generateLetterSilentFromUtil,
} from "../apis/letter/generate";
import LetterBottomIcon from "../assets/icons/LetterBottomIcon.svg";
import LetterTopIcon from "../assets/icons/LetterTopIcon.svg";
import letterPaper from "../assets/images/LetterPaper.png";

import type { LettersResponse } from "../apis/letter";
import { LetterApi } from "../apis/letter";

// 불필요한 import 제거 (안 쓰면 빌드 경고/에러 가능)
// import { GreaterEqualCompare } from "three";

/** [AUTO_GEN_SWITCH]
 * 페이지 진입 시 자동으로 1회 편지 생성 시도할지 여부
 * - 무제한 모드에서 자동 생성이면 편지가 너무 많이 쌓일 수 있어 기본 false 권장
 * - true로 바꾸면 최초 렌더 후 1.5초 뒤 1회 생성 시도
 */
const AUTO_GENERATE_ON_MOUNT = false;

export default function Letters() {
  const [letters, setLetters] = useState<LettersResponse>([]);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const [meId, setMeId] = useState<number | null>(null); // ⬅️ 추가
  // StrictMode 2회 실행 방지
  const didInit = useRef(false);

  // 로컬에서 읽음 처리 함수
  const { markOneAsRead } = useUnreadLettersCount({ userId: null });

  // 목록 조회
  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await LetterApi.getAll();
      if (res.success) {
        setLetters(res.data);
        console.log("[DEBUG] effective data from API layer:", res.data);
        if (res.data.length === 0) {
          console.log("📭 도착한 편지가 없습니다.");
        }
      } else {
        setError("편지 조회에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (letterId: number) => {
    try {
      await LetterApi.markAsRead(letterId);
    } catch (e) {
      console.warn(e);
    }
    try {
      await markOneAsRead(letterId);
      setLetters((prev) =>
        prev.map((l) => (l.id === letterId ? { ...l, isRead: true } : l))
      );
      +(await loadList()); // ← 서버 값이 정말 true로 바뀌었는지 즉시 확인
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let mounted = true;
    (async () => {
      // 1) 목록 먼저
      await loadList();
      if (!mounted) return;

      // 2) [AUTO_GEN_SWITCH] true면 자동 생성 1회 시도
      if (AUTO_GENERATE_ON_MOUNT && canGenerateToday()) {
        setTimeout(async () => {
          await generateLetterSilentFromUtil({ silent: true }); // 실패해도 조용히
          await loadList(); // 목록 동기화
        }, 1500);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="main-layout">
      <Sidebar />
      <div
        className="letter-content"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className="back-ai"
          onClick={() => navigate("/ai")}
          role="button"
          tabIndex={0}
        >
          ←
        </div>

        <div className="page-header page-header-light">
          <h4># 속마음 # 알아보기</h4>
          <h3>편지함</h3>
        </div>

        {loading && <div className="status">로딩 중...</div>}
        {error && <div className="status error">{error}</div>}

        {!loading && !error && letters.length === 0 && (
          <h3 className="status">📭 도착한 편지가 없습니다.</h3>
        )}

        {!loading && !error && letters.length > 0 && (
          <div className="letters-container">
            {letters.map((letter, idx) => {
              return (
                <div
                  key={letter.id}
                  className="letter-box"
                  onClick={() => {
                    setSelectedBody(letter.content);
                    markAsRead(letter.id);
                  }}
                >
                  {letter.isRead ? (
                    <></>
                  ) : (
                    <div className="letter-badge ">N</div>
                  )}
                  <img
                    alt="편지봉투 아래"
                    src={LetterBottomIcon}
                    className="letter-bottom"
                  />
                  <img
                    alt="편지봉투 위"
                    src={LetterTopIcon}
                    className="letter-top"
                  />
                  <h4>{`편지 ${idx + 1}번`}</h4>
                </div>
              );
            })}
          </div>
        )}

        {selectedBody && (
          <div
            className="letter-modal-backdrop"
            onClick={() => setSelectedBody(null)}
          >
            <div
              className="letter-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundImage: `url(${letterPaper})` }}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedBody(null)}
              >
                ×
              </button>
              <pre className="letter-modal-body">{selectedBody}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
