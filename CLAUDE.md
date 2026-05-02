# Harper's Bedtime — Working Agreement

## Required reading (do this first, every session)

Before proposing or making any changes, read **`HARPER-APP_v1_2_24_26_.md`** in
full. It is the source of truth for design philosophy, art direction
(Bluey-inspired "Ludo" buttons, no pure black, warm/cool shadow tinting),
the fixed task list, the "Do Not" rules, edge-case behaviors, and the
roadmap. Anything you suggest or implement must respect those constraints.

If you skip this step you will violate explicit "Do Not" rules (swipe nav,
font sizes under 24px, neutral gray shadows, landscape orientation, etc.).

## Project at a glance

- **What:** A bedtime-routine PWA for Harper, age 5.
- **How it's used:** Deployed to GitHub Pages; accessed via Safari "Add
  to Home Screen" on iPhone (portrait, standalone PWA).
- **Stack:** Vite + React 18, single-component app in `src/App.jsx`
  (~915 lines), mounted from `src/main.jsx`. CSS-in-JS, Google Fonts
  (Fredoka), no other deps.
- **Themes:** Princess / Mermaid. Harper picks on the splash screen and
  the choice is locked for the routine.
- **Persistence:** `localStorage` (keys: `harper-stickers`,
  `harper-progress`, `harper-seed-v1`). The seed key gates a one-time
  backfill of 10 historical stickers in `src/main.jsx` — do not remove
  the gate.

## Spec maintenance (mandatory)

When you change anything the spec documents, update the spec **in the
same commit**. In-scope changes:

- Task list (add/remove/reorder, change timer durations)
- Themes, palette, art direction, frames, character poses
- Flow changes (new screens, changed navigation, sticker logic, reset
  behavior, dream-screen behavior)
- iOS PWA setup (viewport, manifest, safe-area handling, status bar)
- New "Do Not" decisions discovered during work
- Deployment / build / branch workflow

Out of scope (no spec update needed): pure refactors, bug fixes that
don't change observable behavior, dependency bumps.

When you do update the spec, also add a brief entry to the **Known
Tweaks / Punch List** section near the bottom of the spec describing
what changed and why.

## Workflow

- Develop on a feature branch (`claude/...`), then fast-forward merge
  to `main` and push. The `.github/workflows/deploy.yml` workflow
  auto-deploys to Pages on every push to `main`.
- **Default: merge and push to `main` when the work is done.** No need
  to wait for review. If Ben wants to hold a change for review first,
  he'll say so explicitly for that task.
- Harper tests on the deployed site via her iPhone home-screen tile.
  There is no local dev step in her loop — assume "merged to main"
  means "live for Harper."

## Working with Harper

- She's 5 and fickle. She will change her mind about a princess-dress
  color twice in one bedtime. Make changes small, easy to dial back,
  and prefer adjustable values (theme constants, durations) over
  hard-coded magic numbers buried in JSX.
- Sound is deferred to Phase 3. Don't propose audio features.
- Don't add new dependencies without asking. The "no external deps
  beyond React" constraint in the spec is intentional.
