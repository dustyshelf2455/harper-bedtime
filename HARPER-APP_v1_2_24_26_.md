# Harper's Bedtime Adventure — App Spec

## Overview
A bedtime routine app for Harper (almost 5 years old) with dual themes: **Princess Castle** and **Mermaid World**. The app guides her through her nightly tasks with themed full-screen scenes, animated celebrations, and a sticker collection reward system.

---

## Themes

| | Princess Castle | Mermaid World |
|---|---|---|
| **Colors** | Pink, purple, gold | Teal, blue, silver |
| **Guide character** | Princess 👸 | Mermaid 🧜‍♀️ |
| **Timer particles** | Sparkles ✨ | Gems 💎 |
| **Progress tracker icon** | Gems 💎 | Shells 🐚 |
| **Dream screen message** | "Sweet dreams, Princess Harper!" | "Sleep tight, little mermaid!" |
| **Selection** | Harper picks on the splash screen each night. **Locked once routine starts.** |

Both themes share the same task list, timers, and logic — only visuals/colors/icons change.

---

## Design Philosophy

This section defines the visual identity, interaction model, and overall feel of the app. It draws from three main inspirations: **Lost in Play** (2024 Apple Design Award winner — experience design), **Bluey** (art direction and shape language), and practical kid-UX research. Every screen, animation, and interaction should be evaluated against these principles.

### Core Experience Principles *(inspired by Lost in Play)*

1. **Interactive cartoon, not an app.** The app should feel like Harper is *inside* a princess story or mermaid adventure — not using a task manager with a theme painted on. Each scene is a little world, not a screen with a button.

2. **Zero reading required.** Communicate everything visually. Task labels are secondary — the illustration *is* the instruction. Icons, character expressions, and environmental context should tell Harper what to do without a single word.

3. **Every scene is its own distinct environment.** "Brush teeth" isn't a card with a toothbrush emoji — it's a royal bathroom or an underwater coral cave. Variety keeps it magical on repeated nightly use.

4. **Characters express emotion through animation, not words.** The princess/mermaid guide character should cheer, dance, encourage, and yawn as bedtime approaches. Even simple SVGs with 2–3 poses (happy, encouraging, sleepy) convey personality.

5. **Progressive atmosphere toward sleep.** Backgrounds gradually darken, stars slowly appear, the guide character starts yawning. The app itself gently signals "it's getting closer to sleep time" through environmental storytelling — never by telling.

6. **No dead ends, no frustration.** Tap targets are forgiving. There's no way to accidentally skip or break a task. Tapping the wrong spot does nothing bad — only the right action moves things forward. The experience should always feel achievable and fun.

7. **Designed for parent + child together.** Parent-facing controls (baby doll timer, theme toggle, settings) should be accessible but never compete with Harper's experience.

### Art Direction *(inspired by Bluey)*

**Shape Language**
- **"Super-ellipse" foundation.** All UI elements use rounded rectangles with high corner radius (25–40% of element height) — mimicking Bluey's "rounded cube" character shapes. No sharp corners anywhere.
- **Chunky proportions.** Everything feels weighted and substantial. Generous internal padding; text/icons never feel cramped.

**Color & Lighting**
- **No pure black — ever.** No `#000000` outlines, borders, or text. All lines/strokes are a darker, saturated shade of the element's fill color (e.g., a pink button gets a deep rose border; a teal element gets a dark teal outline).
- **Vivid, intentional palette.** Colors are bright and saturated, not pastel or washed out.
- **Warm/cool shadow tinting.** Shadows are never neutral gray. Princess theme shadows push toward warm purple/rose. Mermaid theme shadows push toward cool deep-teal/navy. This gives each theme a sense of *light and atmosphere*, not just a color swap.
- **Progressive dimming.** The overall scene lighting subtly shifts cooler/darker as Harper progresses through tasks, reinforcing the journey toward bedtime.

**Themed Environmental Details**
- Subtle theme-specific patterns woven into backgrounds: tiny crown shapes in princess wallpaper, shell shapes in mermaid backgrounds. Little discoveries for Harper to notice over repeated use.
- Backgrounds incorporate "dollhouse-like" proportions and playful scale — furniture and objects feel like toys.

**Character Design Direction** *(for Phase 2 custom art)*
- Simple shapes, big expressive eyes, minimal detail.
- Colored outlines (no black line art) — line color relative to the character and lighting.
- 2–3 poses minimum: happy/encouraging, celebrating, sleepy.
- Should feel like they belong in a Bluey or Gravity Falls episode.

### Scene Frame Strategy *(AI-generated assets)*

The single highest-impact visual upgrade is a **themed frame/border illustration** that wraps every task screen — transforming each screen from "a gradient with emoji on it" into "a scene viewed through a storybook window."

**Approach: One reusable frame per theme (2 images total)**
- **Princess theme**: A castle window arch or ornate stone archway with subtle crown/gem details, framing the task content in the center.
- **Mermaid theme**: A coral cave opening or underwater grotto border, with shells, seaweed, and coral framing the task content.

**Why frames first, not per-task backgrounds:**
- One frame per theme = 2 assets to maintain. Per-task backgrounds = 22 (11 tasks × 2 themes), and if any single image is off-style it breaks visual cohesion.
- A reusable frame gives every screen an immersive "I'm inside the world" feeling without per-scene art.
- The frame is layered *on top of* the CSS atmospheric backgrounds (gradient shifts, floating particles, subtle patterns), so both systems work together.

**Integration approach:**
- Frame images are PNG with transparent centers, overlaid as a fixed wrapper around each task scene.
- Task content (icons, labels, buttons) renders in the transparent center area.
- The CSS background environments (gradients, patterns, particles) show through behind the frame, providing variety per task while the frame provides visual cohesion.

**Future (Phase 2+):** Once the visual identity is locked via the frames, per-task illustrated backgrounds can be added behind/within the frame opening to give each scene its own distinct environment.

### Button & Interactive Element Design *(Bluey "Ludo" model)*

These rules apply to ALL tappable elements — task completion buttons, timer controls, theme toggles, navigation.

**Shape & Size**
- Super-ellipse / high-radius rounded rectangle (25–40% corner radius).
- **Minimum tap target: 80–100px** (nearly double Apple's 44px adult guideline).
- The primary "Done!" button should be **enormous** — roughly filling the bottom third of the screen.
- Generous internal padding so content never feels cramped.

**Outline & Borders**
- Stroke color is always a darker, saturated version of the fill — never black.
- Bold illustrative stroke width: 3–5px. Gives a hand-drawn, storybook feel.

**The "Ludo" Lighting Model (3D toy-like feel)**
- **Inset shadow** at the bottom of the button for a "pressable" 3D appearance — no flat design, no traditional drop shadows.
- Shadow color is a deep, saturated version of the base color (warm purple for pink buttons, deep navy for blue buttons — never neutral gray).
- **Specular highlight**: a small rounded-rectangle "shine" near the top-left corner using a lighter, desaturated version of the base color — like light hitting a plastic toy.

**Typography on Buttons**
- Rounded sans-serif font (Fredoka already fits this well).
- White or very light cream text for high contrast against vivid backgrounds.
- Bold weight, generous letter-spacing.

**Press Feedback**
- On press: instant scale-down + slight darkening (the button "pushes in").
- On release/completion: scale-up bounce + color flash + particle burst.
- Active/tappable elements gently pulse or bounce to signal interactivity.
- Disabled/locked elements appear flat, desaturated, with no lighting effects — clearly inert.

### Screen Layout & Interaction Rules

- **One clear action per screen.** No clutter, no competing elements.
- **Full-screen scenes.** Each task is its own immersive page (not a scrollable list).
- **Navigation via large button tap**, not swipe gestures (too finicky for a 4-year-old).
- **Lots of whitespace / breathing room** between elements.
- **Progress indicators** (reward tracker, progress bar) are subtle/persistent but never dominant.
- **Parent-facing controls** are tucked away or minimized — not competing with the main task.

### Typography Rules

- **Minimum font size: 24px** across the entire app.
- Task labels: **32–40px**, bold, high contrast.
- Keep text to a few words per screen max.
- Rounded sans-serif only (Fredoka or similar with rounded terminals).
- No black text — use deep, saturated theme colors or white/cream.

### Reference Inspirations

| Source | What We Take From It |
|---|---|
| **Lost in Play** | Experience philosophy: visual-first, interactive cartoon feel, progressive atmosphere, no frustration |
| **Bluey** | Art direction: rounded shapes, colored outlines, vivid warm/cool lighting, themed environmental details |
| **Khan Academy Kids** | Age-appropriate interaction patterns, large touch targets |
| **Gravity Falls / Hilda** | Character and world-building tone — whimsical but grounded |
| _(Add screenshots or notes here as we refine)_ | |

---

## Task List (Fixed Order)

| # | Task | Type | Notes |
|---|---|---|---|
| 1 | Say goodnight to family | Checkmark | |
| 2 | Put on pajamas | Checkmark | |
| 3 | Pick out clothes for tomorrow | Checkmark | |
| 4 | Brush teeth | **1-minute sand timer** | Themed: sparkles (princess) or gems (mermaid) falling in timer |
| 5 | Mouthwash | Checkmark | |
| 6 | Comb hair | Checkmark | |
| 7 | Try to go pee | Checkmark | Simple check — no pressure, it's a "try" |
| 8 | Put on Cream | Checkmark | Nightly lotion; icon 🧴 (tube-style cream bottle) |
| 9 | Turn on nightlight/sound machine | Checkmark | |
| 10 | Baby doll bedtime | **Parent-set timer (1–10 min)** | Includes feeding salad + tucking dolls into bed. Parent taps +/− to set minutes before starting |
| 11 | Read Book 1 | Checkmark | Shows "1 of 2" counter |
| 12 | Read Book 2 | Checkmark | Shows "2 of 2" counter |

**Order is fixed** but navigation is free — Harper can tap back to revisit any completed task. The current task is visually prominent; future (incomplete) tasks are dimmed/locked.

---

## Celebration & Progress System

### Per-task completion
- **Themed particle burst** — stars/sparkles for princess, gems/bubbles for mermaid
- **Auto-advance** — after the burst animation plays, the app automatically transitions to the next task scene after ~3 seconds
- No separate jingle or sound in v1 (silent app for now)

### Progress Tracker
- **Horizontal row at the top of each scene** showing one icon per task (12 total)
- Icons: **💎 gems for princess** / **🐚 shells for mermaid**
- Completed tasks show a filled, glowing icon; incomplete tasks show a dimmed/empty outline
- This is purely a progress indicator — the *reward* is the sticker system below

### Scene Transitions
- **v1**: Crossfade to white (clean, dreamy) between scenes
- **Future**: Character-led transition where the guide character walks Harper along a path to the next scene

---

## Sticker Collection System *(replaces streak tracker)*

Harper's reward for completing the full routine is picking a sticker for her trophy shelf. This replaces the old streak counter — it works better for a child who uses the app every other night.

### How it works
1. After completing all 11 tasks, Harper is presented with **2–3 sticker options** to pick from
2. She taps her choice → the sticker animates onto the shelf with a celebration
3. Then the **countdown** plays: "Sleepy time in 5... 4... 3... 2... 1..."
4. Then the **dream screen** appears with themed message and floating particles
5. Dream screen **stays up indefinitely** until parent resets

### Trophy Shelf
- Displays all collected stickers in a shelf/display-case layout
- Shows a simple count: "12 bedtimes completed!"
- **Accessible from the splash screen** — Harper can browse her collection anytime (e.g., show grandparents the next morning)
- Persists across sessions (localStorage, future: cloud sync)

### Future Enhancement
- After reaching milestones (e.g., every 5th sticker), Harper picks a **prize** from 3 options (a little character, stuffed animal, trinket-type thing) that goes on a **digital shelf** she can view in the app

---

## App Flow & Screens

### 1. Splash Screen
- App title / branding
- **Theme picker**: Harper taps Princess or Mermaid (locked once routine starts)
- **Trophy Shelf button**: browse sticker collection
- **Parent controls**: reset routine, future settings
- Start button to begin the routine

### 2. Task Scenes (×12)
- Full-screen immersive scene per task (not a scrollable list)
- One clear action per screen (checkmark button, timer, etc.)
- Progress tracker (gem/shell row) at top
- Large "Done!" button fills bottom third of screen
- For timer tasks: sand timer + **pause button** + start/stop controls
- Harper can navigate back to completed tasks freely
- Each task has a themed scene name (e.g., "Royal Throne Room" / "Coral Greeting Hall") stored in data for internal reference and background styling — **these names are not displayed as visible text on screen**

### 3. Sticker Pick Screen
- Appears after task 11 is completed
- Shows 2–3 sticker options for Harper to choose from
- Selected sticker animates onto the shelf

### 4. Countdown
- "Sleepy time in 5... 4... 3... 2... 1..." with big glowing numbers

### 5. Dream Screen
- Themed message: "Sweet dreams, Princess Harper!" or "Sleep tight, little mermaid!"
- Floating stars/bubbles, themed background
- **Stays up indefinitely** until parent resets from splash screen

---

## Edge Cases & Behavior Rules

| Scenario | Behavior |
|---|---|
| **App closed mid-routine** | On reopen, asks: "Continue where you left off?" or "Start fresh?" |
| **New night / routine reset** | Manual only — parent taps reset button on splash screen |
| **Timer interrupted** | Pause button available; timer pauses and resumes where it left off |
| **Navigating back to completed task** | Allowed freely — tapping a completed task in the progress tracker revisits it |
| **Skipping a task** | No skip feature — parent just marks it done to continue |
| **Theme switching mid-routine** | Not allowed — theme is locked at start from splash screen |
| **Dream screen timeout** | None — stays up until parent resets |
| **Orientation** | **Portrait only** |
| **Sound (v1)** | Silent — no audio. Sound design is a future phase. |

---

## "Do Not" Rules

These are explicit decisions to prevent well-intentioned but wrong implementation choices:

- **Do NOT** use swipe gestures for navigation (too finicky for a 4-year-old)
- **Do NOT** use pure black (`#000000`) anywhere — outlines, text, borders, shadows
- **Do NOT** use neutral gray shadows — always warm or cool tinted per theme
- **Do NOT** show more than one task at a time during the routine
- **Do NOT** put parent controls on routine screens — splash screen only
- **Do NOT** allow theme switching after the routine has started
- **Do NOT** auto-reset the routine — parent must manually reset
- **Do NOT** use streak counters or anything that implies "breaking a streak" pressure
- **Do NOT** use font sizes below 24px anywhere in the app
- **Do NOT** use landscape orientation
- **Do NOT** display scene/room name text on screen (e.g., "Royal Throne Room") — scene names exist in data for internal reference only; the environment should communicate the setting visually, not with a label

---

## Current Tech Stack
- **React** (single .jsx component)
- **CSS-in-JS** (inline styles)
- **Google Fonts**: Fredoka
- **No external dependencies** beyond React
- **Vite** build tool
- **Target device**: iPhone 16 Pro, portrait only

## Deployment & Serving
- **Local development**: `npx vite preview --host` serves the built app on LAN
- Ben views the app on his iPhone over the same Wi-Fi as his dev machine
- The app is added to the iPhone home screen via Safari's "Add to Home Screen" (standalone PWA mode)
- **Build command**: `npm run build` (outputs to `dist/`)
- **Node path**: `$HOME/.nvm/versions/node/v24.14.0/bin` (must be on PATH)
- **Important**: After changing any PWA meta tags (viewport, status bar style, etc.), the home screen icon must be deleted and re-added from Safari — iOS caches these aggressively

## iOS PWA Viewport Setup (Critical — Do Not Change Without Testing)

The app runs as a standalone PWA on iPhone 16 Pro. The following viewport/CSS configuration was carefully debugged and must be preserved:

**Meta tags** (`index.html`):
- `viewport-fit=cover` — extends the viewport into the safe areas (behind notch and home indicator)
- `apple-mobile-web-app-capable=yes` — enables standalone PWA mode
- `apple-mobile-web-app-status-bar-style=black-translucent` — makes the status bar transparent so the app shows behind it

**The bottom gap problem & fix**:
- `black-translucent` shifts the entire document **upward** under the status bar/Dynamic Island by `env(safe-area-inset-top)` (~59px on iPhone 16 Pro)
- This creates a gap at the bottom of the screen equal to that offset
- **Fix**: `min-height: calc(100% + env(safe-area-inset-top))` on the `html` element compensates for the upward shift
- **Do NOT** add `padding: env(safe-area-inset-*)` on `html` — this shrinks the content area and breaks the layout badly
- The `safe-top` CSS class (`padding-top: env(safe-area-inset-top)`) is applied to inner content containers to keep content below the notch
- The `safe-bottom` CSS class (`padding-bottom: env(safe-area-inset-bottom)`) is applied to the ProgressTracker to keep dots above the home indicator

**Anti-zoom/scroll** (viewport meta):
- `maximum-scale=1.0, user-scalable=no` prevents pinch-to-zoom
- `overflow: hidden` on `html, body, #root` prevents scrolling

---

## Current State (v0.1) → What Needs to Change

| Feature | v0.1 Status | Target State |
|---|---|---|
| Theme selection | Toggle during routine | Pick on splash screen, locked once started |
| Task layout | Scrollable list | Full-screen scenes, one task per page |
| Navigation | Sequential only (no going back) | Free navigation — can revisit completed tasks |
| Celebration modes | 4 toggleable options | Removed — replaced by progress tracker |
| Progress indicator | Emoji reward row + progress bar | Gem/shell row at top of screen |
| Streak counter | 🔥 X nights in a row | Removed — replaced by sticker collection |
| Sticker system | Not built | Sticker pick → trophy shelf → count |
| Timer behavior | No pause | Pause button on all timers |
| Dream screen message | "Goodnight, Harper!" | Themed: "Sweet dreams, Princess Harper!" / "Sleep tight, little mermaid!" |
| Splash screen | Not built | Theme picker + trophy shelf + parent controls + start |
| App resume | Always starts fresh | "Continue where you left off?" prompt |
| Routine reset | Reset button on completion screen | Manual reset from splash screen only |
| Sound | None | None (v1 is silent; sound is a future phase) |
| Orientation | Not locked | Portrait only |
| Button styling | Basic CSS | Bluey Ludo model (super-ellipse, inset shadow, specular highlight) |
| Scene framing | Gradient backgrounds + emoji | AI-generated themed frame per theme (castle arch / coral cave) wrapping CSS atmospheric backgrounds |

---

## Roadmap

### Phase 1 — Core Overhaul (current priority)
- [ ] Full-screen scene transitions (one task per page, crossfade to white)
- [ ] Splash screen (theme picker, trophy shelf access, parent controls, start button)
- [ ] Replace celebration modes with gem/shell progress tracker at top
- [ ] Replace streak counter with sticker collection system (pick, shelf, count)
- [ ] Add pause button to all timers (brush teeth, baby doll)
- [ ] Free navigation back to completed tasks
- [ ] App resume: "Continue where you left off?" prompt
- [ ] Manual reset from splash screen only
- [ ] Lock theme once routine starts
- [ ] Portrait orientation lock
- [ ] Bluey-style button overhaul (Ludo lighting, super-ellipse, press feedback)
- [ ] Themed dream screen messages

### Phase 1.5 — Scene Frames (AI-generated, in progress)
- [ ] Generate themed frame/border image for Princess mode (castle arch / storybook window)
- [ ] Generate themed frame/border image for Mermaid mode (coral cave / underwater grotto)
- [ ] Integrate frames as persistent scene wrapper (PNG overlay with transparent center)
- [ ] Verify frames work with existing CSS atmospheric backgrounds (gradients, patterns, particles)

### Phase 2 — Custom Art (AI-generated assets)
- [ ] Custom princess and mermaid character illustrations (2–3 poses each)
- [ ] Per-task illustrated backgrounds within the frame opening (royal bathroom, underwater reading nook, etc.) — only after frame visual identity is locked
- [ ] Character-led scene transitions (guide walks Harper along a path)
- [ ] Progressive atmosphere dimming toward bedtime
- [ ] Polished sticker designs and trophy shelf art
- [ ] Replace emoji with styled SVG icons

### Phase 3 — Polish & Sound
- [ ] Sound design: celebration SFX, ambient background per theme, lullaby finale (Tone.js)
- [ ] Improved sand timer with smoother animations
- [ ] Richer character animations (multiple expressions)
- [ ] Sticker milestone prizes (every 5th sticker → pick a character/trinket for digital shelf)

### Phase 4 — App-Store Quality
- [ ] Package as Vite + PWA (installable on phone)
- [ ] Parent settings screen (edit tasks, reorder, adjust timers)
- [ ] Multi-child profiles (for Cody eventually)
- [ ] Wrap with Capacitor for native iOS app (optional)
- [ ] Cloud persistence for sticker collection

---

## Known Tweaks / Punch List
_Add items here as Harper and Ben test the app:_

- [ ] (example) Timer too short/long for teeth brushing?
- [ ] (example) Harper wants a new task added?
- [ ] (example) Colors need adjustment?
- [x] Removed visible scene/room name text labels from task screens (data retained for internal use)
- [x] Fixed iOS standalone PWA bottom gap caused by `black-translucent` status bar style (see "iOS PWA Viewport Setup" section)
- [x] Added "Put on Cream" task (step 8, checkmark type) after "Try to Go Pee" — nightly lotion Harper applies every night; icon 🧴, princess variant 🌸, mermaid variant 💧; routine grows from 11 to 12 tasks
- [x] Fit-and-finish batch 1: compressed artwork PNGs to WebP (22 MB → 1 MB, 92% reduction); moved GLOBAL_STYLES and Google Fonts to `index.html` (single injection, preconnect + wght@600;700 only); added `<link rel="preload">` for character + frame images; added `prefers-reduced-motion` support (ambient loops pause, reward animations complete instantly); added `touch-action: manipulation` to all buttons (removes iOS 300 ms tap delay); guarded `handleComplete` against double-invocation; fixed stale `onComplete` closure in `SandTimer`; `DreamScreen` floaters stabilised via `useMemo`; countdown no longer flashes "0"; `TrophyShelf` sticker grid is now scrollable; `LudoButton` handles `onPointerCancel`; sticker-pick buttons have press-scale feedback; `aria-label` on all progress tracker buttons.

---

## Premium Design Vision
Target tier: polished kids app (Lost in Play / Bluey quality level). See **Design Philosophy** section above for full art direction and interaction rules. The implementation roadmap, in priority order:

1. **Full-screen scene transitions** — single biggest UX upgrade (in progress)
2. **Bluey-style button & UI overhaul** — apply Ludo lighting model, super-ellipse shapes, colored outlines, and press feedback to all interactive elements
3. **Themed scene frames** — AI-generated castle arch (princess) and coral cave (mermaid) border overlays that wrap every task screen, transforming screens into storybook scenes (in progress)
4. **Custom SVG/AI-generated illustrations** — replace all emoji with princess and mermaid characters (multiple poses), plus per-task illustrated backgrounds within the frames
5. **Sound design** — subtle SFX on task completion, gentle background music per theme, lullaby for finale (Tone.js)
6. **Progressive atmosphere** — scene lighting gradually dims and warms as Harper moves through tasks toward bedtime
7. **Splash screen** — proper themed title screen on launch

Approach is piecemeal — each improvement layers on independently, the app stays usable throughout.

### Competitive Landscape
- **Happy Kids Timer** — animated per-task scenes, countdown timers, star rewards, printable certificates. No multi-child support.
- **Goally** — custom photos/videos/audio per task, parent dashboard, special-needs focused. Premium pricing.
- **Little Streaks** — Apple Design Award pedigree, avoids long streak counts for young kids (argues it creates pressure), caps at 6 tasks, custom icons/colors/sounds per task.

Future features to consider (inspired by competitors): per-task sound effects, custom photos on tasks, printable completion certificates, on-demand single-task mode.

---

## Workflow for Future Claude Chats
1. Paste this spec doc into a new chat
2. Upload or paste the relevant source file(s) being changed
3. Describe the specific task ("refactor to page transitions" or "add unicorn to princess mode")
4. Pull Claude's output back into the codebase
5. Update this spec doc with any changes made
