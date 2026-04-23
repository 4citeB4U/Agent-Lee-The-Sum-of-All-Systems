/*
LEEWAY HEADER — DO NOT REMOVE
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render
AUTHORITY: LeeWay-Standards
REGION: CLIENT.WEB-DEMO
TAG: CLIENT.COMPONENT.REMOTE-AUDIO
WHO = LeeWay Industries | LeeWay Innovation | Creator: Leonard Lee
LICENSE: PROPRIETARY
*/
// CHAIN: Standards → Integrated → Runtime → Projections

import { useEffect, useRef } from 'react';

interface RemoteAudioProps {
  stream: MediaStream;
  peerId: string;
}

export function RemoteAudio({ stream, peerId }: RemoteAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = stream;
    audioRef.current.play().catch(() => {
      // Autoplay blocked — user interaction required
    });
  }, [stream]);

  return (
    <audio
      ref={audioRef}
      autoPlay
      playsInline
      data-peer-id={peerId}
      style={{ display: 'none' }}
    />
  );
}
