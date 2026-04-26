import { useEffect, useRef, useState } from "react";

type Props = {
  id: number;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipped: boolean;
  height: number;
  onDone: (id: number) => void;
};

export function ChromaCat({ id, src, x, y, scale, rotation, flipped, height, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [size, setSize] = useState({ w: 200, h: 200 });
  const [fading, setFading] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;

    const draw = () => {
      if (cancelled || video.paused || video.ended || !video.videoWidth) {
        rafRef.current = null;
        return;
      }
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Knockout: strong green dominance → fully transparent
          if (g > 90 && g > r * 1.25 && g > b * 1.25) {
            data[i + 3] = 0;
            continue;
          }
          // Soft edges: lightly green pixels → partial alpha + despill
          if (g > 80 && g > r * 1.05 && g > b * 1.05) {
            const greenness = (g - Math.max(r, b)) / 255;
            const a = Math.max(0, 1 - greenness * 3);
            data[i + 3] = Math.round(255 * a);
            // Despill: clamp green near max(r,b)
            data[i + 1] = Math.min(g, Math.max(r, b) + 18);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Ignore draw errors (CORS / not ready)
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const onLoaded = () => {
      if (cancelled) return;
      const vw = video.videoWidth || 480;
      const vh = video.videoHeight || 480;
      canvas.width = vw;
      canvas.height = vh;
      const aspect = vw / vh;
      setSize({ w: height * aspect, h: height });
      video.play().catch(() => {
        // Autoplay should work since muted, but if not — just remove
        onDone(id);
      });
    };

    const onPlaying = () => {
      if (cancelled) return;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const onEnded = () => {
      if (cancelled) return;
      setFading(true);
      fadeTimerRef.current = window.setTimeout(() => onDone(id), 700);
    };

    const onError = () => onDone(id);

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    // Safety: hard cutoff at 10s in case video metadata is broken
    const safetyTimer = window.setTimeout(() => {
      setFading(true);
      fadeTimerRef.current = window.setTimeout(() => onDone(id), 700);
    }, 10000);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      clearTimeout(safetyTimer);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      try {
        video.pause();
      } catch {
        /* noop */
      }
    };
  }, [id, onDone, height]);

  return (
    <div
      className={`cat-fx ${fading ? "fading" : ""} ${flipped ? "flipped" : ""}`}
      style={
        {
          left: `${x}%`,
          top: `${y}%`,
          ["--scale" as never]: scale,
          ["--rot" as never]: `${rotation}deg`,
        } as React.CSSProperties
      }
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: `${size.w}px`, height: `${size.h}px` }}
      />
    </div>
  );
}
