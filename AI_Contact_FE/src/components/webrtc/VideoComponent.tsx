import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { useEffect, useRef } from "react";
import "../../styles/VideoComponent.css";

interface VideoComponentProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  local?: boolean;
}

function VideoComponent({
  track,
  participantIdentity,
  local = false,
}: VideoComponentProps) {
  const videoElement = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoElement.current;
    if (el) {
      track.attach(el);
    }

    return () => {
      if (el) {
        track.detach(el);
      }
    };
  }, [track]);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video
        ref={videoElement}
        id={track.sid}
        autoPlay
        playsInline
        muted={local}
        style={local ? { transform: "scaleX(-1)" } : undefined}
      />
    </div>
  );
}

export default VideoComponent;
