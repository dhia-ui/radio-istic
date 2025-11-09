"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

export type MediaTrack = {
  id: string;
  title: string;
  subtitle?: string;
  src: string; // should point to /api/media/audio?file=...
  cover?: string;
  duration?: number;
};

export type MediaPlayerContextType = {
  queue: MediaTrack[];
  currentIndex: number;
  current?: MediaTrack;
  isPlaying: boolean;
  progress: number; // seconds
  duration: number; // seconds
  volume: number; // 0..1
  playNow: (track: MediaTrack, replaceQueue?: boolean) => void;
  addToQueue: (track: MediaTrack) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
};

const MediaPlayerContext = createContext<MediaPlayerContextType | null>(null);

export function MediaPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<MediaTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const current = queue[currentIndex];

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.currentTime || 0);
    const onLoaded = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      // auto-next
      if (currentIndex < queue.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, queue.length]);

  // When current track changes, load and autoplay
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (current) {
      el.src = current.src;
      el.load();
      el.play().catch(() => {});
    }
  }, [current?.src]);

  const playNow = (track: MediaTrack, replaceQueue = false) => {
    if (replaceQueue) {
      setQueue([track]);
      setCurrentIndex(0);
    } else {
      setQueue((q) => {
        const idx = q.findIndex((t) => t.id === track.id);
        if (idx !== -1) {
          setCurrentIndex(idx);
          return q;
        }
        const nq = [...q, track];
        setCurrentIndex(nq.length - 1);
        return nq;
      });
    }
  };

  const addToQueue = (track: MediaTrack) => {
    setQueue((q) => (q.some((t) => t.id === track.id) ? q : [...q, track]));
  };

  const play = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();
  const next = () => {
    if (currentIndex < queue.length - 1) setCurrentIndex((i) => i + 1);
  };
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };
  const seek = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setProgress(seconds);
  };
  const setVolume = (v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setVolumeState(v);
  };

  const value: MediaPlayerContextType = useMemo(
    () => ({
      queue,
      currentIndex,
      current,
      isPlaying,
      progress,
      duration,
      volume,
      playNow,
      addToQueue,
      play,
      pause,
      next,
      prev,
      seek,
      setVolume,
    }),
    [queue, currentIndex, current, isPlaying, progress, duration, volume]
  );

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
      {/* Hidden audio element bound to global player */}
      <audio ref={audioRef} preload="metadata" />
    </MediaPlayerContext.Provider>
  );
}

export function useMediaPlayer() {
  const ctx = useContext(MediaPlayerContext);
  if (!ctx) throw new Error("useMediaPlayer must be used within MediaPlayerProvider");
  return ctx;
}
