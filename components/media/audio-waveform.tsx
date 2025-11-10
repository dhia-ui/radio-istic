"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pause, Play, Volume2, VolumeX, Loader2 } from "lucide-react";

export interface AudioWaveformProps {
  src: string;            // Streaming/Range endpoint
  title?: string;
  accentColorClass?: string; // Tailwind classes for accent (e.g. text-electric-blue)
  height?: number;        // Canvas height
  peaks?: number;         // Optional precomputed peaks length (fallback sample granularity)
}

/*
  Lightweight waveform approach:
  - Stream audio via <audio> element so browser handles buffering & Range.
  - Once metadata loaded, decode a small portion using Web Audio to build peak data.
  - For large files: progressively sample by stepping through channel data (no full array copy).
*/

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  src,
  title,
  accentColorClass = "text-electric-blue",
  height = 64,
  peaks = 180,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [wavePeaks, setWavePeaks] = useState<number[] | null>(null);
  const [loadingPeaks, setLoadingPeaks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle play
  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      // In browsers, a 'play' event will be emitted; in tests we also set state directly
      const maybePromise = (el as any).play?.();
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.catch(() => {});
      }
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, []);

  // Build peaks
  useEffect(() => {
    let aborted = false;
    async function buildPeaks() {
      try {
        setLoadingPeaks(true);
        setError(null);
        const el = audioRef.current;
        if (!el) return;
        // Try localStorage cache first
  const cacheKey = `waveform_peaks_${src}`;
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached) as number[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWavePeaks(parsed);
              setLoadingPeaks(false);
              return;
            }
          }
        } catch {}

        // Fetch a slice of the file (first few MB) for quick peak approximation.
        // We'll attempt full fetch only if small (< ~12MB).
        const headResp = await fetch(src, { method: "GET", headers: { Range: "bytes=0-4000000" } });
        if (!headResp.ok) {
          // If file doesn't exist, fail gracefully
          if (headResp.status === 404) {
            console.warn('Audio file not found:', src);
            setError("Fichier audio non disponible");
            setLoadingPeaks(false);
            return;
          }
          throw new Error("Impossible de récupérer l'audio pour l'aperçu");
        }
        const arrayBuf = await headResp.arrayBuffer();
        const ctx = new AudioContext();
        const audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0));
        const channel = audioBuf.getChannelData(0);
        const step = Math.floor(channel.length / peaks) || 1;
        const newPeaks: number[] = [];
        for (let i = 0; i < peaks; i++) {
          if (aborted) return;
          const idx = i * step;
          let max = 0;
            for (let j = 0; j < step && idx + j < channel.length; j++) {
              const v = Math.abs(channel[idx + j]);
              if (v > max) max = v;
            }
          newPeaks.push(max);
        }
        setWavePeaks(newPeaks);
        try { localStorage.setItem(cacheKey, JSON.stringify(newPeaks)); } catch {}
      } catch (e: any) {
        console.warn("Waveform error", e);
        setError("Waveform indisponible");
      } finally {
        if (!aborted) setLoadingPeaks(false);
      }
    }
    buildPeaks();
    return () => {
      aborted = true;
    };
  }, [src, peaks]);

  // Draw peaks on canvas + progress overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wavePeaks) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    const barWidth = w / wavePeaks.length;
    wavePeaks.forEach((v, i) => {
      const x = i * barWidth;
      const barH = (v * h) / 1.1; // scale
      const y = (h - barH) / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(x, y, barWidth * 0.9, barH);
    });

    // Progress overlay
    if (duration > 0) {
      const playedRatio = currentTime / duration;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,178,255,0.85)';
      ctx.fillRect(0, 0, w * playedRatio, h);
      // Redraw lines for contrast (optional subtle highlight)
    }
  }, [wavePeaks, currentTime, duration]);

  // Audio event listeners
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, []);

  const toggleMute = () => {
    const el = audioRef.current; if (!el) return;
    el.muted = !el.muted; setIsMuted(el.muted);
  };

  const handleScrub = (vals: number[]) => {
    const el = audioRef.current; if (!el || !duration) return;
    const next = (vals[0] / 100) * duration;
    el.currentTime = next;
    setCurrentTime(next);
  };

  const format = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  };

  return (
    <div className={cn("w-full flex flex-col gap-3 border border-border rounded-xl p-4 bg-card/70 backdrop-blur", accentColorClass)}>
      {title && <div className="text-sm font-medium truncate">{title}</div>}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="shrink-0"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <div className="relative w-full" style={{ height }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-md"
              width={600}
              height={height}
            />
            {loadingPeaks && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Génération waveform…
              </div>
            )}
            {error && !loadingPeaks && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-destructive/80">
                {error}
              </div>
            )}
          </div>
          <div className="mt-2">
            <Slider
              min={0}
              max={100}
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleScrub}
            />
          </div>
          <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
            <span>{format(currentTime)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="shrink-0"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};
