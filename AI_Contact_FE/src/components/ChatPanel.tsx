import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { ChatApi } from "../apis/chat/api";
import "../styles/ChatPanel.css";
import { CouplesApi } from "../apis/couple/api";
import { NicknameApi } from "../apis/nickname/api";
import heartImg from "../assets/images/heart.png";

interface ChatPanelProps {
  coupleId: number;
  senderId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  senderId: number;
  content: string;
  messageType: "TEXT";
  sentAt: string;
}

const NICKNAMES_KEY = "nicknames";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

type FloatingHeart = {
  id: number;
  leftPct: number; // 25~75% (가로 분산)
  sizePx: number; // 36~110px (크기 다양)
  opacity: number; // 0.5~1.0
  duration: number; // 1.8~3.2s (속도 다양)
  delay: number; // 0~0.6s (시작 지연)
  drift1: number; // -80~80px (중간 드리프트)
  drift2: number; // -120~120px (최종 드리프트)
  bottomPx: number; // 200~320px (더 위에서 출발)
};

export default function ChatPanel({
  coupleId,
  senderId,
  isOpen,
  onClose,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string>("상대");
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  const stompClientRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const myId = Number(senderId);
  if (!Number.isFinite(myId)) return null;

  const isBlank = input.trim().length === 0;

  // ---------- 유틸 ----------
  const normalize = (s: string) => s.replace(/\s+/g, "").trim();

  const makeVariants = (w: string) => {
    const base = normalize(w);
    const out = new Set<string>([base]);
    if (/[이가은는을를]$/.test(base)) out.add(base.slice(0, -1));
    return Array.from(out);
  };

  // 다양한 래핑 응답을 안전하게 파싱
  const extractNicknames = (res: any): string[] => {
    const layers = [res, res?.data, res?.data?.data];
    for (const layer of layers) {
      const list = layer?.nicknames;
      if (Array.isArray(list)) {
        return list.map((n: any) => String(n?.word ?? "")).filter(Boolean);
      }
    }
    return [];
  };

  const saveNicknames = (arr: string[]) => {
    const dedup = Array.from(new Set(arr.map(String)));
    if (dedup.length === 0) return; // 빈배열로 덮어쓰지 않음
    localStorage.setItem(NICKNAMES_KEY, JSON.stringify(dedup));
    setNicknames(dedup);
  };

  // string[]만 반환(타입가드)
  const getNicknames = (): string[] => {
    if (nicknames.length) return nicknames;
    try {
      const raw = localStorage.getItem(NICKNAMES_KEY) || "[]";
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x: unknown): x is string => typeof x === "string");
    } catch {
      return [];
    }
  };

  // 필요 시 즉시 API로 채워 넣는 lazy 로더
  const ensureNicknamesLoaded = async (): Promise<string[]> => {
    let cur = getNicknames();
    if (cur.length) return cur;
    try {
      const res = await NicknameApi.getAll();
      const words = extractNicknames(res);
      if (words.length) saveNicknames(words);
      return getNicknames();
    } catch {
      return cur;
    }
  };

  const containsNickname = (text: string) => {
    const t = normalize(text);
    const nicks = getNicknames();
    return nicks.some((nick) => makeVariants(nick).some((v) => t.includes(v)));
  };

  // ❤️ 하트 여러 개 트리거
  const triggerHearts = (count = 50) => {
    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const pick = (min: number, max: number) => Math.round(rand(min, max));

    const batch: FloatingHeart[] = Array.from({ length: count }).map(
      (_, i) => ({
        id: Date.now() + i,
        leftPct: rand(0, 100), // 화면 가로폭 중앙±넓게 분산
        sizePx: rand(10, 100), // 크기 다양
        opacity: rand(0.5, 1.0), // 투명도 다양
        duration: rand(1.8, 3.2), // 속도 다양
        delay: rand(0, 0.6), // 시작 시간 랜덤
        drift1: pick(-200, 200), // 중간 비틀기
        drift2: pick(-200, 200), // 끝에서 더 퍼짐
        bottomPx: pick(0, 800), // 더 위쪽에서 시작
      })
    );

    setHearts((prev) => [...prev, ...batch]);

    const maxLife =
      Math.max(...batch.map((h) => h.duration + h.delay)) * 1000 + 300;
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !batch.find((b) => b.id === h.id))
      );
    }, maxLife);
  };

  // ---------- 닉네임 초기화 ----------
  useEffect(() => {
    const stored = getNicknames();
    if (stored.length) setNicknames(stored);

    (async () => {
      try {
        const res = await NicknameApi.getAll();
        const words = extractNicknames(res);
        if (words.length) saveNicknames(words);
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- 파트너 프로필 ----------
  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const res = await CouplesApi.getPartnerInfo();
        const partner = (res as any)?.data ?? res;
        setPartnerAvatarUrl(partner?.profileImageUrl ?? null);

        const name =
          partner?.nickname ??
          partner?.nickName ??
          partner?.name ??
          partner?.username ??
          partner?.userName ??
          partner?.displayName ??
          "상대";
        setPartnerName(String(name));
      } catch (err) {
        console.error("파트너 정보 불러오기 실패:", err);
      }
    };
    fetchPartnerInfo();
  }, []);

  // ---------- 히스토리 ----------
  useEffect(() => {
    (async () => {
      try {
        const res: any = await ChatApi.getMessages(coupleId);
        const list = res?.data ?? res;
        if (!Array.isArray(list)) return;

        const normalized = list.map((m: any) => {
          const sid =
            m.senderId ??
            m.sender_id ??
            m.userId ??
            m.user_id ??
            m.writerId ??
            m.writer_id ??
            m.sender?.id ??
            m.user?.id;

          const nSid = Number(sid);
          return {
            senderId: Number.isFinite(nSid) ? nSid : -1,
            content: String(m.content ?? m.message ?? m.text ?? ""),
            messageType: "TEXT" as const,
            sentAt:
              m.sentAt ??
              m.sent_at ??
              m.createdAt ??
              m.created_at ??
              new Date().toISOString(),
          };
        });

        setMessages(normalized);
      } catch (e) {
        console.error("메시지 히스토리 로드 실패:", e);
      }
    })();
  }, [coupleId]);
  // ---------- 소켓 ----------
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}${API_PREFIX}/ws-chat`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/sub/chat/${coupleId}`, async (message: any) => {
        const raw = JSON.parse(message.body);
        const payload: Message = {
          senderId: Number(raw.senderId),
          content: String(raw.content ?? ""),
          messageType: "TEXT",
          sentAt: raw.sentAt ?? new Date().toISOString(),
        };

        await ensureNicknamesLoaded();
        if (containsNickname(payload.content)) {
          triggerHearts(); // ❤️ 수신 시
        }

        setMessages((prev) => [...prev, payload]);
      });

      stompClientRef.current = stompClient;
      socketRef.current = socket;
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [coupleId]);

  // ---------- 스크롤 ----------
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // ---------- 전송 ----------
  const sendMessage = async () => {
    const stompClient = stompClientRef.current;
    const text = input.trim();
    if (!text) return;
    if (!stompClient || !stompClient.connected) return;

    await ensureNicknamesLoaded();
    if (containsNickname(text)) {
      triggerHearts(); // ❤️ 전송 시
    }

    const chatMessage = {
      coupleId,
      senderId,
      content: text,
      sentAt: new Date().toISOString(),
    };

    stompClient.send("/pub/chat/sendMessage", {}, JSON.stringify(chatMessage));
    setInput("");
  };

  const formatTime = (sentAt: string) => {
    try {
      const date = new Date(sentAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "오후" : "오전";
      const displayHours = hours % 12 || 12;
      return `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = "/images/default-avatar.png";
  };

  return (
    <div className={`chat-panel ${isOpen ? "open" : ""}`}>
      <div className="chat-header">
        <span className="chat-title">{partnerName} ❤</span>
        <button onClick={onClose}>×</button>
      </div>

      <div className="chat-messages" ref={messagesEndRef}>
        {messages.map((msg, idx) => {
          const mine = msg.senderId === myId;
          return (
            <div key={idx} className={`message-row ${mine ? "right" : "left"}`}>
              {!mine && (
                <img
                  className="avatar"
                  src={partnerAvatarUrl || "/images/default-avatar.png"}
                  alt="상대 프로필"
                  onError={handleImageError}
                />
              )}
              <div className={`message-container ${mine ? "right" : "left"}`}>
                <div className={`message ${mine ? "from-me" : "from-you"}`}>
                  {msg.content}
                </div>
                <div className="message-time">{formatTime(msg.sentAt)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ❤️ 여러 하트 */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={
            {
              left: `${h.leftPct}%`,
              ["--heart-size" as any]: `${h.sizePx}px`,
              ["--heart-opacity" as any]: h.opacity,
              ["--heart-duration" as any]: `${h.duration}s`,
              ["--heart-delay" as any]: `${h.delay}s`,
              ["--heart-drift1" as any]: `${h.drift1}px`,
              ["--heart-drift2" as any]: `${h.drift2}px`,
              ["--heart-bottom" as any]: `${h.bottomPx}px`,
            } as React.CSSProperties
          }
        >
          <img src={heartImg} alt="하트" />
        </div>
      ))}

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!isBlank) sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isBlank}
          title={isBlank ? "메시지를 입력하세요" : ""}
        >
          전송
        </button>
      </div>
    </div>
  );
}
