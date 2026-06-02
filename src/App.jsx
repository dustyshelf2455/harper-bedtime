import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const ASSETS = import.meta.env.BASE_URL + "assets/";
const FAMILY_MODE = new URLSearchParams(window.location.search).has("family");

// ==================== TASK LIST (Fixed Order per Spec) ====================
const TASKS = [
  { id: "goodnight", label: "Say Goodnight", icon: "💕", princessIcon: "💖", mermaidIcon: "💙", kpopIcon: "💜", type: "check", scene: { princess: "🏰 Royal Throne Room", mermaid: "🐚 Coral Greeting Hall", kpop: "🎤 Magic Stage Entry" }, bgHue: { princess: 280, mermaid: 210, kpop: 285 } },
  { id: "pajamas", label: "Put on Pajamas", icon: "👗", princessIcon: "👸", mermaidIcon: "🧜‍♀️", kpopIcon: "🎀", type: "check", scene: { princess: "👗 Royal Dressing Chamber", mermaid: "🐠 Underwater Wardrobe", kpop: "🌟 Hunter Dressing Room" }, bgHue: { princess: 290, mermaid: 200, kpop: 290 } },
  { id: "clothes", label: "Pick Out Clothes", icon: "👚", princessIcon: "👗", mermaidIcon: "👚", kpopIcon: "✨", type: "check", scene: { princess: "✨ Princess Closet", mermaid: "🌊 Shell Wardrobe", kpop: "✨ Stage Closet" }, bgHue: { princess: 300, mermaid: 195, kpop: 295 } },
  { id: "teeth", label: "Brush Teeth", icon: "🪥", princessIcon: "✨", mermaidIcon: "💎", kpopIcon: "⚡", type: "timer", duration: 60, scene: { princess: "🪥 Royal Bathroom", mermaid: "🫧 Coral Cave Bathroom", kpop: "⚡ Lightning Bathroom" }, bgHue: { princess: 285, mermaid: 205, kpop: 280 } },
  { id: "mouthwash", label: "Mouthwash", icon: "🫧", princessIcon: "🌟", mermaidIcon: "🫧", kpopIcon: "💫", type: "check", scene: { princess: "🌟 Sparkling Vanity", mermaid: "💎 Crystal Springs", kpop: "💫 Sparkle Vanity" }, bgHue: { princess: 275, mermaid: 215, kpop: 275 } },
  { id: "hair", label: "Comb Hair", icon: "💇‍♀️", princessIcon: "👑", mermaidIcon: "🐚", kpopIcon: "💖", type: "check", scene: { princess: "👑 Royal Mirror", mermaid: "🪞 Tide Pool Mirror", kpop: "💖 Idol Mirror" }, bgHue: { princess: 295, mermaid: 190, kpop: 300 } },
  { id: "pee", label: "Try to Go Pee", icon: "🚽", princessIcon: "🏰", mermaidIcon: "🐠", kpopIcon: "🌙", type: "check", scene: { princess: "🏰 Castle Restroom", mermaid: "🐠 Quiet Lagoon", kpop: "🌙 Backstage Restroom" }, bgHue: { princess: 270, mermaid: 220, kpop: 270 } },
  { id: "nightlight", label: "Nightlight & Sound", icon: "🌙", princessIcon: "⭐", mermaidIcon: "🌊", kpopIcon: "🌠", type: "check", scene: { princess: "⭐ Starlit Tower", mermaid: "🌙 Moonlit Grotto", kpop: "🌠 Honmoon Tower" }, bgHue: { princess: 260, mermaid: 225, kpop: 265 } },
  { id: "babydolls", label: "Baby Doll Bedtime", icon: "🎎", princessIcon: "👶", mermaidIcon: "👶", kpopIcon: "🐯", type: "babydoll", scene: { princess: "👶 Royal Nursery", mermaid: "🍼 Sea Cradle Cove", kpop: "🐯 Tiger Cub Nursery" }, bgHue: { princess: 310, mermaid: 200, kpop: 310 } },
  { id: "book1", label: "Read Book 1", icon: "📖", princessIcon: "📖", mermaidIcon: "📖", kpopIcon: "📖", type: "check", counter: "1 of 2", scene: { princess: "📖 Castle Library", mermaid: "📚 Sunken Library", kpop: "📖 Honmoon Library" }, bgHue: { princess: 265, mermaid: 218, kpop: 260 } },
  { id: "book2", label: "Read Book 2", icon: "📚", princessIcon: "📚", mermaidIcon: "📚", kpopIcon: "📚", type: "check", counter: "2 of 2", scene: { princess: "📚 Enchanted Reading Nook", mermaid: "🌟 Deep Sea Story Cave", kpop: "📚 Hunter Bedtime Story" }, bgHue: { princess: 255, mermaid: 230, kpop: 255 } },
];

// ==================== STICKER IMAGES ====================
// 20 per theme (princess-00..19, mermaid-00..19, kpop-00..19)
// 15 super stickers: rows 0/1/2 → princess/mermaid/kpop (super-00..14)
const STICKER_IMAGES = {
  princess: Array.from({ length: 20 }, (_, i) => ASSETS + `stickers/princess-${String(i).padStart(2, "0")}.png`),
  mermaid:  Array.from({ length: 20 }, (_, i) => ASSETS + `stickers/mermaid-${String(i).padStart(2, "0")}.png`),
  kpop:     Array.from({ length: 20 }, (_, i) => ASSETS + `stickers/kpop-${String(i).padStart(2, "0")}.png`),
};

const SUPER_STICKER_IMAGES = {
  princess: Array.from({ length: 5 }, (_, i) => ASSETS + `stickers/super-${String(i).padStart(2, "0")}.png`),
  mermaid:  Array.from({ length: 5 }, (_, i) => ASSETS + `stickers/super-${String(i + 5).padStart(2, "0")}.png`),
  kpop:     Array.from({ length: 5 }, (_, i) => ASSETS + `stickers/super-${String(i + 10).padStart(2, "0")}.png`),
};

// True for new image stickers; false for legacy emoji strings already on Harper's shelf
const isImageSticker = (s) => typeof s === "string" && s.startsWith("/");
const isSuperSticker = (s) => isImageSticker(s) && s.includes("/super-");

// ==================== DEMO STICKERS (Dad Mode) ====================
// Emoji stickers for the splash-screen trophy shelf preview.
// When the routine starts in Dad Mode, these are replaced with 2 copies of each
// theme image sticker so the first pick always triggers the super-sticker screen.
const DEMO_STICKERS = [
  "🦄","🌈","🎀","🦋","🌸","💖","🍓","🐱","🎠","🧸",
  "🐬","🦀","🐙","🐳","🦩","🌺","🍉","🐰","🎪","🧁",
  "⭐","🌙","🎵","🎨","🎭","🎤","⚡","💜","🐯",
];

// ==================== THEME COLORS ====================
const THEMES = {
  princess: {
    primary: "#E84B8A",
    secondary: "#C23A6F",
    accent: "#F0C239",
    accentDark: "#D4A82F",
    highlight: "#FFB6D3",
    bg1: "#2d1b4e",
    bg2: "#1a0a2e",
    bg3: "#2d1040",
    softBg: "#FFF0F5",
    softBorder: "#FFB6C1",
    textPrimary: "#F5E6FF",
    textSecondary: "#E8B4D8",
    textMuted: "#C9A0D4",
    shadowColor: "rgba(142, 36, 100, 0.5)",
    glowColor: "#E84B8A44",
    guide: ASSETS + "princess-character.webp",
    guideVictory: ASSETS + "princess-victory.webp",
    guideSleep: ASSETS + "princess-sleep.webp",
    progressIcon: "💎",
    progressIconImg: ASSETS + "princess-gem.webp",
    progressIconEmpty: "◇",
    particle: "✨",
    dreamMsg: "Sweet dreams, Princess Harper!",
    timerParticle: "✨",
    gradientBtn: "linear-gradient(180deg, #E84B8A 0%, #C23A6F 100%)",
    insetShadow: "inset 0 -4px 0 #9E2A5A",
    specularHighlight: "rgba(255, 200, 230, 0.5)",
    progressGlow: "rgba(232, 75, 138, 0.5)",
    treasuryBg: "linear-gradient(180deg, rgba(45, 16, 64, 0.88) 0%, rgba(26, 10, 46, 0.92) 100%)",
    treasuryBorder: "rgba(232, 75, 138, 0.35)",
  },
  mermaid: {
    primary: "#1AACA8",
    secondary: "#158F8C",
    accent: "#B8D8E8",
    accentDark: "#7FBCD2",
    highlight: "#87CEEB",
    bg1: "#0a1e3d",
    bg2: "#0a1628",
    bg3: "#0d2847",
    softBg: "#E0FFFF",
    softBorder: "#87CEEB",
    textPrimary: "#E0FFFF",
    textSecondary: "#A0D2E8",
    textMuted: "#7FBCD2",
    shadowColor: "rgba(10, 50, 80, 0.5)",
    glowColor: "#1AACA844",
    guide: ASSETS + "mermaid-character.webp",
    guideVictory: ASSETS + "mermaid-victory.webp",
    guideSleep: ASSETS + "mermaid-sleep.webp",
    progressIcon: "🐚",
    progressIconImg: ASSETS + "mermaid-shell.webp",
    progressIconEmpty: "○",
    particle: "💎",
    dreamMsg: "Sleep tight, little mermaid!",
    timerParticle: "💎",
    gradientBtn: "linear-gradient(180deg, #1AACA8 0%, #158F8C 100%)",
    insetShadow: "inset 0 -4px 0 #0E6E6C",
    specularHighlight: "rgba(200, 240, 255, 0.45)",
    progressGlow: "rgba(26, 172, 168, 0.5)",
    treasuryBg: "linear-gradient(180deg, rgba(10, 30, 61, 0.88) 0%, rgba(10, 22, 40, 0.92) 100%)",
    treasuryBorder: "rgba(26, 172, 168, 0.35)",
  },
  kpop: {
    primary: "#9D4EDD",
    secondary: "#6B2FA8",
    accent: "#FF6EC7",
    accentDark: "#D44BA0",
    highlight: "#C9A0F0",
    bg1: "#1f0a3a",
    bg2: "#07021a",
    bg3: "#2a0d4a",
    softBg: "#F3E6FF",
    softBorder: "#C9A0F0",
    textPrimary: "#F0E0FF",
    textSecondary: "#D4B5F0",
    textMuted: "#A88FC7",
    shadowColor: "rgba(60, 20, 100, 0.5)",
    glowColor: "#9D4EDD44",
    guide: ASSETS + "kpop-character.webp",
    guideVictory: ASSETS + "kpop-victory.webp",
    guideSleep: ASSETS + "kpop-sleep.webp",
    progressIcon: "🎤",
    progressIconImg: ASSETS + "kpop-mic.webp",
    progressIconEmpty: "○",
    particle: "💜",
    dreamMsg: "Couch! Couch! Couch! Sleep well, Hunter!",
    timerParticle: "💜",
    gradientBtn: "linear-gradient(180deg, #9D4EDD 0%, #6B2FA8 100%)",
    insetShadow: "inset 0 -4px 0 #4F1B8A",
    specularHighlight: "rgba(230, 200, 255, 0.5)",
    progressGlow: "rgba(157, 78, 221, 0.5)",
    treasuryBg: "linear-gradient(180deg, rgba(31, 10, 58, 0.88) 0%, rgba(7, 2, 26, 0.92) 100%)",
    treasuryBorder: "rgba(157, 78, 221, 0.35)",
  },
};

// ==================== PNG CASTLE FRAME (PRINCESS) ====================
function CastleFrame({ taskIndex = 0 }) {
  const dim = 1 - ((taskIndex || 0) / TASKS.length) * 0.2;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 1,
    }}>
      <img
        src={ASSETS + "princess-frame.webp"}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          opacity: dim,
        }}
      />
    </div>
  );
}

// ==================== PNG UNDERWATER FRAME (MERMAID) ====================
function UnderwaterFrame({ taskIndex = 0 }) {
  const dim = 1 - ((taskIndex || 0) / TASKS.length) * 0.2;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 1,
    }}>
      <img
        src={ASSETS + "mermaid-frame.webp"}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          opacity: dim,
        }}
      />
    </div>
  );
}

// ==================== PNG NEON STAGE FRAME (KPOP) ====================
function KpopFrame({ taskIndex = 0 }) {
  const dim = 1 - ((taskIndex || 0) / TASKS.length) * 0.2;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 1,
    }}>
      <img
        src={ASSETS + "kpop-frame.webp"}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          opacity: dim,
        }}
      />
    </div>
  );
}

// ==================== STARFIELD (PRINCESS) ====================
function Starfield({ count = 30, taskIndex = 0 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 70,
      size: Math.random() * 3 + 1, delay: Math.random() * 5, duration: Math.random() * 3 + 2,
    })), [count]);
  const visibleCount = Math.floor(count * (0.4 + ((taskIndex || 0) / TASKS.length) * 0.6));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.slice(0, visibleCount).map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "rgba(240, 194, 57, 0.7)",
          boxShadow: `0 0 ${s.size * 2}px rgba(240, 194, 57, 0.4)`,
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          willChange: "transform, opacity",
        }} />
      ))}
    </div>
  );
}

// ==================== BUBBLES (MERMAID) ====================
function BubbleField({ count = 12, taskIndex = 0 }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: 10 + Math.random() * 80, size: Math.random() * 12 + 4,
      delay: Math.random() * 12, duration: Math.random() * 12 + 10,
    })), [count]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {bubbles.map(b => (
        <div key={b.id} style={{
          position: "absolute", left: `${b.x}%`, bottom: "-5%",
          width: b.size, height: b.size, borderRadius: "50%",
          background: "transparent",
          border: "1px solid rgba(26, 172, 168, 0.25)",
          boxShadow: `inset -1px -1px 2px rgba(180, 220, 255, 0.15), 0 0 ${b.size}px rgba(26, 172, 168, 0.1)`,
          animation: `bubbleRise ${b.duration}s ease-in-out ${b.delay}s infinite`,
          willChange: "transform, opacity",
        }} />
      ))}
    </div>
  );
}

// ==================== NEON STARFIELD (KPOP) ====================
function NeonField({ count = 30, taskIndex = 0 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 80,
      size: Math.random() * 3 + 1.5, delay: Math.random() * 5, duration: Math.random() * 3 + 2,
      tint: i % 2 === 0 ? "rgba(255, 110, 199, 0.75)" : "rgba(157, 78, 221, 0.7)",
    })), [count]);
  const visibleCount = Math.floor(count * (0.4 + ((taskIndex || 0) / TASKS.length) * 0.6));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.slice(0, visibleCount).map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: s.tint,
          boxShadow: `0 0 ${s.size * 3}px ${s.tint}`,
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          willChange: "transform, opacity",
        }} />
      ))}
    </div>
  );
}

// ==================== PATTERN OVERLAY ====================
function PatternOverlay({ theme }) {
  const patterns = {
    princess: {
      image: `radial-gradient(circle at 20% 30%, #F0C239 1px, transparent 1px),
              radial-gradient(circle at 70% 60%, #E84B8A 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, #F0C239 0.8px, transparent 0.8px),
              radial-gradient(circle at 85% 15%, #E84B8A 0.8px, transparent 0.8px)`,
      size: "80px 80px, 120px 100px, 60px 90px, 100px 70px",
    },
    mermaid: {
      image: `radial-gradient(circle at 25% 25%, #1AACA8 1.2px, transparent 1.2px),
              radial-gradient(circle at 65% 55%, #7FBCD2 1px, transparent 1px),
              radial-gradient(circle at 45% 85%, #1AACA8 0.8px, transparent 0.8px),
              radial-gradient(circle at 80% 10%, #7FBCD2 0.8px, transparent 0.8px)`,
      size: "90px 90px, 110px 110px, 70px 100px, 100px 80px",
    },
    kpop: {
      image: `radial-gradient(circle at 22% 28%, #FF6EC7 1.2px, transparent 1.2px),
              radial-gradient(circle at 68% 58%, #9D4EDD 1px, transparent 1px),
              radial-gradient(circle at 42% 82%, #FF6EC7 0.8px, transparent 0.8px),
              radial-gradient(circle at 82% 12%, #9D4EDD 0.8px, transparent 0.8px)`,
      size: "85px 85px, 115px 105px, 65px 95px, 105px 75px",
    },
  };
  const p = patterns[theme] || patterns.princess;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.04,
      backgroundImage: p.image,
      backgroundSize: p.size,
    }} />
  );
}

// ==================== VIGNETTE ====================
function Vignette({ intensity = 0.5, theme = "princess" }) {
  const tints = {
    princess: `rgba(45, 10, 60, ${intensity})`,
    mermaid:  `rgba(5, 15, 40, ${intensity})`,
    kpop:     `rgba(25, 5, 55, ${intensity})`,
  };
  const color = tints[theme] || tints.princess;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
      background: `radial-gradient(ellipse at center, transparent 40%, ${color} 100%)`,
    }} />
  );
}

// ==================== AMBIENT PARTICLES ====================
function AmbientParticles({ theme }) {
  const sets = {
    princess: ["✨", "⭐", "🌟"],
    mermaid:  ["🫧", "✨", "🌊"],
    kpop:     ["💜", "✨", "🎵"],
  };
  const emojis = sets[theme] || sets.princess;
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i, x: Math.random() * 100, size: Math.random() * 12 + 8,
      delay: Math.random() * 10, duration: Math.random() * 14 + 12,
      emoji: emojis[i % emojis.length],
    })), [theme]);
  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", fontSize: p.size, left: `${p.x}%`, bottom: "-5%",
          animation: `floatUpSlow ${p.duration}s linear ${p.delay}s infinite`,
          opacity: 0, pointerEvents: "none", zIndex: 3, willChange: "transform, opacity",
        }}>{p.emoji}</div>
      ))}
    </>
  );
}

// ==================== GUIDE CHARACTER ====================
function GuideCharacter({ theme, size = 56, splashMode = false, variant = "normal" }) {
  const t = THEMES[theme];
  const [twirlSrc, setTwirlSrc] = useState(variant === "victory" ? t.guide : null);
  useEffect(() => {
    if (variant === "victory") {
      const preload = new Image();
      preload.src = t.guideVictory;
      setTwirlSrc(t.guide);
      const timer = setTimeout(() => setTwirlSrc(t.guideVictory), 375);
      return () => clearTimeout(timer);
    }
  }, [variant, theme]);
  const src = variant === "victory" ? (twirlSrc || t.guideVictory) : variant === "sleep" ? t.guideSleep : t.guide;
  const isImage = src.startsWith("/");
  if (isImage) {
    const h = splashMode ? `clamp(${size}px, 28dvh, ${size * 1.8}px)` : size * 1.8;
    if (variant === "victory") {
      return (
        <div style={{ perspective: 800, position: "relative", display: "inline-block" }}>
          <div style={{
            position: "absolute", inset: "-40%", borderRadius: "50%",
            background: `radial-gradient(circle, ${t.accent}cc 0%, ${t.primary}66 35%, transparent 70%)`,
            animation: "victoryBurst 1.5s ease-out forwards", pointerEvents: "none", zIndex: 1, opacity: 0,
          }} />
          <img src={src} alt="Guide character" style={{
            height: h, width: "auto", objectFit: "contain", display: "block", margin: "0 auto",
            animation: "victoryTwirl 1.5s cubic-bezier(0.1, 0, 0.2, 1) forwards",
            transformStyle: "preserve-3d",
          }} />
        </div>
      );
    }
    const anim = variant === "sleep" ? "sleepDrift 1.2s ease-out both" : undefined;
    return (
      <img src={src} alt="Guide character" style={{ height: h, width: "auto", objectFit: "contain", display: "block", margin: "0 auto", animation: anim }} />
    );
  }
  return <span style={{ fontSize: size }}>{t.guide}</span>;
}

// ==================== BLUEY-STYLE BUTTON ====================
function LudoButton({ children, onClick, theme, size = "large", disabled = false, style = {} }) {
  const t = THEMES[theme];
  const [pressed, setPressed] = useState(false);
  const sizeStyles = {
    large: { padding: "clamp(14px, 2.5dvh, 22px) 40px", fontSize: "clamp(24px, 4dvh, 32px)", borderRadius: 28, minHeight: "clamp(56px, 10dvh, 80px)" },
    medium: { padding: "clamp(10px, 2dvh, 16px) 28px", fontSize: "clamp(20px, 3.5dvh, 26px)", borderRadius: 22, minHeight: "clamp(44px, 8dvh, 60px)" },
    small: { padding: "clamp(8px, 1.5dvh, 12px) 22px", fontSize: "clamp(18px, 3dvh, 24px)", borderRadius: 18, minHeight: "clamp(38px, 6dvh, 50px)" },
  };
  const s = sizeStyles[size];
  return (
    <button onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        ...s, fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
        color: disabled ? "#ffffff66" : "#FFFDF5", letterSpacing: 1,
        border: `4px solid ${disabled ? "#ffffff22" : t.secondary}`,
        background: disabled ? "#ffffff15" : t.gradientBtn,
        boxShadow: disabled ? "none" : (pressed ? `inset 0 2px 0 ${t.secondary}` : t.insetShadow),
        cursor: disabled ? "default" : "pointer",
        position: "relative", overflow: "hidden",
        transform: pressed ? "scale(0.96) translateY(2px)" : (disabled ? "none" : "scale(1)"),
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
        width: "100%", textAlign: "center",
        opacity: disabled ? 0.4 : 1,
        animation: (!disabled && !pressed) ? "pulse 2.5s ease-in-out infinite" : "none",
        touchAction: "manipulation",
        ...style,
      }}
    >
      {!disabled && <div style={{
        position: "absolute", top: 6, left: 12, width: "40%", height: "35%",
        borderRadius: "50%",
        background: `radial-gradient(ellipse at center, ${t.specularHighlight} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />}
      {children}
    </button>
  );
}

// ==================== PROGRESS TRACKER ====================
function ProgressTracker({ completedTasks, currentIndex, theme, onNavigate, compact = false }) {
  const t = THEMES[theme];
  const completedCount = TASKS.filter(task => completedTasks[task.id]).length;
  const slotSize = 44;

  return (
    <div style={{ paddingTop: compact ? 4 : 10, paddingLeft: 14, paddingRight: 14, paddingBottom: "calc(6px + env(safe-area-inset-bottom, 0px))", position: "relative", zIndex: 10 }}>
      {/* Treasure tray background */}
      <div style={{
        background: t.treasuryBg,
        border: `2.5px solid ${t.treasuryBorder}`,
        borderRadius: 22,
        padding: "10px 10px 8px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 ${6 + completedCount * 3}px ${t.progressGlow}, inset 0 1px 0 ${t.accent}15`,
      }}>
        {/* Subtle inner highlight for Ludo 3D feel */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "40%",
          borderRadius: "0 0 50% 50%",
          background: `radial-gradient(ellipse at center top, ${t.accent}12 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Icon grid — 6 top, 5 bottom centered */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 6px", position: "relative" }}>
          {TASKS.map((task, i) => {
            const done = completedTasks[task.id];
            const isCurrent = i === currentIndex;

            return (
              <button
                key={task.id}
                onClick={() => done ? onNavigate(i) : undefined}
                aria-label={`${task.label}${done ? " — done" : isCurrent ? " — current" : ""}`}
                style={{
                  width: slotSize, height: slotSize,
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 0, lineHeight: 1,
                  cursor: done ? "pointer" : "default",
                  touchAction: "manipulation",
                  transition: "all 0.3s ease",
                  border: done
                    ? `3px solid ${t.accent}`
                    : isCurrent
                      ? `2.5px solid ${t.primary}88`
                      : `2px solid ${t.textMuted}33`,
                  background: done
                    ? `linear-gradient(145deg, ${t.primary}, ${t.secondary})`
                    : isCurrent
                      ? `${t.primary}28`
                      : `${t.textMuted}15`,
                  boxShadow: done
                    ? `0 0 10px ${t.progressGlow}, 0 0 20px ${t.glowColor}, inset 0 -2px 0 ${t.secondary}88`
                    : isCurrent
                      ? `0 0 14px ${t.primary}33, inset 0 -1px 0 ${t.primary}22`
                      : "none",
                  animation: done
                    ? "gemGlow 2.5s ease-in-out infinite"
                    : isCurrent && !done
                      ? "softPulse 1.5s ease-in-out infinite"
                      : "none",
                }}
              >
                {done ? (
                  t.progressIconImg ? (
                    <img src={t.progressIconImg} alt="" style={{
                      width: 38, height: 38,
                      objectFit: "cover",
                      borderRadius: 11,
                      animation: "gemPop 0.5s ease-out",
                      filter: "brightness(1.15)",
                    }} />
                  ) : (
                    <span style={{
                      fontSize: 28, lineHeight: 1,
                      animation: "gemPop 0.5s ease-out",
                      filter: "brightness(1.15)",
                    }}>
                      {t.progressIcon}
                    </span>
                  )
                ) : (
                  <span style={{
                    width: isCurrent ? 12 : 8,
                    height: isCurrent ? 12 : 8,
                    borderRadius: "50%",
                    background: isCurrent
                      ? `radial-gradient(circle, ${t.primary} 0%, ${t.primary}88 100%)`
                      : `${t.textMuted}33`,
                    display: "block",
                    boxShadow: isCurrent ? `0 0 8px ${t.primary}44` : "none",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== FAST FORWARD BUTTON ====================
function FastForwardIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="currentColor" aria-hidden="true">
      <polygon points="0,0 0,14 9,7" />
      <polygon points="11,0 11,14 20,7" />
    </svg>
  );
}

const FF_CLICKS_REQUIRED = 4;

function FastForwardButton({ theme, onPress }) {
  const t = THEMES[theme];
  const [pressed, setPressed] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const resetRef = useRef(null);

  const handleClick = () => {
    const next = clickCount + 1;
    clearTimeout(resetRef.current);
    if (next >= FF_CLICKS_REQUIRED) {
      setClickCount(0);
      onPress();
    } else {
      setClickCount(next);
      resetRef.current = setTimeout(() => setClickCount(0), 2000);
    }
  };

  useEffect(() => () => clearTimeout(resetRef.current), []);

  return (
    <button
      onClick={handleClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      aria-label="Fast-forward timer"
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 10px)",
        right: 14,
        width: 48,
        height: clickCount > 0 ? 58 : 48,
        borderRadius: 14,
        background: clickCount > 0 ? `${t.primary}55` : (pressed ? `${t.primary}66` : `${t.primary}28`),
        border: `2px solid ${t.primary}${clickCount > 0 ? "88" : "55"}`,
        color: t.textPrimary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        cursor: "pointer",
        zIndex: 9999,
        opacity: pressed ? 1 : 0.55 + clickCount * 0.12,
        transform: pressed ? "scale(0.92)" : "scale(1)",
        transition: "transform 0.1s ease, background 0.15s ease, opacity 0.15s ease, height 0.15s ease",
        touchAction: "manipulation",
        padding: 0,
      }}
    >
      <FastForwardIcon />
      {clickCount > 0 && (
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: FF_CLICKS_REQUIRED - 1 }, (_, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: "50%",
              background: i < clickCount ? t.textPrimary : `${t.textPrimary}30`,
              transition: "background 0.1s ease",
            }} />
          ))}
        </div>
      )}
    </button>
  );
}

// ==================== SAND TIMER WITH PAUSE ====================
function SandTimer({ seconds, theme, running, paused, onComplete, onTogglePause }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const t = THEMES[theme];
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { setTimeLeft(seconds); }, [seconds]);
  useEffect(() => {
    if (running && !paused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); onCompleteRef.current?.(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, paused]);
  const progress = 1 - timeLeft / seconds;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 100, height: 160, position: "relative",
        background: theme === "princess"
          ? "linear-gradient(180deg, #FFF5F5 0%, #FFE4EC 100%)"
          : theme === "mermaid"
            ? "linear-gradient(180deg, #E0FFFF 0%, #B0E0E6 100%)"
            : "linear-gradient(180deg, #F8EEFF 0%, #E8D4FF 100%)",
        borderRadius: "42% 42% 42% 42% / 22% 22% 22% 22%",
        border: `4px solid ${t.secondary}`, overflow: "hidden",
        boxShadow: `0 0 24px ${t.glowColor}, ${t.insetShadow}`,
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${(1 - progress) * 45}%`, background: `${t.primary}55`, borderRadius: "42% 42% 0 0 / 22% 22% 0 0", transition: "height 1s linear" }} />
        <div style={{ position: "absolute", top: "44%", left: "28%", right: "28%", height: "12%", background: `${t.primary}18`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${progress * 45}%`, background: t.primary, borderRadius: "0 0 42% 42% / 0 0 22% 22%", transition: "height 1s linear" }} />
        {running && !paused && [0, 1, 2].map(i => (
          <div key={i} style={{ position: "absolute", left: "44%", top: "40%", fontSize: 14, animation: `fallDown 1.5s ease-in ${i * 0.5}s infinite` }}>{t.timerParticle}</div>
        ))}
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: t.textPrimary, textShadow: `0 0 12px ${t.glowColor}` }}>
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </div>
      {running && timeLeft > 0 && (
        <LudoButton theme={theme} size="small" onClick={onTogglePause} style={{ width: "auto", minWidth: 140 }}>
          {paused ? "▶️ Resume" : "⏸️ Pause"}
        </LudoButton>
      )}
    </div>
  );
}

// ==================== BABY DOLL SETUP ====================
function BabyDollSetup({ onStart, theme }) {
  const [minutes, setMinutes] = useState(5);
  const [pressed, setPressed] = useState(null);
  const t = THEMES[theme];
  const adjBtnStyle = (which) => ({
    width: 64, height: 64, borderRadius: 20,
    border: `3px solid ${t.secondary}`, fontSize: 28,
    cursor: "pointer", fontWeight: 700,
    background: t.gradientBtn, color: "#FFFDF5",
    boxShadow: pressed === which ? `inset 0 2px 0 ${t.secondary}` : t.insetShadow,
    transform: pressed === which ? "scale(0.92) translateY(2px)" : "scale(1)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    touchAction: "manipulation",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 24, background: `${t.primary}15`, borderRadius: 28, border: `3px dashed ${t.primary}44` }}>
      <div style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", color: t.textSecondary }}>Mom or Dad: Set timer!</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => setMinutes(m => Math.max(1, m - 1))}
          onPointerDown={() => setPressed("minus")}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
          onPointerCancel={() => setPressed(null)}
          style={adjBtnStyle("minus")}
        >−</button>
        <span style={{ fontSize: 44, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: t.textPrimary, minWidth: 110, textAlign: "center" }}>{minutes} min</span>
        <button
          onClick={() => setMinutes(m => Math.min(10, m + 1))}
          onPointerDown={() => setPressed("plus")}
          onPointerUp={() => setPressed(null)}
          onPointerLeave={() => setPressed(null)}
          onPointerCancel={() => setPressed(null)}
          style={adjBtnStyle("plus")}
        >+</button>
      </div>
      <LudoButton theme={theme} size="medium" onClick={() => onStart(minutes * 60)}>Start Baby Doll Time! 👶</LudoButton>
    </div>
  );
}

// ==================== CELEBRATION PARTICLES ====================
function CelebrationParticles({ theme, active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const emojiSets = {
      princess: ["✨", "⭐", "💖", "🌟", "👑", "💎"],
      mermaid:  ["💎", "🫧", "🐚", "🌊", "💙", "✨"],
      kpop:     ["🎤", "⚡", "✨", "🎵", "💜", "🌟", "💖"],
    };
    const emojis = emojiSets[theme] || emojiSets.princess;
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 18 + 10, delay: Math.random() * 1.5,
      duration: Math.random() * 2.5 + 1.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    })));
  }, [active, theme]);
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size, animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`, opacity: 0 }}>{p.emoji}</div>
      ))}
    </div>
  );
}

// ==================== SCENE WRAPPER (routine tasks) ====================
function SceneWrapper({ theme, children, taskIndex }) {
  const task = TASKS[taskIndex];
  const hue = task?.bgHue?.[theme] || 280;
  const bgGradients = {
    princess: `linear-gradient(170deg, hsl(${hue}, 45%, 18%) 0%, hsl(${hue}, 50%, 10%) 35%, hsl(${hue + 10}, 40%, 14%) 65%, hsl(${hue}, 55%, 8%) 100%)`,
    mermaid:  `linear-gradient(170deg, hsl(${hue}, 55%, 14%) 0%, hsl(${hue}, 60%, 8%) 35%, hsl(${hue + 10}, 50%, 12%) 65%, hsl(${hue}, 65%, 5%) 100%)`,
    kpop:     `linear-gradient(170deg, hsl(${hue}, 60%, 16%) 0%, hsl(${hue}, 65%, 9%) 35%, hsl(${hue + 15}, 55%, 13%) 65%, hsl(${hue}, 70%, 6%) 100%)`,
  };
  return (
    <div style={{
      height: "100%", minHeight: "100%", display: "flex", flexDirection: "column",
      background: bgGradients[theme] || bgGradients.princess,
      fontFamily: "'Fredoka', sans-serif", position: "relative", overflow: "hidden",
      animation: "crossfadeIn 0.5s ease-out",
    }}>
      <PatternOverlay theme={theme} />
      {theme === "princess" && <><Starfield count={35} taskIndex={taskIndex} /><CastleFrame taskIndex={taskIndex} /></>}
      {theme === "mermaid"  && <><BubbleField count={15} taskIndex={taskIndex} /><UnderwaterFrame taskIndex={taskIndex} /></>}
      {theme === "kpop"     && <><NeonField count={40} taskIndex={taskIndex} /><KpopFrame taskIndex={taskIndex} /></>}
      <Vignette intensity={0.3 + (taskIndex / TASKS.length) * 0.15} theme={theme} />
      <AmbientParticles theme={theme} />
      <div className="safe-top" style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

// ==================== FULL-SCREEN BACKDROP (splash, sticker, dream, etc) ====================
function FullScreenBackdrop({ theme, children, showFrame = false, taskIndex = 0 }) {
  const bgGradients = {
    princess: "radial-gradient(ellipse at 50% 30%, #3d2660 0%, #1a0a2e 60%, #0d0521 100%)",
    mermaid:  "radial-gradient(ellipse at 50% 30%, #0d2847 0%, #0a1628 60%, #050d1a 100%)",
    kpop:     "radial-gradient(ellipse at 50% 30%, #3a1265 0%, #1a0533 60%, #0a0220 100%)",
  };
  return (
    <div style={{
      height: "100%", minHeight: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: bgGradients[theme] || bgGradients.princess,
      fontFamily: "'Fredoka', sans-serif", position: "relative", overflow: "hidden",
      animation: "fadeIn 0.6s ease",
    }}>
      <PatternOverlay theme={theme} />
      {theme === "princess" && <Starfield count={25} taskIndex={taskIndex} />}
      {theme === "mermaid"  && <BubbleField count={10} taskIndex={taskIndex} />}
      {theme === "kpop"     && <NeonField count={30} taskIndex={taskIndex} />}
      {showFrame && theme === "princess" && <CastleFrame taskIndex={0} />}
      {showFrame && theme === "mermaid"  && <UnderwaterFrame taskIndex={0} />}
      {showFrame && theme === "kpop"     && <KpopFrame taskIndex={0} />}
      <Vignette intensity={0.35} theme={theme} />
      <AmbientParticles theme={theme} />
      <div className="safe-top" style={{ position: "relative", zIndex: 5, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
    </div>
  );
}

// ==================== ENLARGED STICKER VIEW ====================
// Presents a single sticker as large as possible inside a cute "frame" so Harper
// can inspect its detail. Used when a sticker on the Trophy Shelf is tapped.
function StickerDetail({ sticker, theme, onBack }) {
  const t = THEMES[theme];
  const sup = isSuperSticker(sticker);
  const frameColor = sup ? t.accent : t.primary;
  const frameDark = sup ? t.accentDark : t.secondary;
  const corners = [
    { top: -16, left: -16 }, { top: -16, right: -16 },
    { bottom: -16, left: -16 }, { bottom: -16, right: -16 },
  ];
  return (
    <FullScreenBackdrop theme={theme} showFrame={true}>
      <div style={{ padding: "40px 24px", width: "100%", maxWidth: 440, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {sup && (
          <div style={{ fontSize: 30, fontWeight: 700, color: t.accent, fontFamily: "'Fredoka', sans-serif", marginBottom: 18, textShadow: `0 0 24px ${t.primary}`, animation: "fadeInUp 0.4s ease" }}>
            ⭐ Super Sticker ⭐
          </div>
        )}
        {/* Cute presentation square */}
        <div style={{
          position: "relative",
          width: "min(80vw, 340px)", aspectRatio: "1 / 1",
          borderRadius: 40,
          background: `linear-gradient(160deg, ${frameColor}33 0%, ${frameColor}12 100%)`,
          border: `6px solid ${frameColor}`,
          boxShadow: `0 0 44px ${frameColor}66, inset 0 -6px 0 ${frameDark}, inset 0 3px 0 ${t.specularHighlight}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "countPop 0.5s ease-out",
        }}>
          {/* Inner display mat */}
          <div style={{
            width: "82%", aspectRatio: "1 / 1", borderRadius: 30,
            background: `radial-gradient(circle at 50% 38%, ${t.softBg}f2 0%, ${frameColor}26 100%)`,
            border: `3px solid ${frameColor}aa`,
            boxShadow: `inset 0 2px 14px ${frameDark}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isImageSticker(sticker)
              ? <img src={sticker} alt="sticker" style={{ width: "80%", height: "80%", objectFit: "contain", display: "block", filter: `drop-shadow(0 4px 10px ${frameDark}66)` }} />
              : <span style={{ fontSize: "clamp(90px, 32vw, 160px)", lineHeight: 1 }}>{sticker}</span>
            }
          </div>
          {/* Corner sparkles */}
          {corners.map((pos, i) => (
            <span key={i} style={{
              position: "absolute", ...pos, fontSize: 30,
              filter: `drop-shadow(0 0 6px ${frameColor})`,
              animation: `twinkle ${2 + (i % 2) * 0.6}s ease-in-out ${i * 0.3}s infinite`,
            }}>{sup ? "⭐" : "✨"}</span>
          ))}
        </div>
        <div style={{ marginTop: 44, width: "100%", maxWidth: 280 }}>
          <LudoButton theme={theme} size="medium" onClick={onBack}>← Back to Shelf</LudoButton>
        </div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== TROPHY SHELF ====================
function TrophyShelf({ stickers, onClose, theme }) {
  const t = THEMES[theme];
  const count = stickers.length;
  const [selected, setSelected] = useState(null);

  // Split into tiers while preserving earned order within each tier.
  const superStickers = [];
  const regularStickers = [];
  stickers.forEach((s, i) => {
    (isSuperSticker(s) ? superStickers : regularStickers).push({ s, i });
  });

  if (selected !== null) {
    return <StickerDetail sticker={selected} theme={theme} onBack={() => setSelected(null)} />;
  }

  // Renders one tappable sticker. `big` is used for the super-sticker tier.
  const stickerButton = ({ s, i }, big) => {
    const sup = isSuperSticker(s);
    const imgSize = big ? 78 : 52;
    return (
      <button
        key={i}
        onClick={() => setSelected(s)}
        aria-label="View sticker"
        style={{
          textAlign: "center", padding: big ? 10 : 8, borderRadius: 18,
          background: sup ? `${t.accent}22` : `${t.primary}10`,
          border: sup ? `2px solid ${t.accent}88` : `2px solid ${t.primary}22`,
          boxShadow: sup ? `0 0 12px ${t.accent}44` : "none",
          animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", touchAction: "manipulation",
          transition: "transform 0.12s ease",
        }}
      >
        {isImageSticker(s)
          ? <img src={s} alt="sticker" style={{ width: imgSize, height: imgSize, objectFit: "contain", display: "block" }} />
          : <span style={{ fontSize: big ? 60 : 40 }}>{s}</span>
        }
      </button>
    );
  };

  const tierLabelStyle = { fontSize: 22, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", marginBottom: 10, textAlign: "left" };

  return (
    <FullScreenBackdrop theme={theme} showFrame={true}>
      <div style={{
        padding: "40px 20px", width: "100%", maxWidth: 440, textAlign: "center",
        ...(theme === "kpop" && {
          background: "rgba(7, 2, 26, 0.72)",
          borderRadius: 28,
          border: "2px solid rgba(157, 78, 221, 0.28)",
          margin: "0 12px",
        }),
      }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: t.textPrimary, fontFamily: "'Fredoka', sans-serif", marginBottom: 8 }}>🏆 Trophy Shelf</div>
        <div style={{ fontSize: 26, color: t.textSecondary, fontFamily: "'Fredoka', sans-serif", marginBottom: 24 }}>{count} bedtime{count !== 1 ? "s" : ""} completed!</div>
        {count === 0 ? (
          <div style={{ fontSize: 26, color: t.textMuted, marginTop: 40 }}>No stickers yet! Complete your bedtime routine to earn one. ✨</div>
        ) : (
          <div style={{ maxHeight: "calc(58dvh - 40px)", overflowY: "auto", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Super sticker tier — top of the shelf, larger, in its own area */}
            {superStickers.length > 0 && (
              <div>
                <div style={{ ...tierLabelStyle, color: t.accent, textShadow: `0 0 12px ${t.accent}55` }}>⭐ Super Stickers</div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 12,
                  width: "100%", padding: 16,
                  background: `${t.accent}14`, borderRadius: 28, border: `3px solid ${t.accent}55`,
                  boxShadow: `0 0 18px ${t.accent}22, inset 0 1px 0 ${t.accent}22`,
                }}>
                  {superStickers.map((item) => stickerButton(item, true))}
                </div>
              </div>
            )}
            {/* Regular sticker tier — below the super stickers */}
            {regularStickers.length > 0 && (
              <div>
                {superStickers.length > 0 && (
                  <div style={{ ...tierLabelStyle, color: t.textSecondary }}>✨ My Stickers</div>
                )}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 12,
                  width: "100%", padding: 20,
                  background: theme === "kpop" ? `${t.primary}30` : `${t.primary}12`,
                  borderRadius: 28,
                  border: `3px solid ${theme === "kpop" ? t.primary + "66" : t.primary + "33"}`,
                }}>
                  {regularStickers.map((item) => stickerButton(item, false))}
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 32 }}><LudoButton theme={theme} size="medium" onClick={onClose}>← Back</LudoButton></div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== STICKER PICK ====================
function StickerPick({ theme, onPick, stickers = [], onOpenShelf }) {
  const t = THEMES[theme];
  const [pressedIdx, setPressedIdx] = useState(null);
  const [options] = useState(() => {
    const pool = STICKER_IMAGES[theme] || STICKER_IMAGES.princess;
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  return (
    <FullScreenBackdrop theme={theme} showFrame={true} taskIndex={TASKS.length}>
      <CelebrationParticles theme={theme} active={true} />
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ marginBottom: 16, animation: "floatGentle 2.5s ease-in-out infinite" }}><GuideCharacter theme={theme} size={120} /></div>
        <div style={{ fontSize: 32, fontWeight: 700, color: t.textPrimary, fontFamily: "'Fredoka', sans-serif", marginBottom: 8, animation: "fadeInUp 0.5s ease" }}>You did it! 🎉</div>
        <div style={{ fontSize: 26, color: t.textSecondary, fontFamily: "'Fredoka', sans-serif", marginBottom: 40, animation: "fadeInUp 0.5s ease 0.2s both" }}>Pick a sticker for your shelf!</div>
        <div style={{
          display: "flex", gap: 20, justifyContent: "center", animation: "fadeInUp 0.5s ease 0.4s both",
          ...(theme === "kpop" && {
            background: "rgba(7, 2, 26, 0.78)",
            borderRadius: 28,
            padding: 16,
            border: "2px solid rgba(157, 78, 221, 0.4)",
          }),
        }}>
          {options.map((sticker, i) => (
            <button
              key={i}
              onClick={() => onPick(sticker)}
              onPointerDown={() => setPressedIdx(i)}
              onPointerUp={() => setPressedIdx(null)}
              onPointerLeave={() => setPressedIdx(null)}
              onPointerCancel={() => setPressedIdx(null)}
              style={{
                padding: 16, borderRadius: 28,
                border: `4px solid ${theme === "kpop" ? t.primary + "aa" : t.primary + "66"}`,
                background: theme === "kpop" ? `${t.primary}44` : `${t.primary}18`,
                cursor: "pointer", transition: "transform 0.12s ease, box-shadow 0.12s ease",
                boxShadow: pressedIdx === i ? `inset 0 2px 0 ${t.secondary}` : t.insetShadow,
                transform: pressedIdx === i ? "scale(0.93) translateY(2px)" : "scale(1)",
                animation: `fadeInUp 0.4s ease ${0.5 + i * 0.15}s both`,
                touchAction: "manipulation",
              }}
            >
              <img src={sticker} alt="sticker" style={{ width: 80, height: 80, objectFit: "contain", display: "block" }} />
            </button>
          ))}
        </div>
        {!FAMILY_MODE && onOpenShelf && (
          <div style={{ marginTop: 32, animation: "fadeInUp 0.4s ease 0.9s both" }}>
            <LudoButton theme={theme} size="small" onClick={onOpenShelf} style={{ animation: "none", background: "linear-gradient(180deg, #9B7ED8 0%, #7B5EB0 100%)", border: "4px solid #6B4E9E", boxShadow: "inset 0 -4px 0 #5A3D8A" }}>
              🏆 My Shelf ({stickers.length})
            </LudoButton>
          </div>
        )}
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== SUPER STICKER PICK ====================
function SuperStickerPick({ theme, onPick }) {
  const t = THEMES[theme];
  const [pressedIdx, setPressedIdx] = useState(null);
  const [options] = useState(() => {
    const pool = SUPER_STICKER_IMAGES[theme] || SUPER_STICKER_IMAGES.princess;
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  return (
    <FullScreenBackdrop theme={theme} showFrame={true} taskIndex={TASKS.length}>
      <CelebrationParticles theme={theme} active={true} />
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ marginBottom: 16 }}><GuideCharacter theme={theme} size={120} variant="victory" /></div>
        <div style={{ fontSize: 36, fontWeight: 700, color: t.accent, fontFamily: "'Fredoka', sans-serif", marginBottom: 8, animation: "fadeInUp 0.5s ease", textShadow: `0 0 24px ${t.primary}` }}>
          3 of a kind! ⭐
        </div>
        <div style={{ fontSize: 26, color: t.textSecondary, fontFamily: "'Fredoka', sans-serif", marginBottom: 40, animation: "fadeInUp 0.5s ease 0.15s both" }}>
          Pick a SUPER sticker!
        </div>
        <div style={{
          display: "flex", flexDirection: "column", gap: 16, alignItems: "center",
          animation: "fadeInUp 0.5s ease 0.35s both",
          ...(theme === "kpop" && {
            background: "rgba(7, 2, 26, 0.78)",
            borderRadius: 28,
            padding: 16,
            border: "2px solid rgba(157, 78, 221, 0.4)",
          }),
        }}>
          {/* Top row: first 2 stickers */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            {options.slice(0, 2).map((sticker, i) => (
              <button
                key={i}
                onClick={() => onPick(sticker)}
                onPointerDown={() => setPressedIdx(i)}
                onPointerUp={() => setPressedIdx(null)}
                onPointerLeave={() => setPressedIdx(null)}
                onPointerCancel={() => setPressedIdx(null)}
                style={{
                  padding: 16, borderRadius: 28,
                  border: `4px solid ${theme === "kpop" ? t.accent + "cc" : t.accent + "88"}`,
                  background: theme === "kpop" ? `${t.accent}30` : `${t.accent}18`,
                  cursor: "pointer", transition: "transform 0.12s ease, box-shadow 0.12s ease",
                  boxShadow: pressedIdx === i ? `inset 0 2px 0 ${t.accentDark}` : `inset 0 -4px 0 ${t.accentDark}`,
                  transform: pressedIdx === i ? "scale(0.93) translateY(2px)" : "scale(1)",
                  animation: `fadeInUp 0.4s ease ${0.4 + i * 0.15}s both`,
                  touchAction: "manipulation",
                }}
              >
                <img src={sticker} alt="super sticker" style={{ width: 96, height: 96, objectFit: "contain", display: "block" }} />
              </button>
            ))}
          </div>
          {/* Bottom row: third sticker centered */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {options.slice(2).map((sticker, i) => (
              <button
                key={i + 2}
                onClick={() => onPick(sticker)}
                onPointerDown={() => setPressedIdx(i + 2)}
                onPointerUp={() => setPressedIdx(null)}
                onPointerLeave={() => setPressedIdx(null)}
                onPointerCancel={() => setPressedIdx(null)}
                style={{
                  padding: 16, borderRadius: 28,
                  border: `4px solid ${theme === "kpop" ? t.accent + "cc" : t.accent + "88"}`,
                  background: theme === "kpop" ? `${t.accent}30` : `${t.accent}18`,
                  cursor: "pointer", transition: "transform 0.12s ease, box-shadow 0.12s ease",
                  boxShadow: pressedIdx === i + 2 ? `inset 0 2px 0 ${t.accentDark}` : `inset 0 -4px 0 ${t.accentDark}`,
                  transform: pressedIdx === i + 2 ? "scale(0.93) translateY(2px)" : "scale(1)",
                  animation: `fadeInUp 0.4s ease ${0.7}s both`,
                  touchAction: "manipulation",
                }}
              >
                <img src={sticker} alt="super sticker" style={{ width: 96, height: 96, objectFit: "contain", display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== COUNTDOWN ====================
function Countdown({ theme, onDone }) {
  const [count, setCount] = useState(5);
  const t = THEMES[theme];
  useEffect(() => {
    if (count > 0) { const timer = setTimeout(() => setCount(c => c - 1), 1000); return () => clearTimeout(timer); }
    else onDone();
  }, [count]);
  return (
    <FullScreenBackdrop theme={theme} taskIndex={TASKS.length}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 20 }}><GuideCharacter theme={theme} size={120} variant="sleep" /></div>
        <div style={{ fontSize: 28, fontFamily: "'Fredoka', sans-serif", color: t.textSecondary, marginBottom: 24, animation: "softPulse 1.2s ease-in-out infinite" }}>Sleepy time in...</div>
        {count > 0 && (
          <div key={count} style={{ fontSize: 130, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: t.accent, textShadow: `0 0 40px ${t.primary}, 0 0 80px ${t.primary}66`, animation: "countPop 1s ease-out" }}>{count}</div>
        )}
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== DREAM SCREEN ====================
function DreamScreen({ theme, onBack }) {
  const t = THEMES[theme];
  const [textVisible, setTextVisible] = useState(true);
  const sets = {
    princess: ["⭐", "✨", "🌟", "💫", "🌙"],
    mermaid:  ["🫧", "💙", "🌊", "✨", "🌙"],
    kpop:     ["💜", "✨", "🎵", "🌟", "🌙"],
  };
  const emojis = sets[theme] || sets.princess;
  const floaters = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 12,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 3,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    })), []);

  useEffect(() => {
    if (theme !== "kpop") return;
    const timer = setTimeout(() => setTextVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <FullScreenBackdrop theme={theme} showFrame={true} taskIndex={TASKS.length}>
      {/* Discreet parent control: return to the main menu once Harper is asleep */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back to main menu"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0px) + 8px)",
            left: 12,
            minWidth: 44, height: 44, borderRadius: 14,
            padding: "0 14px",
            background: `${t.primary}1f`,
            border: `1.5px solid ${t.primary}3a`,
            color: t.textSecondary,
            fontSize: 20, fontWeight: 600, fontFamily: "'Fredoka', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", touchAction: "manipulation", zIndex: 50,
            opacity: 0.5,
          }}
        >← Menu</button>
      )}
      {floaters.map(f => (
        <div key={f.id} style={{ position: "absolute", left: `${f.left}%`, bottom: "-10%", fontSize: f.size, zIndex: 3, animation: `floatUp ${f.duration}s ease-out ${f.delay}s infinite`, opacity: 0 }}>
          {f.emoji}
        </div>
      ))}
      <div style={{
        textAlign: "center", padding: "0 24px",
        opacity: textVisible ? 1 : 0,
        transition: "opacity 1.5s ease",
        pointerEvents: textVisible ? "auto" : "none",
      }}>
        <div style={{ marginBottom: 20 }}><GuideCharacter theme={theme} size={144} variant="sleep" /></div>
        <div style={{
          ...(theme === "kpop" && {
            background: "rgba(7, 2, 26, 0.82)",
            borderRadius: 24,
            border: "3px solid rgba(157, 78, 221, 0.5)",
            padding: "20px 24px",
          }),
        }}>
          <div style={{ fontSize: 34, fontFamily: "'Fredoka', sans-serif", color: t.accent, textShadow: `0 0 30px ${t.primary}66`, animation: "fadeInUp 1s ease-out", lineHeight: 1.3 }}>{t.dreamMsg}</div>
          <div style={{ fontSize: 26, fontFamily: "'Fredoka', sans-serif", color: t.textMuted, marginTop: 16, animation: "fadeInUp 1s ease-out 0.3s both" }}>🌙</div>
        </div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== BIRTHDAY FEATURE ====================
const BIRTHDAY_CODE = "4359";
const BIRTHDAY_CHARS = ["princess", "mermaid", "kpop"];
const TAPS_TO_GIFT = 5;
const BACK_TAPS_TO_EXIT = 5;
const BUBBLE_RADIUS = 70;

// PIN Pad — 4-digit parent code gate
function PinPad({ onSuccess, onCancel }) {
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);

  const handleDigit = (d) => {
    if (shake || digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      if (next.join("") === BIRTHDAY_CODE) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setDigits([]); }, 700);
      }
    }
  };

  const handleDelete = () => { if (!shake) setDigits(prev => prev.slice(0, -1)); };

  const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(5,0,20,0.97)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Fredoka', sans-serif",
      animation: "fadeIn 0.25s ease",
    }}>
      <div style={{ fontSize: 28, color: "rgba(240,194,57,0.9)", marginBottom: 24, letterSpacing: 1 }}>🔒 Enter Code</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 36, animation: shake ? "shake 0.6s ease" : "none" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: "50%",
            background: i < digits.length ? (shake ? "#FF4444" : "#F0C239") : "rgba(255,255,255,0.18)",
            boxShadow: i < digits.length && !shake ? "0 0 12px #F0C23988" : "none",
            transition: "background 0.15s ease",
          }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, width: 248 }}>
        {KEYS.map((d, i) => {
          const isEmpty = d === null;
          const isDel = d === "del";
          return (
            <button key={i}
              onClick={() => isEmpty ? null : isDel ? handleDelete() : handleDigit(String(d))}
              style={{
                height: 68, borderRadius: 18,
                background: isEmpty ? "transparent" : isDel ? "rgba(255,80,80,0.18)" : "rgba(255,255,255,0.1)",
                border: isEmpty ? "none" : `2px solid ${isDel ? "rgba(255,80,80,0.35)" : "rgba(255,255,255,0.18)"}`,
                color: "#FFFDF5", fontSize: isDel ? 24 : 30, fontWeight: 700,
                cursor: isEmpty ? "default" : "pointer",
                fontFamily: "'Fredoka', sans-serif", touchAction: "manipulation",
                pointerEvents: isEmpty ? "none" : "auto",
              }}
            >{isDel ? "⌫" : d === null ? "" : d}</button>
          );
        })}
      </div>
      <button onClick={onCancel} style={{
        marginTop: 28, background: "none", border: "none",
        color: "rgba(255,255,255,0.35)", fontSize: 22,
        cursor: "pointer", fontFamily: "'Fredoka', sans-serif", touchAction: "manipulation",
      }}>Cancel</button>
    </div>
  );
}

// Rainbow confetti using all three theme emoji sets
function BirthdayParticles() {
  const emojis = ["✨", "🎉", "🎊", "💖", "💎", "💜", "⭐", "🌟", "🎈", "🎁", "👑", "🐚", "🎤", "⚡", "🎵"];
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      size: Math.random() * 14 + 10,
      delay: Math.random() * 8, duration: Math.random() * 8 + 6,
      emoji: emojis[i % emojis.length],
    })), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, bottom: "-5%", fontSize: p.size,
          animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`, opacity: 0,
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

// Grid sticker picker: shows full pool, tap to preview enlarged, Back or Pick! to decide
function BirthdayStickerPicker({ char, pool, neededCount, title, onDone }) {
  const t = THEMES[char];
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [previewIdx, setPreviewIdx] = useState(null);
  const remaining = neededCount - selectedIndices.length;
  const isSuper = pool.length <= 5;
  const cols = isSuper ? 2 : 4;

  const handleTap = (i) => {
    if (selectedIndices.includes(i)) return;
    setPreviewIdx(i);
  };

  const handlePick = () => {
    const next = [...selectedIndices, previewIdx];
    setSelectedIndices(next);
    setPreviewIdx(null);
    if (next.length >= neededCount) onDone(next.map(i => pool[i]));
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: `radial-gradient(ellipse at 50% 25%, ${t.bg1} 0%, ${t.bg2} 60%, ${t.bg3} 100%)`,
      display: "flex", flexDirection: "column",
      fontFamily: "'Fredoka', sans-serif", animation: "fadeIn 0.3s ease",
    }}>
      {/* Full-screen sticker preview overlay */}
      {previewIdx !== null && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          background: `radial-gradient(ellipse at 50% 45%, ${t.bg1} 0%, ${t.bg2} 100%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.18s ease",
          padding: "0 32px",
        }}>
          <div style={{ animation: "giftPop 0.35s ease" }}>
            <img src={pool[previewIdx]} alt="sticker preview" style={{
              width: "clamp(200px, 55vw, 260px)", height: "clamp(200px, 55vw, 260px)",
              objectFit: "contain",
              filter: `drop-shadow(0 0 32px ${t.primary}99)`,
              display: "block",
            }} />
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 36, width: "100%", maxWidth: 340 }}>
            <LudoButton theme={char} size="medium" onClick={() => setPreviewIdx(null)} style={{
              flex: 1, background: `${t.primary}28`, border: `3px solid ${t.primary}55`, boxShadow: "none",
            }}>← Back</LudoButton>
            <LudoButton theme={char} size="medium" onClick={handlePick} style={{ flex: 1 }}>Pick! ✨</LudoButton>
          </div>
        </div>
      )}

      {/* Grid view */}
      <div className="safe-top" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: t.accent, textShadow: `0 0 18px ${t.primary}` }}>{title}</div>
          <div style={{ fontSize: 22, color: t.textSecondary, marginTop: 2 }}>
            {remaining > 0 ? `Pick ${remaining} more!` : "✨ All picked!"}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "0 14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
            {pool.map((sticker, i) => {
              const isPicked = selectedIndices.includes(i);
              return (
                <div key={i} onClick={() => !isPicked && handleTap(i)} style={{
                  borderRadius: isSuper ? 24 : 16,
                  padding: isSuper ? 14 : 8,
                  background: isPicked ? `${t.primary}12` : `${t.primary}22`,
                  border: `2.5px solid ${isPicked ? t.accent + "55" : t.primary + "55"}`,
                  boxShadow: isPicked ? "none" : `0 0 10px ${t.primary}28`,
                  opacity: isPicked ? 0.38 : 1,
                  cursor: isPicked ? "default" : "pointer",
                  touchAction: "manipulation",
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "opacity 0.2s ease",
                  animation: `gemPop 0.3s ease ${i * 0.04}s both`,
                }}>
                  <img src={sticker} alt="sticker" style={{
                    width: "100%", aspectRatio: "1", objectFit: "contain", display: "block",
                  }} />
                  {isPicked && (
                    <div style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isSuper ? 36 : 28, color: t.accent,
                    }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="safe-bottom" />
      </div>
    </div>
  );
}

// Orchestrates regular-sticker pick (10 of 20) then super-sticker pick (2 of 5)
function BirthdayStickerReveal({ char, onCollect }) {
  const [phase, setPhase] = useState("pick-regular");
  const [pickedRegular, setPickedRegular] = useState([]);
  return (
    <>
      {phase === "pick-regular" && (
        <BirthdayStickerPicker
          char={char}
          pool={STICKER_IMAGES[char] || []}
          neededCount={5}
          title="🎁 Birthday Pack!"
          onDone={(stickers) => { setPickedRegular(stickers); setPhase("pick-super"); }}
        />
      )}
      {phase === "pick-super" && (
        <BirthdayStickerPicker
          char={char}
          pool={SUPER_STICKER_IMAGES[char] || []}
          neededCount={1}
          title="⭐ Super Stickers!"
          onDone={(stickers) => onCollect([...pickedRegular, ...stickers])}
        />
      )}
    </>
  );
}

// Main birthday experience — characters bounce around screen, tap to fill, gift on completion
function BirthdaySurpriseScreen({ onClose, onCollectStickers, shelfCount, onOpenShelf }) {
  const [tapCounts, setTapCounts] = useState({ princess: 0, mermaid: 0, kpop: 0 });
  const [charPhase, setCharPhase] = useState({ princess: "active", mermaid: "active", kpop: "active" });
  const [tick, setTick] = useState(0);
  const [revealData, setRevealData] = useState(null);
  const [backTaps, setBackTaps] = useState(0);
  const backResetRef = useRef(null);

  const containerRef = useRef(null);
  const posRef = useRef(null);
  const charPhaseRef = useRef(charPhase);
  const [positions, setPositions] = useState({
    princess: { x: 90,  y: 110 },
    mermaid:  { x: 240, y: 150 },
    kpop:     { x: 170, y: 290 },
  });

  useEffect(() => { charPhaseRef.current = charPhase; }, [charPhase]);

  // Set initial spread positions after container renders
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const W = el.offsetWidth  || 360;
    const H = el.offsetHeight || 420;
    const R = BUBBLE_RADIUS;
    posRef.current = {
      princess: { x: R + 15,     y: R + 20,     vx:  1.8, vy:  1.3 },
      mermaid:  { x: W - R - 15, y: R + 50,     vx: -1.6, vy:  1.7 },
      kpop:     { x: W / 2,      y: H - R - 20, vx:  1.3, vy: -1.9 },
    };
    setPositions({
      princess: { x: posRef.current.princess.x, y: posRef.current.princess.y },
      mermaid:  { x: posRef.current.mermaid.x,  y: posRef.current.mermaid.y  },
      kpop:     { x: posRef.current.kpop.x,     y: posRef.current.kpop.y     },
    });
  }, []);

  // Physics loop — bounces active characters off container walls
  useEffect(() => {
    const interval = setInterval(() => {
      const el = containerRef.current;
      if (!el || !posRef.current) return;
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const R = BUBBLE_RADIUS;
      const next = {};
      BIRTHDAY_CHARS.forEach(char => {
        const phase = charPhaseRef.current[char];
        if (phase !== "active") {
          next[char] = { x: posRef.current[char].x, y: posRef.current[char].y };
          return;
        }
        let { x, y, vx, vy } = posRef.current[char];
        x += vx; y += vy;
        if (x - R < 0)  { x = R;     vx =  Math.abs(vx); }
        if (x + R > W)  { x = W - R; vx = -Math.abs(vx); }
        if (y - R < 0)  { y = R;     vy =  Math.abs(vy); }
        if (y + R > H)  { y = H - R; vy = -Math.abs(vy); }
        posRef.current[char] = { x, y, vx, vy };
        next[char] = { x, y };
      });
      setPositions(next);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  // Pose cycling for active characters
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => clearTimeout(backResetRef.current), []);

  const getPose = (char) => {
    if (charPhase[char] === "sleeping") return "sleep";
    if (charPhase[char] === "gifted")   return "normal";
    return tick % 2 === 0 ? "normal" : "victory";
  };

  const allSleeping = BIRTHDAY_CHARS.every(c => charPhase[c] === "sleeping");

  const handleCharTap = (char) => {
    const phase = charPhase[char];
    if (phase === "sleeping") return;
    if (phase === "gifted") { setRevealData({ char }); return; }
    const next = tapCounts[char] + 1;
    if (next >= TAPS_TO_GIFT) {
      setTapCounts(prev => ({ ...prev, [char]: TAPS_TO_GIFT }));
      setCharPhase(prev => ({ ...prev, [char]: "gifted" }));
    } else {
      setTapCounts(prev => ({ ...prev, [char]: next }));
    }
  };

  const handleCollect = (char, stickers) => {
    onCollectStickers(stickers);
    setRevealData(null);
    setCharPhase(prev => ({ ...prev, [char]: "sleeping" }));
  };

  const handleBackTap = () => {
    const next = backTaps + 1;
    clearTimeout(backResetRef.current);
    if (next >= BACK_TAPS_TO_EXIT) { setBackTaps(0); onClose(); }
    else {
      setBackTaps(next);
      backResetRef.current = setTimeout(() => setBackTaps(0), 3000);
    }
  };

  return (
    <>
      {revealData && (
        <BirthdayStickerReveal
          char={revealData.char}
          onCollect={(stickers) => handleCollect(revealData.char, stickers)}
        />
      )}
      <div style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "radial-gradient(ellipse at 30% 20%, #3d2660 0%, transparent 55%), radial-gradient(ellipse at 72% 25%, #0d2847 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #1f0a3a 0%, transparent 55%), #070214",
        display: "flex", flexDirection: "column",
        fontFamily: "'Fredoka', sans-serif", overflow: "hidden",
        animation: "fadeIn 0.4s ease",
      }}>
        <BirthdayParticles />
        <div className="safe-top" style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
            <div style={{ position: "relative" }}>
              <button onClick={handleBackTap} style={{
                width: 48, height: 48, borderRadius: 16,
                background: `rgba(240,194,57,${0.08 + backTaps * 0.1})`,
                border: `2px solid rgba(240,194,57,${0.15 + backTaps * 0.12})`,
                color: "#F0C239", fontSize: 22, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                touchAction: "manipulation", transition: "all 0.15s ease",
              }}>←</button>
              {backTaps > 0 && (
                <div style={{ position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
                  {Array.from({ length: BACK_TAPS_TO_EXIT - 1 }, (_, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: i < backTaps ? "#F0C239" : "rgba(255,255,255,0.2)",
                    }} />
                  ))}
                </div>
              )}
            </div>
            <button onClick={onOpenShelf} style={{
              padding: "8px 14px", borderRadius: 16,
              background: "rgba(155,126,216,0.25)", border: "2px solid rgba(155,126,216,0.45)",
              color: "#FFFDF5", fontSize: 20, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Fredoka', sans-serif", touchAction: "manipulation",
            }}>🏆 {shelfCount}</button>
          </div>

          {/* Large rainbow title with dark outline */}
          <div style={{
            fontSize: "clamp(38px, 7.5dvh, 58px)", fontWeight: 700,
            background: "linear-gradient(90deg, #E84B8A, #F0C239, #1AACA8, #9D4EDD, #E84B8A)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", backgroundSize: "200% auto",
            animation: "shimmer 3s linear infinite",
            textShadow: "-3px -3px 0 #160038, -3px 0 0 #160038, -3px 3px 0 #160038, 0 -3px 0 #160038, 0 3px 0 #160038, 3px -3px 0 #160038, 3px 0 0 #160038, 3px 3px 0 #160038, -2px -2px 0 #160038, 2px -2px 0 #160038, -2px 2px 0 #160038, 2px 2px 0 #160038",
            textAlign: "center", padding: "2px 8px 4px", lineHeight: 1.1,
          }}>🎂 Happy Birthday Harper! 🎂</div>

          {/* Bouncing characters zone */}
          <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
            {BIRTHDAY_CHARS.map(char => {
              const phase = charPhase[char];
              const pose  = getPose(char);
              const t     = THEMES[char];
              const pos   = positions[char];
              const imgSrc = pose === "sleep" ? t.guideSleep : pose === "victory" ? t.guideVictory : t.guide;
              const taps  = tapCounts[char];

              return (
                <div key={char} onClick={() => handleCharTap(char)} style={{
                  position: "absolute",
                  left: pos.x - BUBBLE_RADIUS,
                  top:  pos.y - BUBBLE_RADIUS,
                  width:  BUBBLE_RADIUS * 2,
                  height: BUBBLE_RADIUS * 2,
                  borderRadius: "50%",
                  background: phase === "gifted"
                    ? `radial-gradient(circle, ${t.primary}55 0%, ${t.primary}22 100%)`
                    : `radial-gradient(circle, ${t.primary}38 0%, ${t.primary}14 100%)`,
                  border: `3px solid ${t.primary}${phase === "gifted" ? "aa" : "77"}`,
                  boxShadow: `0 0 ${phase === "gifted" ? 30 : 18}px ${t.primary}${phase === "gifted" ? "66" : "44"}`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                  cursor: phase !== "sleeping" ? "pointer" : "default",
                  touchAction: "manipulation", userSelect: "none",
                  animation: phase === "gifted" ? "pulse 1.5s ease-in-out infinite" : undefined,
                }}>
                  {phase === "gifted" ? (
                    <div style={{
                      fontSize: 54, lineHeight: 1,
                      animation: "giftBounce 1s ease-in-out infinite",
                      filter: `drop-shadow(0 0 12px ${t.primary}bb)`,
                    }}>🎁</div>
                  ) : (
                    <img src={imgSrc} alt={char} style={{
                      height: BUBBLE_RADIUS * 1.8, width: "auto", objectFit: "contain",
                      transition: "opacity 0.4s ease", flexShrink: 0,
                    }} />
                  )}
                  {phase === "active" && taps > 0 && (
                    <div style={{ position: "absolute", bottom: 7, display: "flex", gap: 3 }}>
                      {Array.from({ length: TAPS_TO_GIFT }, (_, i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: i < taps ? t.accent : "rgba(255,255,255,0.25)",
                          boxShadow: i < taps ? `0 0 5px ${t.accent}` : "none",
                          transition: "all 0.2s ease",
                        }} />
                      ))}
                    </div>
                  )}
                  {phase === "gifted" && (
                    <div style={{ position: "absolute", bottom: 5, fontSize: 13, color: t.accent, fontWeight: 600, fontFamily: "'Fredoka', sans-serif" }}>Tap! ✨</div>
                  )}
                  {phase === "sleeping" && (
                    <div style={{ position: "absolute", top: 6, right: 8, fontSize: 16 }}>💤</div>
                  )}
                </div>
              );
            })}
          </div>

          {allSleeping && (
            <div style={{ textAlign: "center", padding: "10px 24px", animation: "fadeInUp 0.5s ease" }}>
              <div style={{ fontSize: 20, color: "rgba(240,194,57,0.8)" }}>🌙 Tap ← five times to return</div>
            </div>
          )}
          <div className="safe-bottom" />
        </div>
      </div>
    </>
  );
}

// ==================== SPLASH SCREEN ====================
function SplashScreen({ theme, setTheme, onStart, stickers, onOpenShelf, onReset, hasSavedProgress, familyMode, demoMode, onEnterDemo, onExitDemo, onBirthdayPress, birthdayPinOpen, onBirthdayPinSuccess, onBirthdayPinCancel }) {
  const t = THEMES[theme];
  const [showResume, setShowResume] = useState(hasSavedProgress);
  return (
    <>
      {birthdayPinOpen && <PinPad onSuccess={onBirthdayPinSuccess} onCancel={onBirthdayPinCancel} />}
      <FullScreenBackdrop theme={theme} showFrame={true}>
        {!familyMode && (
          <button
            onClick={onBirthdayPress}
            aria-label="Birthday surprise"
            style={{
              position: "fixed",
              top: "calc(env(safe-area-inset-top, 0px) + 8px)",
              left: 12,
              width: 44, height: 44, borderRadius: 14,
              background: "rgba(240,194,57,0.1)",
              border: "1.5px solid rgba(240,194,57,0.22)",
              fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", touchAction: "manipulation", zIndex: 50,
              opacity: 0.55,
            }}
          >🎂</button>
        )}
        <div style={{ padding: "clamp(12px, 3dvh, 40px) 24px", textAlign: "center", width: "100%", maxWidth: 400 }}>
        <div style={{ marginBottom: "clamp(12px, 2.5dvh, 32px)", animation: "floatGentle 3s ease-in-out infinite" }}><GuideCharacter theme={theme} size={144} splashMode={true} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(6px, 1dvh, 12px)", marginBottom: "clamp(12px, 2.5dvh, 32px)", justifyItems: "stretch" }}>
          {[
            { key: "princess", label: "👸 Princess" },
            { key: "mermaid",  label: "🧜‍♀️ Mermaid" },
            { key: "kpop",     label: "🎤 Demon Hunter", full: true },
          ].map(({ key: th, label, full }) => {
            const active = theme === th;
            const tc = THEMES[th];
            return (
              <button key={th} onClick={() => setTheme(th)} style={{
                gridColumn: full ? "1 / -1" : "auto",
                padding: "clamp(8px, 1.5dvh, 14px) clamp(12px, 2.5dvh, 20px)", borderRadius: 22,
                border: `4px solid ${active ? tc.primary : tc.primary + "44"}`,
                background: active ? tc.gradientBtn : `${tc.primary}15`,
                color: active ? "#FFFDF5" : tc.textSecondary,
                fontSize: "clamp(17px, 2.8dvh, 22px)", fontWeight: 600, fontFamily: "'Fredoka', sans-serif",
                cursor: "pointer", boxShadow: active ? tc.insetShadow : "none",
                transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                touchAction: "manipulation",
              }}>
                {active && <div style={{ position: "absolute", top: 4, left: 8, width: "35%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${tc.specularHighlight} 0%, transparent 70%)`, pointerEvents: "none" }} />}
                {label}
              </button>
            );
          })}
        </div>
        {showResume && (
          <div style={{ marginBottom: "clamp(8px, 1.5dvh, 20px)", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: "clamp(18px, 3dvh, 24px)", color: t.textSecondary, marginBottom: "clamp(6px, 1dvh, 12px)" }}>Continue where you left off?</div>
            <div style={{ display: "flex", gap: 12 }}>
              <LudoButton theme={theme} size="small" onClick={() => onStart(true)}>Yes! ✨</LudoButton>
              <LudoButton theme={theme} size="small" onClick={() => { setShowResume(false); onReset(); }} style={{ background: `${t.primary}33`, border: `3px solid ${t.primary}44` }}>Start Fresh</LudoButton>
            </div>
          </div>
        )}
        {!showResume && (
          <div style={{ marginBottom: "clamp(8px, 1.5dvh, 20px)" }}><LudoButton theme={theme} size="large" onClick={() => onStart(false)}>Start Bedtime! 🌙</LudoButton></div>
        )}
        {familyMode ? (
          <div style={{ marginTop: "clamp(12px, 3dvh, 32px)", fontSize: 20, color: t.textMuted, fontFamily: "'Fredoka', sans-serif", letterSpacing: 0.5 }}>👨‍👩‍👧 Family Preview</div>
        ) : demoMode ? (
          <div style={{ marginTop: "clamp(12px, 3dvh, 32px)", display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
            <div style={{ fontSize: 24, color: t.accent, fontFamily: "'Fredoka', sans-serif", textAlign: "center", background: `${t.primary}22`, borderRadius: 14, padding: "8px 12px", border: `2px solid ${t.primary}44` }}>🎭 Dad Mode — changes not saved</div>
            <LudoButton theme={theme} size="small" onClick={onOpenShelf} style={{ animation: "none", background: "linear-gradient(180deg, #9B7ED8 0%, #7B5EB0 100%)", border: "4px solid #6B4E9E", boxShadow: "inset 0 -4px 0 #5A3D8A" }}>🏆 Trophy Shelf ({stickers.length})</LudoButton>
            <LudoButton theme={theme} size="small" onClick={onExitDemo} style={{ animation: "none", background: `${t.primary}18`, border: `3px solid ${t.primary}44`, boxShadow: "none" }}>✕ Exit Dad Mode</LudoButton>
          </div>
        ) : (
          <div style={{ marginTop: "clamp(12px, 3dvh, 32px)", display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
            <LudoButton theme={theme} size="small" onClick={onOpenShelf} style={{ animation: "none", background: "linear-gradient(180deg, #9B7ED8 0%, #7B5EB0 100%)", border: "4px solid #6B4E9E", boxShadow: "inset 0 -4px 0 #5A3D8A" }}>🏆 Trophy Shelf ({stickers.length})</LudoButton>
            <LudoButton theme={theme} size="small" onClick={onEnterDemo} style={{ animation: "none", background: `${t.primary}18`, border: `3px solid ${t.primary}33`, boxShadow: "none" }}>🎭 Dad Mode</LudoButton>
          </div>
        )}
      </div>
    </FullScreenBackdrop>
    </>
  );
}

// ==================== TASK SCENE ====================
function TaskScene({ task, taskIndex, theme, completedTasks, currentIndex, onComplete, onNavigate, timerState, onTimerStart, onTimerPause, babyDollState, onBabyDollStart }) {
  const t = THEMES[theme];
  const done = completedTasks[task.id];
  const isTimer = task.type === "timer";
  const isBabyDoll = task.type === "babydoll";
  const showFastForward = !done && ((isTimer && timerState.running) || (isBabyDoll && babyDollState.running));
  return (
    <SceneWrapper theme={theme} taskIndex={taskIndex}>
      {showFastForward && <FastForwardButton theme={theme} onPress={() => onComplete(task.id)} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative", zIndex: 10, gap: 16 }}>
        <div key={done ? "victory" : "normal"} style={{ animation: done ? undefined : "floatGentle 3s ease-in-out infinite" }}><GuideCharacter theme={theme} size={112} variant={done ? "victory" : "normal"} /></div>
        {!(isTimer && timerState.running) && !(isBabyDoll && babyDollState.setup) && (
          <div style={{ fontSize: theme === "kpop" ? 36 : 64, marginBottom: 4, animation: "fadeInUp 0.3s ease 0.1s both" }}>{task[`${theme}Icon`] || task.icon}</div>
        )}
        <div style={{ fontSize: 36, fontWeight: 700, color: t.textPrimary, textAlign: "center", animation: "fadeInUp 0.3s ease 0.2s both", textShadow: `0 2px 12px ${t.shadowColor}` }}>{task.label}</div>
        {task.counter && <div style={{ fontSize: 26, color: t.textSecondary, animation: "fadeInUp 0.3s ease 0.25s both" }}>📚 {task.counter}</div>}
        {isTimer && !done && (
          <div style={{ marginTop: 8, animation: "fadeInUp 0.3s ease 0.3s both" }}>
            {!timerState.running ? (
              <LudoButton theme={theme} size="medium" onClick={onTimerStart} style={{ maxWidth: 280 }}>Start Timer! ⏰</LudoButton>
            ) : (
              <SandTimer seconds={task.duration} theme={theme} running={timerState.running} paused={timerState.paused} onComplete={() => onComplete(task.id)} onTogglePause={onTimerPause} />
            )}
          </div>
        )}
        {isBabyDoll && !done && (
          <div style={{ marginTop: 8, width: "100%", maxWidth: 340, animation: "fadeInUp 0.3s ease 0.3s both" }}>
            {!babyDollState.setup ? (
              <LudoButton theme={theme} size="medium" onClick={() => onBabyDollStart("setup")}>Set Up Baby Doll Time! 👶</LudoButton>
            ) : !babyDollState.running ? (
              <BabyDollSetup onStart={(secs) => onBabyDollStart("start", secs)} theme={theme} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <SandTimer seconds={babyDollState.duration} theme={theme} running={true} paused={babyDollState.paused} onComplete={() => onComplete("babydolls")} onTogglePause={onTimerPause} />
              </div>
            )}
          </div>
        )}
        {done && <div style={{ fontSize: 48, marginTop: 8, animation: "fadeIn 0.3s ease" }}>{ { princess: "👑", mermaid: "🐚", kpop: "🎤" }[theme] || "✨" }</div>}
      </div>
      <div style={{ padding: theme === "kpop" ? "6px 24px 4px" : "20px 24px 8px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 12 }}>
        {!done && task.type === "check" && <LudoButton theme={theme} size={theme === "kpop" ? "medium" : "large"} onClick={() => onComplete(task.id)}>Done! ✨</LudoButton>}
        {done && taskIndex < TASKS.length - 1 && <LudoButton theme={theme} size={theme === "kpop" ? "medium" : "large"} onClick={() => onNavigate(currentIndex)}>Continue →</LudoButton>}
      </div>
      <ProgressTracker completedTasks={completedTasks} currentIndex={currentIndex} theme={theme} onNavigate={onNavigate} compact={theme === "kpop"} />
    </SceneWrapper>
  );
}

// ==================== MAIN APP ====================
export default function HarpersBedtimeApp() {
  const [screen, setScreen] = useState("splash");
  const [theme, setTheme] = useState("princess");
  const [themeLocked, setThemeLocked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showShelf, setShowShelf] = useState(false);
  const [timerState, setTimerState] = useState({ running: false, paused: false });
  const [babyDollState, setBabyDollState] = useState({ setup: false, running: false, paused: false, duration: 0 });
  const [stickers, setStickers] = useState(() => { if (FAMILY_MODE) return []; try { return JSON.parse(localStorage.getItem("harper-stickers") || "[]"); } catch { return []; } });
  const [savedProgress] = useState(() => { if (FAMILY_MODE) return null; try { const s = localStorage.getItem("harper-progress"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [demoMode, setDemoMode] = useState(false);
  const [demoStickers, setDemoStickers] = useState(() => [...DEMO_STICKERS]);
  const [birthdayPinOpen, setBirthdayPinOpen] = useState(false);
  const effectiveStickers = demoMode ? demoStickers : stickers;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  useEffect(() => {
    if (FAMILY_MODE || demoMode) return;
    if (screen === "routine" && completedCount > 0) {
      try { localStorage.setItem("harper-progress", JSON.stringify({ completedTasks, currentIndex, theme, viewingIndex })); } catch {}
    }
  }, [completedTasks, currentIndex, screen, demoMode]);
  useEffect(() => { if (FAMILY_MODE || demoMode) return; try { localStorage.setItem("harper-stickers", JSON.stringify(stickers)); } catch {} }, [stickers, demoMode]);

  const handleComplete = useCallback((taskId) => {
    if (completedTasks[taskId]) return;
    setCompletedTasks(prev => ({ ...prev, [taskId]: true }));
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
    setTimerState({ running: false, paused: false });
    setBabyDollState({ setup: false, running: false, paused: false, duration: 0 });
    const currentIdx = TASKS.findIndex(t => t.id === taskId);
    const newCompleted = { ...completedTasks, [taskId]: true };
    if (Object.keys(newCompleted).length === TASKS.length) { setTimeout(() => setScreen("stickerPick"), 2800); return; }
    let nextIdx = currentIdx + 1;
    while (nextIdx < TASKS.length && newCompleted[TASKS[nextIdx].id]) nextIdx++;
    if (nextIdx >= TASKS.length) nextIdx = TASKS.findIndex(t => !newCompleted[t.id]);
    if (nextIdx >= 0 && nextIdx < TASKS.length) { setTimeout(() => { setCurrentIndex(nextIdx); setViewingIndex(nextIdx); }, 2800); }
  }, [completedTasks]);

  const handleNavigate = (idx) => { setViewingIndex(idx); setTimerState({ running: false, paused: false }); setBabyDollState({ setup: false, running: false, paused: false, duration: 0 }); };
  const handleStartRoutine = (resume) => {
    if (resume && savedProgress && !demoMode) { setCompletedTasks(savedProgress.completedTasks || {}); setCurrentIndex(savedProgress.currentIndex || 0); setViewingIndex(savedProgress.viewingIndex || savedProgress.currentIndex || 0); setTheme(savedProgress.theme || "princess"); }
    if (demoMode) {
      // Pre-load 2 copies of each theme sticker so the first pick is always the 3rd copy → super sticker triggers
      const pool = STICKER_IMAGES[theme] || STICKER_IMAGES.princess;
      setDemoStickers([...pool, ...pool]);
    }
    setThemeLocked(true); setScreen("routine");
  };
  const handleReset = () => { setCompletedTasks({}); setCurrentIndex(0); setViewingIndex(0); setTimerState({ running: false, paused: false }); setBabyDollState({ setup: false, running: false, paused: false, duration: 0 }); setShowCelebration(false); setThemeLocked(false); setScreen("splash"); if (!FAMILY_MODE && !demoMode) { try { localStorage.removeItem("harper-progress"); } catch {} } };
  const handleStickerPick = (sticker) => {
    if (demoMode) {
      setDemoStickers(prev => {
        const next = [...prev, sticker];
        if (isImageSticker(sticker) && next.filter(s => s === sticker).length % 3 === 0) {
          setTimeout(() => setScreen("superStickerPick"), 0);
        } else {
          setTimeout(() => setScreen("countdown"), 0);
        }
        return next;
      });
    } else if (!FAMILY_MODE) {
      setStickers(prev => {
        const next = [...prev, sticker];
        if (isImageSticker(sticker) && next.filter(s => s === sticker).length % 3 === 0) {
          setTimeout(() => setScreen("superStickerPick"), 0);
        } else {
          setTimeout(() => setScreen("countdown"), 0);
        }
        return next;
      });
      try { localStorage.removeItem("harper-progress"); } catch {}
    } else {
      setScreen("countdown");
    }
  };
  const handleSuperStickerPick = (sticker) => {
    if (demoMode) { setDemoStickers(prev => [...prev, sticker]); }
    else if (!FAMILY_MODE) { setStickers(prev => [...prev, sticker]); }
    setScreen("countdown");
  };
  const handleTimerStart = () => setTimerState({ running: true, paused: false });
  const handleTimerPause = () => { setTimerState(prev => ({ ...prev, paused: !prev.paused })); setBabyDollState(prev => prev.running ? { ...prev, paused: !prev.paused } : prev); };
  const handleBabyDollStart = (action, seconds) => { if (action === "setup") setBabyDollState(prev => ({ ...prev, setup: true })); else if (action === "start") setBabyDollState({ setup: true, running: true, paused: false, duration: seconds }); };
  const handleEnterDemo = () => { setDemoMode(true); setDemoStickers([...DEMO_STICKERS]); };
  const handleExitDemo = () => {
    setDemoMode(false); setDemoStickers([...DEMO_STICKERS]);
    setCompletedTasks({}); setCurrentIndex(0); setViewingIndex(0);
    setTimerState({ running: false, paused: false });
    setBabyDollState({ setup: false, running: false, paused: false, duration: 0 });
    setShowCelebration(false); setThemeLocked(false); setScreen("splash");
  };
  const handleBirthdayCollect = (newStickers) => {
    if (demoMode) { setDemoStickers(prev => [...prev, ...newStickers]); }
    else if (!FAMILY_MODE) { setStickers(prev => [...prev, ...newStickers]); }
  };

  if (showShelf) return <TrophyShelf stickers={effectiveStickers} onClose={() => setShowShelf(false)} theme={theme} />;
  if (screen === "birthday") return (
    <BirthdaySurpriseScreen
      onClose={() => setScreen("splash")}
      onCollectStickers={handleBirthdayCollect}
      shelfCount={effectiveStickers.length}
      onOpenShelf={() => setShowShelf(true)}
    />
  );
  if (screen === "splash") return <SplashScreen theme={theme} setTheme={setTheme} onStart={handleStartRoutine} stickers={effectiveStickers} onOpenShelf={() => setShowShelf(true)} onReset={handleReset} hasSavedProgress={!demoMode && !!savedProgress && Object.keys(savedProgress.completedTasks || {}).length > 0} familyMode={FAMILY_MODE} demoMode={demoMode} onEnterDemo={handleEnterDemo} onExitDemo={handleExitDemo} onBirthdayPress={() => setBirthdayPinOpen(true)} birthdayPinOpen={birthdayPinOpen} onBirthdayPinSuccess={() => { setBirthdayPinOpen(false); setScreen("birthday"); }} onBirthdayPinCancel={() => setBirthdayPinOpen(false)} />;
  if (screen === "stickerPick") return <StickerPick theme={theme} onPick={handleStickerPick} stickers={effectiveStickers} onOpenShelf={() => setShowShelf(true)} />;
  if (screen === "superStickerPick") return <SuperStickerPick theme={theme} onPick={handleSuperStickerPick} />;
  if (screen === "countdown") return <Countdown theme={theme} onDone={() => setScreen("dream")} />;
  if (screen === "dream") return <DreamScreen theme={theme} onBack={handleReset} />;

  const currentTask = TASKS[viewingIndex];
  return (
    <>
      <CelebrationParticles theme={theme} active={showCelebration} />
      <TaskScene key={viewingIndex} task={currentTask} taskIndex={viewingIndex} theme={theme} completedTasks={completedTasks} currentIndex={currentIndex} onComplete={handleComplete} onNavigate={handleNavigate} timerState={timerState} onTimerStart={handleTimerStart} onTimerPause={handleTimerPause} babyDollState={babyDollState} onBabyDollStart={handleBabyDollStart} />
    </>
  );
}
