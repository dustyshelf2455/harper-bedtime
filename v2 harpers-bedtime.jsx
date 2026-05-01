import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ==================== TASK LIST (Fixed Order per Spec) ====================
const TASKS = [
  { id: "goodnight", label: "Say Goodnight", icon: "💕", princessIcon: "💖", mermaidIcon: "💙", type: "check", scene: { princess: "🏰 Royal Throne Room", mermaid: "🐚 Coral Greeting Hall" }, bgHue: { princess: 280, mermaid: 210 } },
  { id: "pajamas", label: "Put on Pajamas", icon: "👗", princessIcon: "👸", mermaidIcon: "🧜‍♀️", type: "check", scene: { princess: "👗 Royal Dressing Chamber", mermaid: "🐠 Underwater Wardrobe" }, bgHue: { princess: 290, mermaid: 200 } },
  { id: "clothes", label: "Pick Out Clothes", icon: "👚", princessIcon: "👗", mermaidIcon: "👚", type: "check", scene: { princess: "✨ Princess Closet", mermaid: "🌊 Shell Wardrobe" }, bgHue: { princess: 300, mermaid: 195 } },
  { id: "teeth", label: "Brush Teeth", icon: "🪥", princessIcon: "✨", mermaidIcon: "💎", type: "timer", duration: 60, scene: { princess: "🪥 Royal Bathroom", mermaid: "🫧 Coral Cave Bathroom" }, bgHue: { princess: 285, mermaid: 205 } },
  { id: "mouthwash", label: "Mouthwash", icon: "🫧", princessIcon: "🌟", mermaidIcon: "🫧", type: "check", scene: { princess: "🌟 Sparkling Vanity", mermaid: "💎 Crystal Springs" }, bgHue: { princess: 275, mermaid: 215 } },
  { id: "hair", label: "Comb Hair", icon: "💇‍♀️", princessIcon: "👑", mermaidIcon: "🐚", type: "check", scene: { princess: "👑 Royal Mirror", mermaid: "🪞 Tide Pool Mirror" }, bgHue: { princess: 295, mermaid: 190 } },
  { id: "pee", label: "Try to Go Pee", icon: "🚽", princessIcon: "🏰", mermaidIcon: "🐠", type: "check", scene: { princess: "🏰 Castle Restroom", mermaid: "🐠 Quiet Lagoon" }, bgHue: { princess: 270, mermaid: 220 } },
  { id: "nightlight", label: "Nightlight & Sound", icon: "🌙", princessIcon: "⭐", mermaidIcon: "🌊", type: "check", scene: { princess: "⭐ Starlit Tower", mermaid: "🌙 Moonlit Grotto" }, bgHue: { princess: 260, mermaid: 225 } },
  { id: "babydolls", label: "Baby Doll Bedtime", icon: "🎎", princessIcon: "👶", mermaidIcon: "👶", type: "babydoll", scene: { princess: "👶 Royal Nursery", mermaid: "🍼 Sea Cradle Cove" }, bgHue: { princess: 310, mermaid: 200 } },
  { id: "book1", label: "Read Book 1", icon: "📖", princessIcon: "📖", mermaidIcon: "📖", type: "check", counter: "1 of 2", scene: { princess: "📖 Castle Library", mermaid: "📚 Sunken Library" }, bgHue: { princess: 265, mermaid: 218 } },
  { id: "book2", label: "Read Book 2", icon: "📚", princessIcon: "📚", mermaidIcon: "📚", type: "check", counter: "2 of 2", scene: { princess: "📚 Enchanted Reading Nook", mermaid: "🌟 Deep Sea Story Cave" }, bgHue: { princess: 255, mermaid: 230 } },
];

// ==================== STICKER OPTIONS ====================
const STICKER_SETS = [
  ["🦄", "🌈", "🎀", "🦋", "🌸", "💖", "🍓", "🐱", "🎠", "🧸"],
  ["🐬", "🦀", "🐙", "🐳", "🦩", "🌺", "🍉", "🐰", "🎪", "🧁"],
  ["⭐", "🌙", "🎵", "🎨", "🎭", "🏖️", "🎈", "🦊", "🐝", "🍭"],
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
    guide: "👸",
    progressIcon: "💎",
    progressIconEmpty: "◇",
    particle: "✨",
    dreamMsg: "Sweet dreams, Princess Harper!",
    timerParticle: "✨",
    gradientBtn: "linear-gradient(180deg, #E84B8A 0%, #C23A6F 100%)",
    insetShadow: "inset 0 -4px 0 #9E2A5A",
    specularHighlight: "rgba(255, 200, 230, 0.5)",
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
    guide: "🧜‍♀️",
    progressIcon: "🐚",
    progressIconEmpty: "○",
    particle: "💎",
    dreamMsg: "Sleep tight, little mermaid!",
    timerParticle: "💎",
    gradientBtn: "linear-gradient(180deg, #1AACA8 0%, #158F8C 100%)",
    insetShadow: "inset 0 -4px 0 #0E6E6C",
    specularHighlight: "rgba(200, 240, 255, 0.45)",
  },
};

// ==================== CSS KEYFRAMES ====================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  @keyframes floatUp {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    15% { opacity: 0.8; }
    85% { opacity: 0.8; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  @keyframes floatUpSlow {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-110vh) scale(0.6); opacity: 0; }
  }
  @keyframes fallDown {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(40px); opacity: 0; }
  }
  @keyframes floatGentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }
  @keyframes softPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes countPop {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes crossfadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes bubbleRise {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
    25% { transform: translateY(-25vh) translateX(8px) scale(0.9); opacity: 0.5; }
    50% { transform: translateY(-50vh) translateX(-5px) scale(0.8); opacity: 0.4; }
    75% { transform: translateY(-75vh) translateX(6px) scale(0.7); opacity: 0.3; }
    100% { transform: translateY(-100vh) translateX(-3px) scale(0.5); opacity: 0; }
  }
`;

// ==================== SVG CASTLE FRAME (PRINCESS) ====================
function CastleFrame({ taskIndex = 0 }) {
  const dim = 1 - ((taskIndex || 0) / TASKS.length) * 0.2;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <svg viewBox="0 0 400 800" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="stoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`rgba(74, 32, 108, ${0.9 * dim})`} />
            <stop offset="50%" stopColor={`rgba(58, 24, 86, ${0.95 * dim})`} />
            <stop offset="100%" stopColor={`rgba(42, 18, 68, ${1 * dim})`} />
          </linearGradient>
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F0C23966" />
            <stop offset="100%" stopColor="#F0C23900" />
          </radialGradient>
          <linearGradient id="bannerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E84B8A" />
            <stop offset="100%" stopColor="#C23A6F" />
          </linearGradient>
        </defs>

        {/* Left turret */}
        <rect x="0" y="30" width="50" height="770" rx="6" fill="url(#stoneGrad)" opacity={0.7 * dim} />
        <rect x="0" y="10" width="18" height="30" rx="4" fill="url(#stoneGrad)" opacity={0.8 * dim} />
        <rect x="30" y="10" width="18" height="30" rx="4" fill="url(#stoneGrad)" opacity={0.8 * dim} />
        <ellipse cx="25" cy="110" rx="10" ry="14" fill="#1a0a2e" opacity={0.6} />
        <ellipse cx="25" cy="110" rx="10" ry="14" fill="url(#windowGlow)" />
        <ellipse cx="25" cy="250" rx="8" ry="11" fill="#1a0a2e" opacity={0.4} />
        <ellipse cx="25" cy="250" rx="8" ry="11" fill="url(#windowGlow)" opacity={0.5} />
        <line x1="0" y1="170" x2="48" y2="170" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />
        <line x1="0" y1="320" x2="48" y2="320" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />
        <line x1="0" y1="470" x2="48" y2="470" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />

        {/* Right turret */}
        <rect x="350" y="30" width="50" height="770" rx="6" fill="url(#stoneGrad)" opacity={0.7 * dim} />
        <rect x="352" y="10" width="18" height="30" rx="4" fill="url(#stoneGrad)" opacity={0.8 * dim} />
        <rect x="382" y="10" width="18" height="30" rx="4" fill="url(#stoneGrad)" opacity={0.8 * dim} />
        <ellipse cx="375" cy="110" rx="10" ry="14" fill="#1a0a2e" opacity={0.6} />
        <ellipse cx="375" cy="110" rx="10" ry="14" fill="url(#windowGlow)" />
        <ellipse cx="375" cy="250" rx="8" ry="11" fill="#1a0a2e" opacity={0.4} />
        <ellipse cx="375" cy="250" rx="8" ry="11" fill="url(#windowGlow)" opacity={0.5} />
        <line x1="352" y1="170" x2="400" y2="170" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />
        <line x1="352" y1="320" x2="400" y2="320" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />
        <line x1="352" y1="470" x2="400" y2="470" stroke="#5A2878" strokeWidth="1" opacity={0.3 * dim} />

        {/* Top arch */}
        <path d="M48 60 Q200 0 352 60" fill="none" stroke="url(#stoneGrad)" strokeWidth="8" opacity={0.5 * dim} />

        {/* Banner pennants */}
        <polygon points="120,55 130,55 125,85" fill="url(#bannerGrad)" opacity={0.4 * dim} />
        <polygon points="180,40 190,40 185,72" fill="url(#bannerGrad)" opacity={0.35 * dim} />
        <polygon points="210,38 220,38 215,70" fill="url(#bannerGrad)" opacity={0.35 * dim} />
        <polygon points="270,55 280,55 275,85" fill="url(#bannerGrad)" opacity={0.4 * dim} />

        {/* Floor */}
        <rect x="0" y="755" width="400" height="45" fill={`rgba(30, 14, 53, ${0.6 * dim})`} />
        <line x1="0" y1="760" x2="400" y2="760" stroke="#5A2878" strokeWidth="1.5" opacity={0.2 * dim} />
        <line x1="60" y1="755" x2="60" y2="800" stroke="#5A2878" strokeWidth="0.8" opacity={0.15} />
        <line x1="140" y1="755" x2="140" y2="800" stroke="#5A2878" strokeWidth="0.8" opacity={0.15} />
        <line x1="200" y1="755" x2="200" y2="800" stroke="#5A2878" strokeWidth="0.8" opacity={0.15} />
        <line x1="260" y1="755" x2="260" y2="800" stroke="#5A2878" strokeWidth="0.8" opacity={0.15} />
        <line x1="340" y1="755" x2="340" y2="800" stroke="#5A2878" strokeWidth="0.8" opacity={0.15} />
      </svg>
    </div>
  );
}

// ==================== SVG UNDERWATER FRAME (MERMAID) ====================
function UnderwaterFrame({ taskIndex = 0 }) {
  const dim = 1 - ((taskIndex || 0) / TASKS.length) * 0.2;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <svg viewBox="0 0 400 800" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(26, 172, 168, ${0.35 * dim})`} />
            <stop offset="100%" stopColor={`rgba(14, 110, 108, ${0.5 * dim})`} />
          </linearGradient>
          <radialGradient id="lightBeam" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="rgba(180, 220, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(180, 220, 255, 0)" />
          </radialGradient>
          <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(20, 50, 75, ${0.5 * dim})`} />
            <stop offset="100%" stopColor={`rgba(12, 30, 50, ${0.7 * dim})`} />
          </linearGradient>
        </defs>

        {/* Light rays */}
        <polygon points="100,0 160,800 80,800" fill="url(#lightBeam)" opacity={0.6} />
        <polygon points="250,0 330,800 220,800" fill="url(#lightBeam)" opacity={0.4} />
        <polygon points="180,0 220,800 150,800" fill="url(#lightBeam)" opacity={0.3} />

        {/* Left coral */}
        <path d="M0 800 Q15 600 8 400 Q0 200 20 80 Q25 50 18 30 L35 40 Q40 70 35 100 Q50 250 40 450 Q55 600 45 800 Z"
          fill="url(#coralGrad)" opacity={0.7 * dim} />
        <path d="M18 200 Q-10 170 5 140" fill="none" stroke={`rgba(26, 172, 168, ${0.3 * dim})`} strokeWidth="6" strokeLinecap="round" />
        <path d="M30 320 Q55 290 45 260" fill="none" stroke={`rgba(26, 172, 168, ${0.25 * dim})`} strokeWidth="5" strokeLinecap="round" />
        <path d="M15 480 Q-15 450 0 420" fill="none" stroke={`rgba(18, 74, 110, ${0.3 * dim})`} strokeWidth="5" strokeLinecap="round" />
        <circle cx="22" cy="150" r="6" fill={`rgba(26, 172, 168, ${0.2 * dim})`} />
        <circle cx="10" cy="350" r="5" fill={`rgba(26, 130, 125, ${0.2 * dim})`} />
        <circle cx="35" cy="550" r="7" fill={`rgba(18, 74, 110, ${0.2 * dim})`} />

        {/* Right coral */}
        <path d="M400 800 Q385 600 392 400 Q400 200 380 80 Q375 50 382 30 L365 40 Q360 70 365 100 Q350 250 360 450 Q345 600 355 800 Z"
          fill="url(#coralGrad)" opacity={0.7 * dim} />
        <path d="M382 200 Q410 170 395 140" fill="none" stroke={`rgba(26, 172, 168, ${0.3 * dim})`} strokeWidth="6" strokeLinecap="round" />
        <path d="M370 320 Q345 290 355 260" fill="none" stroke={`rgba(26, 172, 168, ${0.25 * dim})`} strokeWidth="5" strokeLinecap="round" />
        <path d="M385 480 Q415 450 400 420" fill="none" stroke={`rgba(18, 74, 110, ${0.3 * dim})`} strokeWidth="5" strokeLinecap="round" />
        <circle cx="378" cy="150" r="6" fill={`rgba(26, 172, 168, ${0.2 * dim})`} />
        <circle cx="390" cy="350" r="5" fill={`rgba(26, 130, 125, ${0.2 * dim})`} />
        <circle cx="365" cy="550" r="7" fill={`rgba(18, 74, 110, ${0.2 * dim})`} />

        {/* Top arch */}
        <path d="M35 70 Q200 -15 365 70" fill="none" stroke="url(#coralGrad)" strokeWidth="10" strokeLinecap="round" opacity={0.4 * dim} />
        <path d="M30 80 Q200 5 370 80" fill="none" stroke="url(#coralGrad)" strokeWidth="5" strokeLinecap="round" opacity={0.25 * dim} />

        {/* Sandy floor */}
        <path d="M0 760 Q50 750 100 758 Q200 748 300 755 Q350 750 400 760 L400 800 L0 800 Z" fill="url(#sandGrad)" />
        <path d="M20 775 Q60 770 100 775 Q140 780 180 775" fill="none" stroke="rgba(26, 172, 168, 0.1)" strokeWidth="1" />
        <path d="M220 772 Q260 768 300 772 Q340 776 380 772" fill="none" stroke="rgba(26, 172, 168, 0.1)" strokeWidth="1" />
        <ellipse cx="80" cy="778" rx="4" ry="3" fill="rgba(26, 172, 168, 0.15)" />
        <ellipse cx="310" cy="775" rx="3" ry="2" fill="rgba(26, 130, 125, 0.15)" />
      </svg>
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
        }} />
      ))}
    </div>
  );
}

// ==================== PATTERN OVERLAY ====================
function PatternOverlay({ theme }) {
  const isPrincess = theme === "princess";
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.04,
      backgroundImage: isPrincess
        ? `radial-gradient(circle at 20% 30%, #F0C239 1px, transparent 1px),
           radial-gradient(circle at 70% 60%, #E84B8A 1px, transparent 1px),
           radial-gradient(circle at 40% 80%, #F0C239 0.8px, transparent 0.8px),
           radial-gradient(circle at 85% 15%, #E84B8A 0.8px, transparent 0.8px)`
        : `radial-gradient(circle at 25% 25%, #1AACA8 1.2px, transparent 1.2px),
           radial-gradient(circle at 65% 55%, #7FBCD2 1px, transparent 1px),
           radial-gradient(circle at 45% 85%, #1AACA8 0.8px, transparent 0.8px),
           radial-gradient(circle at 80% 10%, #7FBCD2 0.8px, transparent 0.8px)`,
      backgroundSize: isPrincess
        ? "80px 80px, 120px 100px, 60px 90px, 100px 70px"
        : "90px 90px, 110px 110px, 70px 100px, 100px 80px",
    }} />
  );
}

// ==================== VIGNETTE ====================
function Vignette({ intensity = 0.5 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
    }} />
  );
}

// ==================== AMBIENT PARTICLES ====================
function AmbientParticles({ theme }) {
  const emojis = theme === "princess" ? ["✨", "⭐", "🌟"] : ["🫧", "✨", "🌊"];
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
          position: "fixed", fontSize: p.size, left: `${p.x}%`, bottom: "-5%",
          animation: `floatUpSlow ${p.duration}s linear ${p.delay}s infinite`,
          opacity: 0, pointerEvents: "none", zIndex: 3,
        }}>{p.emoji}</div>
      ))}
    </>
  );
}

// ==================== BLUEY-STYLE BUTTON ====================
function LudoButton({ children, onClick, theme, size = "large", disabled = false, style = {} }) {
  const t = THEMES[theme];
  const [pressed, setPressed] = useState(false);
  const sizeStyles = {
    large: { padding: "22px 40px", fontSize: 32, borderRadius: 28, minHeight: 80 },
    medium: { padding: "16px 28px", fontSize: 26, borderRadius: 22, minHeight: 60 },
    small: { padding: "12px 22px", fontSize: 24, borderRadius: 18, minHeight: 50 },
  };
  const s = sizeStyles[size];
  return (
    <button onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
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
function ProgressTracker({ completedTasks, currentIndex, theme, onNavigate }) {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", padding: "12px 16px", flexWrap: "wrap", position: "relative", zIndex: 10 }}>
      {TASKS.map((task, i) => {
        const done = completedTasks[task.id];
        const isCurrent = i === currentIndex;
        return (
          <button key={task.id} onClick={() => done ? onNavigate(i) : undefined}
            style={{
              fontSize: done ? 22 : 16, opacity: done ? 1 : (isCurrent ? 0.7 : 0.25),
              transform: done ? "scale(1)" : "scale(0.8)", transition: "all 0.4s ease",
              filter: done ? "none" : "grayscale(0.8)",
              cursor: done ? "pointer" : "default",
              background: isCurrent ? t.glowColor : "transparent",
              border: isCurrent ? `2px solid ${t.primary}44` : "2px solid transparent",
              borderRadius: 12, padding: "2px 4px", lineHeight: 1,
            }}
          >{done ? t.progressIcon : t.progressIconEmpty}</button>
        );
      })}
    </div>
  );
}

// ==================== SAND TIMER WITH PAUSE ====================
function SandTimer({ seconds, theme, running, paused, onComplete, onTogglePause }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);
  const t = THEMES[theme];
  useEffect(() => { setTimeLeft(seconds); }, [seconds]);
  useEffect(() => {
    if (running && !paused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); onComplete?.(); return 0; }
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
        background: theme === "princess" ? "linear-gradient(180deg, #FFF5F5 0%, #FFE4EC 100%)" : "linear-gradient(180deg, #E0FFFF 0%, #B0E0E6 100%)",
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
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 24, background: `${t.primary}15`, borderRadius: 28, border: `3px dashed ${t.primary}44` }}>
      <div style={{ fontSize: 24, fontFamily: "'Fredoka', sans-serif", color: t.textSecondary }}>Mom or Dad: Set timer!</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setMinutes(m => Math.max(1, m - 1))} style={{ width: 64, height: 64, borderRadius: 20, border: `3px solid ${t.secondary}`, fontSize: 28, cursor: "pointer", fontWeight: 700, background: t.gradientBtn, color: "#FFFDF5", boxShadow: t.insetShadow }}>−</button>
        <span style={{ fontSize: 44, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: t.textPrimary, minWidth: 110, textAlign: "center" }}>{minutes} min</span>
        <button onClick={() => setMinutes(m => Math.min(10, m + 1))} style={{ width: 64, height: 64, borderRadius: 20, border: `3px solid ${t.secondary}`, fontSize: 28, cursor: "pointer", fontWeight: 700, background: t.gradientBtn, color: "#FFFDF5", boxShadow: t.insetShadow }}>+</button>
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
    const emojis = theme === "princess" ? ["✨", "⭐", "💖", "🌟", "👑", "💎"] : ["💎", "🫧", "🐚", "🌊", "💙", "✨"];
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
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: theme === "princess"
        ? `linear-gradient(170deg, hsl(${hue}, 45%, 18%) 0%, hsl(${hue}, 50%, 10%) 35%, hsl(${hue + 10}, 40%, 14%) 65%, hsl(${hue}, 55%, 8%) 100%)`
        : `linear-gradient(170deg, hsl(${hue}, 55%, 14%) 0%, hsl(${hue}, 60%, 8%) 35%, hsl(${hue + 10}, 50%, 12%) 65%, hsl(${hue}, 65%, 5%) 100%)`,
      fontFamily: "'Fredoka', sans-serif", position: "relative", overflow: "hidden",
      animation: "crossfadeIn 0.5s ease-out",
    }}>
      <PatternOverlay theme={theme} />
      {theme === "princess" ? <><Starfield count={35} taskIndex={taskIndex} /><CastleFrame taskIndex={taskIndex} /></> : <><BubbleField count={15} taskIndex={taskIndex} /><UnderwaterFrame taskIndex={taskIndex} /></>}
      <Vignette intensity={0.3 + (taskIndex / TASKS.length) * 0.15} />
      <AmbientParticles theme={theme} />
      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

// ==================== FULL-SCREEN BACKDROP (splash, sticker, dream, etc) ====================
function FullScreenBackdrop({ theme, children, showFrame = false, taskIndex = 0 }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: theme === "princess"
        ? "radial-gradient(ellipse at 50% 30%, #3d2660 0%, #1a0a2e 60%, #0d0521 100%)"
        : "radial-gradient(ellipse at 50% 30%, #0d2847 0%, #0a1628 60%, #050d1a 100%)",
      fontFamily: "'Fredoka', sans-serif", position: "relative", overflow: "hidden",
      animation: "fadeIn 0.6s ease",
    }}>
      <PatternOverlay theme={theme} />
      {theme === "princess" ? <Starfield count={25} taskIndex={taskIndex} /> : <BubbleField count={10} taskIndex={taskIndex} />}
      {showFrame && (theme === "princess" ? <CastleFrame taskIndex={0} /> : <UnderwaterFrame taskIndex={0} />)}
      <Vignette intensity={0.35} />
      <AmbientParticles theme={theme} />
      <div style={{ position: "relative", zIndex: 5, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
    </div>
  );
}

// ==================== TROPHY SHELF ====================
function TrophyShelf({ stickers, onClose, theme }) {
  const t = THEMES[theme];
  const count = stickers.length;
  return (
    <FullScreenBackdrop theme={theme} showFrame={true}>
      <div style={{ padding: "40px 20px", width: "100%", maxWidth: 440, textAlign: "center" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: t.textPrimary, fontFamily: "'Fredoka', sans-serif", marginBottom: 8 }}>🏆 Trophy Shelf</div>
        <div style={{ fontSize: 26, color: t.textSecondary, fontFamily: "'Fredoka', sans-serif", marginBottom: 32 }}>{count} bedtime{count !== 1 ? "s" : ""} completed!</div>
        {count === 0 ? (
          <div style={{ fontSize: 26, color: t.textMuted, marginTop: 40 }}>No stickers yet! Complete your bedtime routine to earn one. ✨</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 12, width: "100%", padding: 20, background: `${t.primary}12`, borderRadius: 28, border: `3px solid ${t.primary}33` }}>
            {stickers.map((s, i) => (
              <div key={i} style={{ fontSize: 40, textAlign: "center", padding: 8, borderRadius: 16, background: `${t.primary}10`, animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>{s}</div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 40 }}><LudoButton theme={theme} size="medium" onClick={onClose}>← Back</LudoButton></div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== STICKER PICK ====================
function StickerPick({ theme, onPick }) {
  const t = THEMES[theme];
  const [options] = useState(() => {
    const set = STICKER_SETS[Math.floor(Math.random() * STICKER_SETS.length)];
    return [...set].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  return (
    <FullScreenBackdrop theme={theme} showFrame={true} taskIndex={TASKS.length}>
      <CelebrationParticles theme={theme} active={true} />
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16, animation: "floatGentle 2.5s ease-in-out infinite" }}>{t.guide}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: t.textPrimary, fontFamily: "'Fredoka', sans-serif", marginBottom: 8, animation: "fadeInUp 0.5s ease" }}>You did it! 🎉</div>
        <div style={{ fontSize: 26, color: t.textSecondary, fontFamily: "'Fredoka', sans-serif", marginBottom: 40, animation: "fadeInUp 0.5s ease 0.2s both" }}>Pick a sticker for your shelf!</div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", animation: "fadeInUp 0.5s ease 0.4s both" }}>
          {options.map((sticker, i) => (
            <button key={i} onClick={() => onPick(sticker)} style={{
              fontSize: 64, padding: 20, borderRadius: 28,
              border: `4px solid ${t.primary}66`, background: `${t.primary}18`,
              cursor: "pointer", transition: "all 0.2s ease", boxShadow: t.insetShadow,
              animation: `fadeInUp 0.4s ease ${0.5 + i * 0.15}s both`,
            }}>{sticker}</button>
          ))}
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
        <div style={{ fontSize: 28, fontFamily: "'Fredoka', sans-serif", color: t.textSecondary, marginBottom: 24, animation: "softPulse 1.2s ease-in-out infinite" }}>Sleepy time in...</div>
        <div key={count} style={{ fontSize: 130, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", color: t.accent, textShadow: `0 0 40px ${t.primary}, 0 0 80px ${t.primary}66`, animation: "countPop 1s ease-out" }}>{count}</div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== DREAM SCREEN ====================
function DreamScreen({ theme }) {
  const t = THEMES[theme];
  const emojis = theme === "princess" ? ["⭐", "✨", "🌟", "💫", "🌙"] : ["🫧", "💙", "🌊", "✨", "🌙"];
  return (
    <FullScreenBackdrop theme={theme} showFrame={true} taskIndex={TASKS.length}>
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, bottom: "-10%", fontSize: Math.random() * 20 + 12, zIndex: 3, animation: `floatUp ${Math.random() * 6 + 4}s ease-out ${Math.random() * 3}s infinite`, opacity: 0 }}>
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      ))}
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: "floatGentle 3s ease-in-out infinite" }}>{t.guide}</div>
        <div style={{ fontSize: 34, fontFamily: "'Fredoka', sans-serif", color: t.accent, textShadow: `0 0 30px ${t.primary}66`, animation: "fadeInUp 1s ease-out", lineHeight: 1.3 }}>{t.dreamMsg}</div>
        <div style={{ fontSize: 26, fontFamily: "'Fredoka', sans-serif", color: t.textMuted, marginTop: 16, animation: "fadeInUp 1s ease-out 0.3s both" }}>🌙</div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== SPLASH SCREEN ====================
function SplashScreen({ theme, setTheme, onStart, stickers, onOpenShelf, onReset, hasSavedProgress }) {
  const t = THEMES[theme];
  const [showResume, setShowResume] = useState(hasSavedProgress);
  return (
    <FullScreenBackdrop theme={theme} showFrame={true}>
      <div style={{ padding: "40px 24px", textAlign: "center", width: "100%", maxWidth: 400 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: t.textSecondary, marginBottom: 6 }}>Harper's</div>
          <h1 style={{
            fontSize: 38, fontWeight: 700, margin: 0,
            background: theme === "princess" ? "linear-gradient(135deg, #F0C239, #E84B8A, #F0C239)" : "linear-gradient(135deg, #7FFFD4, #1AACA8, #7FFFD4)",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>{theme === "princess" ? "✨ Princess Castle ✨" : "🌊 Mermaid World 🌊"}</h1>
          <div style={{ fontSize: 24, marginTop: 6, color: t.textMuted }}>Bedtime Adventure</div>
        </div>
        <div style={{ fontSize: 72, marginBottom: 32, animation: "floatGentle 3s ease-in-out infinite" }}>{t.guide}</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 32, justifyContent: "center" }}>
          {["princess", "mermaid"].map(th => {
            const active = theme === th;
            const tc = THEMES[th];
            return (
              <button key={th} onClick={() => setTheme(th)} style={{
                padding: "14px 24px", borderRadius: 22,
                border: `4px solid ${active ? tc.primary : tc.primary + "44"}`,
                background: active ? tc.gradientBtn : `${tc.primary}15`,
                color: active ? "#FFFDF5" : tc.textSecondary,
                fontSize: 24, fontWeight: 600, fontFamily: "'Fredoka', sans-serif",
                cursor: "pointer", boxShadow: active ? tc.insetShadow : "none",
                transition: "all 0.3s ease", position: "relative", overflow: "hidden",
              }}>
                {active && <div style={{ position: "absolute", top: 4, left: 8, width: "35%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${tc.specularHighlight} 0%, transparent 70%)`, pointerEvents: "none" }} />}
                {th === "princess" ? "👸 Princess" : "🧜‍♀️ Mermaid"}
              </button>
            );
          })}
        </div>
        {showResume && (
          <div style={{ marginBottom: 20, animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: 24, color: t.textSecondary, marginBottom: 12 }}>Continue where you left off?</div>
            <div style={{ display: "flex", gap: 12 }}>
              <LudoButton theme={theme} size="small" onClick={() => onStart(true)}>Yes! ✨</LudoButton>
              <LudoButton theme={theme} size="small" onClick={() => { setShowResume(false); onReset(); }} style={{ background: `${t.primary}33`, border: `3px solid ${t.primary}44` }}>Start Fresh</LudoButton>
            </div>
          </div>
        )}
        {!showResume && (
          <div style={{ marginBottom: 20 }}><LudoButton theme={theme} size="large" onClick={() => onStart(false)}>Start Bedtime! 🌙</LudoButton></div>
        )}
        <button onClick={onOpenShelf} style={{ padding: "14px 28px", borderRadius: 22, border: `3px solid ${t.primary}44`, background: `${t.primary}12`, color: t.textSecondary, fontSize: 24, fontWeight: 600, fontFamily: "'Fredoka', sans-serif", cursor: "pointer", marginBottom: 16 }}>
          🏆 Trophy Shelf ({stickers.length})
        </button>
        <div><button onClick={onReset} style={{ padding: "10px 20px", borderRadius: 16, border: `2px solid ${t.primary}22`, background: "transparent", color: t.textMuted, fontSize: 24, fontFamily: "'Fredoka', sans-serif", cursor: "pointer", opacity: 0.5 }}>🔄 Reset Routine</button></div>
      </div>
    </FullScreenBackdrop>
  );
}

// ==================== TASK SCENE ====================
function TaskScene({ task, taskIndex, theme, completedTasks, currentIndex, onComplete, onNavigate, timerState, onTimerStart, onTimerPause, babyDollState, onBabyDollStart }) {
  const t = THEMES[theme];
  const done = completedTasks[task.id];
  const isTimer = task.type === "timer";
  const isBabyDoll = task.type === "babydoll";
  return (
    <SceneWrapper theme={theme} taskIndex={taskIndex}>
      <style>{GLOBAL_STYLES}</style>
      <ProgressTracker completedTasks={completedTasks} currentIndex={currentIndex} theme={theme} onNavigate={onNavigate} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative", zIndex: 10, gap: 16 }}>
        <div style={{ fontSize: 24, color: t.textMuted, textAlign: "center", animation: "fadeInUp 0.4s ease", textShadow: `0 2px 8px ${t.shadowColor}` }}>{task.scene[theme]}</div>
        <div style={{ fontSize: 56, animation: "floatGentle 3s ease-in-out infinite" }}>{t.guide}</div>
        <div style={{ fontSize: 64, marginBottom: 4, animation: "fadeInUp 0.3s ease 0.1s both" }}>{theme === "princess" ? task.princessIcon : task.mermaidIcon}</div>
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
                <div style={{ fontSize: 24, color: t.textSecondary }}>🍼 Feed salad & tuck dolls in!</div>
                <SandTimer seconds={babyDollState.duration} theme={theme} running={true} paused={babyDollState.paused} onComplete={() => onComplete("babydolls")} onTogglePause={onTimerPause} />
              </div>
            )}
          </div>
        )}
        {done && <div style={{ fontSize: 48, marginTop: 8, animation: "fadeIn 0.3s ease" }}>✅</div>}
      </div>
      <div style={{ padding: "20px 24px 40px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 12 }}>
        {!done && task.type === "check" && <LudoButton theme={theme} size="large" onClick={() => onComplete(task.id)}>Done! ✨</LudoButton>}
        {done && taskIndex < TASKS.length - 1 && <LudoButton theme={theme} size="large" onClick={() => onNavigate(currentIndex)}>Continue →</LudoButton>}
      </div>
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
  const [stickers, setStickers] = useState(() => { try { return JSON.parse(localStorage.getItem("harper-stickers") || "[]"); } catch { return []; } });
  const [savedProgress] = useState(() => { try { const s = localStorage.getItem("harper-progress"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  useEffect(() => {
    if (screen === "routine" && completedCount > 0) {
      try { localStorage.setItem("harper-progress", JSON.stringify({ completedTasks, currentIndex, theme, viewingIndex })); } catch {}
    }
  }, [completedTasks, currentIndex, screen]);
  useEffect(() => { try { localStorage.setItem("harper-stickers", JSON.stringify(stickers)); } catch {} }, [stickers]);

  const handleComplete = useCallback((taskId) => {
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
    if (resume && savedProgress) { setCompletedTasks(savedProgress.completedTasks || {}); setCurrentIndex(savedProgress.currentIndex || 0); setViewingIndex(savedProgress.viewingIndex || savedProgress.currentIndex || 0); setTheme(savedProgress.theme || "princess"); }
    setThemeLocked(true); setScreen("routine");
  };
  const handleReset = () => { setCompletedTasks({}); setCurrentIndex(0); setViewingIndex(0); setTimerState({ running: false, paused: false }); setBabyDollState({ setup: false, running: false, paused: false, duration: 0 }); setShowCelebration(false); setThemeLocked(false); setScreen("splash"); try { localStorage.removeItem("harper-progress"); } catch {} };
  const handleStickerPick = (sticker) => { setStickers(prev => [...prev, sticker]); try { localStorage.removeItem("harper-progress"); } catch {} setScreen("countdown"); };
  const handleTimerStart = () => setTimerState({ running: true, paused: false });
  const handleTimerPause = () => { setTimerState(prev => ({ ...prev, paused: !prev.paused })); setBabyDollState(prev => prev.running ? { ...prev, paused: !prev.paused } : prev); };
  const handleBabyDollStart = (action, seconds) => { if (action === "setup") setBabyDollState(prev => ({ ...prev, setup: true })); else if (action === "start") setBabyDollState({ setup: true, running: true, paused: false, duration: seconds }); };

  if (showShelf) return (<><style>{GLOBAL_STYLES}</style><TrophyShelf stickers={stickers} onClose={() => setShowShelf(false)} theme={theme} /></>);
  if (screen === "splash") return (<><style>{GLOBAL_STYLES}</style><SplashScreen theme={theme} setTheme={setTheme} onStart={handleStartRoutine} stickers={stickers} onOpenShelf={() => setShowShelf(true)} onReset={handleReset} hasSavedProgress={!!savedProgress && Object.keys(savedProgress.completedTasks || {}).length > 0} /></>);
  if (screen === "stickerPick") return (<><style>{GLOBAL_STYLES}</style><StickerPick theme={theme} onPick={handleStickerPick} /></>);
  if (screen === "countdown") return (<><style>{GLOBAL_STYLES}</style><Countdown theme={theme} onDone={() => setScreen("dream")} /></>);
  if (screen === "dream") return (<><style>{GLOBAL_STYLES}</style><DreamScreen theme={theme} /></>);

  const currentTask = TASKS[viewingIndex];
  return (
    <><style>{GLOBAL_STYLES}</style>
      <CelebrationParticles theme={theme} active={showCelebration} />
      <TaskScene key={viewingIndex} task={currentTask} taskIndex={viewingIndex} theme={theme} completedTasks={completedTasks} currentIndex={currentIndex} onComplete={handleComplete} onNavigate={handleNavigate} timerState={timerState} onTimerStart={handleTimerStart} onTimerPause={handleTimerPause} babyDollState={babyDollState} onBabyDollStart={handleBabyDollStart} />
    </>
  );
}
