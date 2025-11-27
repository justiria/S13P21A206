import React, {useEffect}from "react";
import { useNavigate } from "react-router-dom";

import CartoonIcon from "../assets/icons/CartoonIcon.svg";
import ChatIcon from "../assets/icons/ChatIcon.svg";
import LetterIcon from "../assets/icons/LetterIcon.svg";
import WebrtcIcon from "../assets/icons/WebrtcIcon.svg";

import Dock from "../components/animations/Dock/Dock";
// import { LetterApi } from "../apis/letter"; 
import { useUnreadLettersCount, LETTER_SEEN_UPDATED } from "../apis/letter/useUnreadLettersCounts";
import "../styles/RightIcons.css";

interface RightIconsProps {
  onChatClick: () => void;
}

type DockItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};


const RightIcons: React.FC<RightIconsProps> = ({ onChatClick }) => {
  const navigate = useNavigate();
  // const {count} = useUnreadLettersCount({ pollMs: 60000 })

  // const [unread, setUnread] = useState<number>(0);

  // 최초 1회 + 주기적으로 갱신(60초)
  // useEffect(() => {
  //   let mounted = true;

  //   const fetchUnread = async () => {
  //     try {
  //       const res = await LetterApi.unreadCount();
  //       if (mounted && res?.success && typeof res.data === "number") {
  //         setUnread(res.data);
  //       }
  //     } catch {
  //       // 실패 시 조용히 무시(원하면 토스트/로그 추가)
  //     }
  //   };

  //   fetchUnread();
  //   const id = setInterval(fetchUnread, 60_000);
  //   return () => {
  //     mounted = false;
  //     clearInterval(id);
  //   };
  // }, []);
  const currentUserId = null;
  const {count, refetch} = useUnreadLettersCount({
    pollMs:60000,
    userId: currentUserId,
  })
  // 읽음 처리 이벤트 수신
  useEffect(() => {
      const onUpdate = () => refetch();
      window.addEventListener(LETTER_SEEN_UPDATED, onUpdate);
      return () => window.removeEventListener(LETTER_SEEN_UPDATED, onUpdate);
  }, [refetch]);

  // 뱃지 유틸(필요한 아이콘에만 래핑)
  const withBadge = (node: React.ReactNode, count: number) => (
    <div className="icon-with-badge">
      {node}
      {count > 0 && (
        <span className="badge" aria-label={`안 읽은 편지 ${count}개`}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );

  const items: DockItem[] = [
    {
      key: "chat",
      label: "채팅",
      onClick: onChatClick,
      icon: (
        <img
          src={ChatIcon}
          alt="채팅"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "webrtc",
      label: "영상통화",
      onClick: () => navigate("/webrtc"),
      icon: (
        <img
          src={WebrtcIcon}
          alt="영상통화"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "cartoon",
      label: "네컷만화",
      onClick: () => navigate("/cartoon"),
      icon: (
        <img
          src={CartoonIcon}
          alt="네컷만화"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />
      ),
    },
    {
      key: "letters",
      label: "편지함",
      onClick: () => navigate("/letters"),
      icon: withBadge(
        <img
          src={LetterIcon}
          alt="편지함"
          style={{ width: "28px", height: "28px", objectFit: "contain" }}
        />,
        count
      ),
    },
  ];

  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
    />
  );
};

export default RightIcons;
