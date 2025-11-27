import { RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface AudioComponentProps {
  track: RemoteAudioTrack;
  volume: number; // 0 ~ 100
  muted: boolean;
}

function AudioComponent({ track, volume }: AudioComponentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      // [ADD - 선택] attach 되는지 확인용 로그
      console.log("[AudioComponent] attach", track.sid);

      track.attach(audioRef.current);
      // attach 직후 재생 시도를 하는데 autoplay에 막히면 catch로 확인해보기
      audioRef.current
        .play?.()
        .catch((err) => console.warn("audio.play() blocked:", err));
    }

    return () => {
      // 특정 엘리먼트만 떼는 것이 안전
      if (audioRef.current) track.detach(audioRef.current);
    };
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // NOTE: 기존 요구사항(시그니처 안 바꾸기)을 지켜서 arguments 해킹 유지
  useEffect(() => {
    if (audioRef.current != null) {
      audioRef.current.muted = !!(arguments as any)[0]?.muted;
    }
  }, [(arguments as any)[0]?.muted]);

  return <audio ref={audioRef} autoPlay playsInline />;
}

export default AudioComponent;
