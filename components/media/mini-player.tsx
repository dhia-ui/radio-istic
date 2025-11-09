"use client";
import React from "react";
import { useMediaPlayer } from "./media-player-context";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, SkipForward, Music2 } from "lucide-react";

export function MiniPlayer() {
  const { current, isPlaying, play, pause, next, prev, progress, duration, seek } = useMediaPlayer();

  if (!current) {
    return (
      <div className="glass-panel border border-border rounded-xl p-3 flex items-center gap-3">
        <Music2 className="h-4 w-4 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">Aucun média en cours</div>
      </div>
    );
  }

  const toggle = () => (isPlaying ? pause() : play());

  const format = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="glass-panel border border-border rounded-xl p-3">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={prev} disabled={progress < 2}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon" onClick={toggle}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={next}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{current.title}</div>
          {current.subtitle && (
            <div className="text-[10px] text-muted-foreground truncate">{current.subtitle}</div>
          )}
          <div className="mt-1">
            <Slider
              min={0}
              max={duration || 1}
              value={[progress]}
              onValueChange={(vals) => seek(vals[0])}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{format(progress)}</span>
              <span>{format(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
