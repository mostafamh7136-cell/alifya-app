# LRN-01 Learning QA — History

- Agent: LRN-01 / Nyx
- Target: https://alifya.vercel.app
- Repo: mostafamh7136-cell/alifya-app @ 24d41406500dcd0e7365bdd157eda22c9828cebe
- Drive: 1NBLuSw01KsyX_E5eyu8SnWmr-GN0cert (Alifya Arabic project)
- When: 2026-09-10 EEST
- Source edits: none (no proven P0 learning-break with a one-line safe UI-string fix)

## Scope executed

1. Opened production home and `/lessons/greetings`.
2. Started Greetings & Introductions (id `greetings`).
3. Inspected Learn / Review / Listen session, header audio, welcome audio, scoring code, persistence code.
4. Played welcome control via real click + inspected `<audio>` attributes.
5. Compared UI claims against `components/AudioButton.tsx` human-only map.

## Real path: Greetings lesson

| Layer | Observed |
| --- | --- |
| Entry | Home CTA `Start with greetings` → `/lessons/greetings`. Course card Start also routes here. |
| Header | Title EN/AR, 8 min, 15 words, 5 questions pill. |
| Session | `PracticeSession` Learn mode: card `مرحباً` / Marhaban, Reveal meaning, compact human-recording control. Modes: Learn, Review, Listen. |
| Quiz UI | `components/Quiz.tsx` exists in repo. **Not mounted** on greetings or generic `[id]` lesson pages. Pill “5 questions” is metadata only. |
| Scoring (session) | Learn/Review/Listen increment `score` when rating ≠ again or meaning match / typed match. Finish card shows `{score}/{15}`. On last card `recordLessonResult(lessonId, newScore, 15)`. |
| Scoring (progress) | `lib/progress.ts` key `alifya:progress:v2`. XP gain `max(10, score*8) + (pct>=80?15:0)`. Best score stored. Streak by calendar day. |
| Feedback | Reveal → Again/Hard/Good/Easy. Review multiple-choice meaning. Listen type Arabic or translit. Finish copy schedules reviews by difficulty. Quiz explanations exist in data but are unreachable. |
| Persistence | Designed as localStorage + `alifya:progress-updated`. Home/lesson subscribe. This QA browser did not retain storage across refresh (harness isolation). Code path is coherent; live persistence not proven in this session. |

## Audio / MSA claim

`AudioButton` comment and implementation: curated Wikimedia/Lingua Libre files only. Explicit: no browser TTS, no dialect fallback.

Welcome button on home uses text `مرحباً بك في أليفا`. That string is **not** in `HUMAN_ARABIC`. Click result: `data-audio-source="unavailable"`, empty `src`, `speechSynthesis.speaking=false`. Label stays “Play welcome”; compact/error copy would be “MSA recording unavailable” if non-compact after click.

Header “Human recording” on greetings uses first vocab `مرحباً` — mapped to Wikimedia wav. Header “English audio” uses `lang="en"`; `speak()` returns immediately (`if (lang !== "ar") return`). Dead control.

Verdict: **not robotic TTS**. The product refuses TTS. The marketing claim “Play welcome / human MSA” overreaches: welcome phrase has no human asset, so the control is a no-op. Several greetings tokens also lack map entries (`كيف حالك؟`, `أنا بخير، شكراً`, `ما اسمك؟` vs map key `ما اسمك`, `اسمي…`, `شكراً جزيلاً`, `من فضلك`, `عفواً`, `نعم / لا`). Listen mode on those items cannot play.

Wikimedia sources are human recordings (Lingua Libre / Commons), not neural TTS — when they load.

## Bugs

### BUG-0001 — Quiz component never mounted
- Severity: P1 learning gap (not a one-line string fix)
- Evidence: `Quiz.tsx` unused; lesson pages only render `PracticeSession`. UI still advertises 5 questions.
- Impact: written quiz scoring, explanations, and percent feedback never run.

### BUG-0002 — Play welcome has no human asset
- Severity: P2 honesty / UX
- Evidence: home `AudioButton text="مرحباً بك في أليفا"`; map miss; click → unavailable; no TTS fallback (by design).
- Suggested later fix (one-line, not applied): change welcome text to mapped `مرحباً`.

### BUG-0003 — English audio button is inert
- Severity: P2
- Evidence: `lang="en"` early-return in `AudioButton.speak`.

### BUG-0004 — Human-audio coverage far below vocab set
- Severity: P2 listen-mode
- Evidence: map ~15 keys vs 136+ claimed vocab; greetings Listen will fail on most cards.

No P0 one-line UI-string patch applied.

## Defense notes (Nyx)

Scoring formula is deterministic and local. Persistence is client-only; clearing site data wipes XP. Wikimedia hotlinks can 404 or be blocked; the UI then says unavailable rather than inventing a voice — correct for honesty, weak for learning continuity.

## Pass / fail snapshot

| Check | Result |
| --- | --- |
| Production opens | Pass |
| Greetings lesson starts | Pass |
| One exercise UI present (Learn card) | Pass |
| Exercise completed end-to-end in this harness | Partial — session UI live; last-card persist not visually confirmed after refresh |
| Scoring logic | Pass in source |
| Feedback after reveal | Pass in source / UI structure |
| Persistence after refresh | Inconclusive in harness; implemented in source |
| Play welcome | Control exists; no audio (BUG-0002) |
| Robotic TTS vs human MSA | No TTS. Human files only when mapped. Welcome claim false. |
