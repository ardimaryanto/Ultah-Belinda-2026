import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChromaCat } from "./ChromaCat";

const CAT_VIDEO_SRC = "/assets/kucing.mp4";
const MAX_CATS = 8;

/* ===========================================
   Hadiah Digital Ulang Tahun
   Untuk: Aprillia Belinda Safitri
   Usia: 23 → 24
   =========================================== */

type Photo = {
  src: string;
  caption: string;
};

const PHOTOS: Photo[] = [
  { src: "/assets/foto1.jpg", caption: "Kenangan sekolah yang tidak terlupakan." },
  { src: "/assets/foto2.jpg", caption: "Momen sederhana yang ternyata berarti." },
  { src: "/assets/foto3.jpg", caption: "Perjalanan yang membentukmu sampai hari ini." },
  { src: "/assets/foto4.jpg", caption: "Teman, tawa, dan cerita lama." },
  { src: "/assets/foto5.jpg", caption: "Hari-hari yang pernah kamu lewati dengan kuat." },
  { src: "/assets/foto6.jpg", caption: "Bagian kecil dari perjalanan panjangmu." },
  { src: "/assets/foto7.jpg", caption: "Kenangan yang tetap hidup dalam cerita." },
];

const WISHES = [
  "Semoga langkahmu selalu dimudahkan.",
  "Semoga kuliahmu lancar sampai lulus.",
  "Semoga hatimu selalu kuat dan tenang.",
  "Semoga setiap keputusanmu membawa kebaikan.",
  "Semoga kamu selalu dikelilingi orang-orang yang tulus.",
  "Semoga usaha yang kamu jalani hari ini menjadi pintu bahagia di masa depan.",
];

const BUNNY_BUBBLES = [
  "Kamu hebat, Belinda!",
  "Semangat terus ya!",
  "Usia 24 semoga penuh hal baik!",
  "Doa terbaik selalu menyertaimu.",
  "Jangan lupa bahagia hari ini.",
  "Sebentar lagi lulus, kamu pasti bisa!",
];

const CONFETTI_COLORS = ["#ff95ab", "#f06d8b", "#ffcfae", "#e8c98a", "#c8b8ff", "#ffd3dd"];

// SVG bunny — soft pastel
function BunnySVG({ size = 78 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="bunnyBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fce4ea" />
        </radialGradient>
        <radialGradient id="bunnyEar" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd3dd" />
          <stop offset="100%" stopColor="#ff95ab" />
        </radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* ears */}
      <ellipse cx="44" cy="28" rx="9" ry="22" fill="#ffffff" />
      <ellipse cx="76" cy="28" rx="9" ry="22" fill="#ffffff" />
      <ellipse cx="44" cy="32" rx="5" ry="16" fill="url(#bunnyEar)" />
      <ellipse cx="76" cy="32" rx="5" ry="16" fill="url(#bunnyEar)" />
      {/* head */}
      <circle cx="60" cy="68" r="34" fill="url(#bunnyBody)" />
      {/* cheeks */}
      <circle cx="42" cy="76" r="6" fill="#ffc1cf" opacity="0.7" />
      <circle cx="78" cy="76" r="6" fill="#ffc1cf" opacity="0.7" />
      {/* eyes */}
      <ellipse cx="49" cy="64" rx="3" ry="4.2" fill="#3a2a3a" />
      <ellipse cx="71" cy="64" rx="3" ry="4.2" fill="#3a2a3a" />
      <circle cx="50" cy="62.5" r="1" fill="#fff" />
      <circle cx="72" cy="62.5" r="1" fill="#fff" />
      {/* nose + mouth */}
      <path d="M58 73 Q60 75 62 73 Q60 77 58 73Z" fill="#f06d8b" />
      <path d="M60 76 Q56 80 53 78" stroke="#b8466a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M60 76 Q64 80 67 78" stroke="#b8466a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* tiny crown */}
      <path d="M50 36 L54 30 L60 34 L66 30 L70 36 Z" fill="#e8c98a" stroke="#b88a3a" strokeWidth="0.8" />
      <circle cx="60" cy="35" r="1.5" fill="#f06d8b" />
    </svg>
  );
}

function Petals() {
  // Generate 18 petals with random positions/durations
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const left = Math.random() * 100;
      const dur = 12 + Math.random() * 14;
      const delay = Math.random() * -20;
      const size = 8 + Math.random() * 14;
      return { id: i, left, dur, delay, size };
    });
  }, []);
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  // ============== Audio ==============
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioState, setAudioState] = useState<"idle" | "ready" | "error">("idle");

  useEffect(() => {
    const audio = new Audio("/assets/kicau-mania-reff.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "metadata";
    audioRef.current = audio;

    const onCanPlay = () => setAudioState("ready");
    const onError = () => setAudioState("error");
    const onPlay = () => setAudioPlaying(true);
    const onPause = () => setAudioPlaying(false);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("loadeddata", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("loadeddata", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState === "error") return;
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setAudioState("error");
    }
  }, [audioState]);

  // ============== FX (confetti + hearts + bubble + cats) ==============
  type FxItem = { id: number; type: "confetti" | "heart"; left: number; color: string; dx: number; hx: number; delay: number; top?: number };
  type CatItem = { id: number; x: number; y: number; scale: number; rotation: number; flipped: boolean; height: number };
  const [fx, setFx] = useState<FxItem[]>([]);
  const [cats, setCats] = useState<CatItem[]>([]);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bunnyBubble, setBunnyBubble] = useState<string | null>(null);
  const [bunnyJump, setBunnyJump] = useState(false);
  const fxIdRef = useRef(0);
  const catIdRef = useRef(0);

  const spawnCat = useCallback((opts?: { x?: number; y?: number; height?: number }) => {
    catIdRef.current += 1;
    const id = catIdRef.current;
    const x = opts?.x ?? 12 + Math.random() * 76;
    const y = opts?.y ?? 18 + Math.random() * 60;
    const height = opts?.height ?? 160 + Math.random() * 140;
    const scale = 0.85 + Math.random() * 0.35;
    const rotation = -10 + Math.random() * 20;
    const flipped = Math.random() < 0.5;
    setCats((cur) => {
      const next = [...cur, { id, x, y, scale, rotation, flipped, height }];
      // Cap to MAX_CATS — drop the oldest
      return next.length > MAX_CATS ? next.slice(next.length - MAX_CATS) : next;
    });
  }, []);

  const removeCat = useCallback((id: number) => {
    setCats((cur) => cur.filter((c) => c.id !== id));
  }, []);

  const spawnCatBurst = useCallback((count = 4) => {
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnCat(), i * 220);
    }
  }, [spawnCat]);

  const launchConfetti = useCallback(() => {
    const items: FxItem[] = Array.from({ length: 80 }, () => {
      fxIdRef.current += 1;
      return {
        id: fxIdRef.current,
        type: "confetti" as const,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        dx: -120 + Math.random() * 240,
        hx: 0,
        delay: Math.random() * 0.6,
      };
    });
    setFx((cur) => [...cur, ...items]);
    // Auto cleanup
    window.setTimeout(() => {
      setFx((cur) => cur.filter((i) => !items.find((it) => it.id === i.id)));
    }, 5500);
  }, []);

  const launchHearts = useCallback((originX?: number, originY?: number) => {
    const items: FxItem[] = Array.from({ length: 8 }, () => {
      fxIdRef.current += 1;
      return {
        id: fxIdRef.current,
        type: "heart" as const,
        left: originX !== undefined ? originX : 50 + (Math.random() - 0.5) * 30,
        color: "#f06d8b",
        dx: 0,
        hx: -40 + Math.random() * 80,
        delay: Math.random() * 0.4,
        top: originY,
      };
    });
    setFx((cur) => [...cur, ...items]);
    window.setTimeout(() => {
      setFx((cur) => cur.filter((i) => !items.find((it) => it.id === i.id)));
    }, 3200);
  }, []);

  const showBubble = useCallback((text: string) => {
    setBubbleText(text);
    window.setTimeout(() => setBubbleText(null), 3400);
  }, []);

  // ============== Hero open gift ==============
  const messageRef = useRef<HTMLElement | null>(null);
  const handleOpenGift = useCallback(() => {
    launchConfetti();
    launchHearts(50, 30);
    showBubble("Selamat ulang tahun, Belinda!");
    setBunnyJump(true);
    window.setTimeout(() => setBunnyJump(false), 700);
    spawnCatBurst(3);
    window.setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }, [launchConfetti, launchHearts, showBubble, spawnCatBurst]);

  // ============== Bunny ==============
  const handleBunnyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setBunnyJump(true);
    window.setTimeout(() => setBunnyJump(false), 700);
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const yPct = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    launchHearts(xPct, yPct);
    const text = BUNNY_BUBBLES[Math.floor(Math.random() * BUNNY_BUBBLES.length)];
    setBunnyBubble(text);
    window.setTimeout(() => setBunnyBubble(null), 2800);
    // Easter egg: spawn a layered chroma-keyed cat at random position
    spawnCat();
  }, [launchHearts, spawnCat]);

  // ============== Lightbox ==============
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [brokenImgs, setBrokenImgs] = useState<Record<number, boolean>>({});

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const nextPhoto = useCallback(() => {
    setLightboxIdx((cur) => (cur === null ? null : (cur + 1) % PHOTOS.length));
  }, []);
  const prevPhoto = useCallback(() => {
    setLightboxIdx((cur) => (cur === null ? null : (cur - 1 + PHOTOS.length) % PHOTOS.length));
  }, []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx, closeLightbox, nextPhoto, prevPhoto]);

  // ============== Auto-scroll gallery ==============
  const galleryRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    let timer: number | undefined;
    let paused = false;

    const tick = () => {
      if (paused || lightboxIdx !== null) return;
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      if (maxScroll <= 0) return;
      const next = gallery.scrollLeft + 280;
      if (next >= maxScroll - 4) {
        gallery.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        gallery.scrollTo({ left: next, behavior: "smooth" });
      }
    };

    timer = window.setInterval(tick, 4500);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    gallery.addEventListener("mouseenter", pause);
    gallery.addEventListener("mouseleave", resume);
    gallery.addEventListener("touchstart", pause, { passive: true });
    gallery.addEventListener("touchend", resume);

    return () => {
      if (timer) window.clearInterval(timer);
      gallery.removeEventListener("mouseenter", pause);
      gallery.removeEventListener("mouseleave", resume);
      gallery.removeEventListener("touchstart", pause);
      gallery.removeEventListener("touchend", resume);
    };
  }, [lightboxIdx]);

  // ============== Closing actions ==============
  const galleryRefForScroll = galleryRef;
  const scrollToGallery = useCallback(() => {
    const el = document.getElementById("gallery");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const playBunnyAnim = useCallback(() => {
    setBunnyJump(true);
    window.setTimeout(() => setBunnyJump(false), 700);
    const text = BUNNY_BUBBLES[Math.floor(Math.random() * BUNNY_BUBBLES.length)];
    setBunnyBubble(text);
    window.setTimeout(() => setBunnyBubble(null), 2800);
    launchHearts(94, 88);
    spawnCat();
  }, [launchHearts, spawnCat]);

  const summonCatParade = useCallback(() => {
    spawnCatBurst(6);
    showBubble("Pesta kucing dimulai!");
  }, [spawnCatBurst, showBubble]);

  return (
    <div className="app">
      <Petals />

      {/* ============== HERO ============== */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">with all my heart</div>
          <h1 className="hero-title">
            Happy 24<sup style={{ fontSize: "0.5em", verticalAlign: "super" }}>th</sup> Birthday
            <span className="hero-name">Aprillia Belinda Safitri</span>
          </h1>
          <p className="hero-sub">
            Untuk seseorang yang kuat, hebat, dan selalu berusaha melangkah meski tidak semua orang tahu beratnya perjalananmu.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleOpenGift}>
              <span style={{ fontSize: "1.1em" }}>🎁</span> Buka Hadiah Kecil Ini
            </button>
            <button className="btn btn-soft" onClick={toggleAudio} disabled={audioState === "error"}>
              {audioState === "error"
                ? "Backsound belum tersedia"
                : audioPlaying
                ? <>⏸ Pause Backsound</>
                : <>▶ Putar Backsound</>}
            </button>
          </div>
          <div className="hero-divider">23 · menjadi · 24</div>
          <div className="hero-meta">selamat menempuh tahun baru, Belinda</div>
        </div>
      </section>

      {/* ============== GALERI ============== */}
      <section id="gallery">
        <div className="section-head">
          <div className="section-eyebrow">memory lane</div>
          <h2 className="section-title">Potongan Kenangan yang Pernah Menjadi<br />Bagian dari Perjalananmu</h2>
          <p className="section-subtitle">
            Geser ke samping untuk melihat lebih banyak. Sentuh setiap foto untuk membukanya lebih dekat.
          </p>
        </div>

        <div className="gallery-wrap">
          <div className="gallery" ref={galleryRefForScroll}>
            {PHOTOS.map((photo, idx) => (
              <button
                key={idx}
                className="polaroid"
                onClick={() => setLightboxIdx(idx)}
                aria-label={`Buka foto: ${photo.caption}`}
              >
                <span className="polaroid-tape" aria-hidden="true" />
                {brokenImgs[idx] ? (
                  <div className="polaroid-img broken">Foto belum tersedia</div>
                ) : (
                  <img
                    className="polaroid-img"
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    onError={() => setBrokenImgs((s) => ({ ...s, [idx]: true }))}
                  />
                )}
                <div className="polaroid-caption">{photo.caption}</div>
              </button>
            ))}
          </div>
          <div className="gallery-hint">↔ geser untuk menelusuri kenangan</div>
        </div>
      </section>

      {/* ============== PESAN UTAMA ============== */}
      <section ref={messageRef} id="pesan">
        <div className="section-head">
          <div className="section-eyebrow">untuk yang kami sayang</div>
          <h2 className="section-title">Pesan Kecil Untuk Aprillia</h2>
        </div>

        <article className="glass message-card">
          <div className="message-decor">— sebuah doa, dari hati —</div>
          <h3 className="message-title">Selamat ulang tahun yang ke-24</h3>
          <div className="message-body">
            <p>
              Selamat ulang tahun yang ke-24, <em>Aprillia Belinda Safitri</em>.
            </p>
            <p>
              Meskipun di luar sana kamu sering harus berjuang sendiri dalam mengambil keputusan,
              menghadapi masalah, serta melewati senang dan sedih yang mungkin tidak selalu semua orang tahu,
              percayalah bahwa doa orang tua selalu menyertaimu.
            </p>
            <p>
              Doa ayah dan almarhumah ibu akan selalu menjadi cahaya dalam setiap langkahmu.
              Kami bangga memiliki anak seperti kamu. Kamu mungkin merasa belum menjadi apa-apa,
              tetapi bagi kami, kamu sudah menjadi seseorang yang luar biasa karena telah bertahan,
              berjuang, dan terus melangkah sejauh ini.
            </p>
            <p>
              Keputusanmu untuk berhenti bekerja demi fokus kuliah bukanlah hal yang mudah.
              Itu adalah pilihan yang penuh pertimbangan, keberanian, dan tanggung jawab.
              Sebentar lagi kamu akan menyelesaikan perjalanan kuliahmu, dan itu adalah pencapaian
              yang tidak semua orang mampu lalui dengan mudah.
            </p>
            <p>
              Kamu sudah memberikan lebih dari sekadar menjalani rutinitas. Kamu sudah menunjukkan
              bahwa perjuangan, kesabaran, dan keyakinan bisa membawamu sampai di titik ini.
            </p>
            <p>
              Sekali lagi, selamat ulang tahun. Jadilah anak yang selalu berbakti kepada orang tua,
              tetap menjaga tata krama, rendah hati, kuat dalam menghadapi kehidupan, dan semoga kelak
              kamu bisa menjadi pribadi yang bermanfaat bagi orang-orang di sekitarmu.
            </p>
            <p>
              Teruslah melangkah, Belinda. Kamu tidak pernah benar-benar sendiri.
              Doa, cinta, dan kebanggaan kami selalu menyertaimu.
            </p>
          </div>
          <div className="message-sign">— Made from Afgan —</div>
        </article>
      </section>

      {/* ============== DOA & HARAPAN ============== */}
      <section id="harapan">
        <div className="section-head">
          <div className="section-eyebrow">harapan baik</div>
          <h2 className="section-title">Doa Baik Untuk Usia 24</h2>
          <p className="section-subtitle">
            Enam doa kecil yang ingin terus mengiringi setiap langkahmu di tahun ini.
          </p>
        </div>
        <div className="wishes">
          {WISHES.map((w, i) => (
            <div className="wish-card" key={i}>
              <div className="wish-icon">✦</div>
              <p className="wish-text">{w}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== PENUTUP ============== */}
      <section className="closing" id="closing">
        <div className="closing-glow" aria-hidden="true" />
        <div className="section-eyebrow">penutup</div>
        <h2 className="closing-title">
          “Semoga usia 24 menjadi awal dari banyak hal baik
          yang datang dalam hidupmu.”
        </h2>
        <p className="closing-sub">
          Terima kasih sudah bertahan, berjuang, dan tetap menjadi Belinda yang kuat.
        </p>
        <div className="closing-actions">
          <button className="btn btn-primary" onClick={() => { launchConfetti(); launchHearts(50, 40); }}>
            ✨ Tampilkan Confetti Lagi
          </button>
          <button className="btn btn-soft" onClick={scrollToGallery}>
            📷 Lihat Kenangan Lagi
          </button>
          <button className="btn btn-ghost" onClick={playBunnyAnim}>
            🐰 Putar Animasi Kelinci
          </button>
          <button className="btn btn-ghost" onClick={summonCatParade}>
            🐱 Panggil Pasukan Kucing
          </button>
        </div>
        <div className="closing-signature">— happy 24, Belinda —</div>
        <div className="bottom-spacer" />
      </section>

      {/* ============== AUDIO DOCK ============== */}
      <div className="audio-dock" role="region" aria-label="Pemutar musik">
        <button
          className="audio-btn"
          onClick={toggleAudio}
          aria-label={audioPlaying ? "Pause backsound" : "Putar backsound"}
          disabled={audioState === "error"}
        >
          {audioState === "error" ? "!" : audioPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <div className="audio-status">
          <span className="audio-title">Kicau Mania — Reff</span>
          <span className="audio-sub">
            {audioState === "error" ? (
              "Backsound belum tersedia."
            ) : audioPlaying ? (
              <>
                <span className="eq" aria-hidden="true"><span/><span/><span/><span/></span>
                sedang diputar
              </>
            ) : (
              "siap diputar"
            )}
          </span>
        </div>
      </div>

      {/* ============== BUNNY ============== */}
      <div className="bunny-wrap" aria-live="polite">
        {bunnyBubble && <div className="bunny-bubble">{bunnyBubble}</div>}
        <div
          className={`bunny ${bunnyJump ? "jump" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Kelinci lucu — klik untuk memanggil kucing"
          onClick={handleBunnyClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              (e.currentTarget as HTMLElement).click();
            }
          }}
        >
          <span className="bunny-easter-hint">klik aku 🐱</span>
          <BunnySVG />
        </div>
      </div>

      {/* ============== CAT EASTER EGG LAYER ============== */}
      <div className="cat-layer" aria-hidden="true">
        {cats.map((c) => (
          <ChromaCat
            key={c.id}
            id={c.id}
            src={CAT_VIDEO_SRC}
            x={c.x}
            y={c.y}
            scale={c.scale}
            rotation={c.rotation}
            flipped={c.flipped}
            height={c.height}
            onDone={removeCat}
          />
        ))}
      </div>

      {/* ============== FX layer ============== */}
      <div className="fx-layer" aria-hidden="true">
        {fx.map((item) =>
          item.type === "confetti" ? (
            <span
              key={item.id}
              className="confetti"
              style={{
                left: `${item.left}%`,
                background: item.color,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationDelay: `${item.delay}s`,
                ["--dx" as never]: `${item.dx}px`,
              } as React.CSSProperties}
            />
          ) : (
            <span
              key={item.id}
              className="heart-fx"
              style={{
                left: `${item.left}%`,
                top: item.top !== undefined ? `${item.top}%` : "70%",
                animationDelay: `${item.delay}s`,
                ["--hx" as never]: `${item.hx}px`,
              } as React.CSSProperties}
            >
              ❤
            </span>
          )
        )}
      </div>

      {bubbleText && <div className="greeting-bubble">{bubbleText}</div>}
    </div>
  );
}

export default App;
