# أليفا — Alifya

A beautiful, interactive **Arabic language learning app** with a warm, Claude/Anthropic-inspired interface. Fully RTL, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🏠 **Dashboard** — hero, progress stats, continue-learning, and full lesson catalog
- 📚 **9 interactive lessons** — greetings, numbers, family, food, time, verbs, travel, shopping, conversation
- 🃏 **Flip-card vocabulary** — tap to reveal meaning + real-life example sentences
- 💬 **Phrases section** — common expressions with cultural notes
- ❓ **In-lesson quizzes** — instant feedback, explanations, and retry
- 📈 **Progress tracking** — XP, streaks, best scores (persisted in localStorage)
- 🔍 **Search & category filters** on the lessons page

## Tech

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Fonts: Amiri (serif) + Cairo (sans) via `next/font`
- Zero backend — progress stored client-side in localStorage
- Fully responsive + RTL (`lang="ar" dir="rtl"`)

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```