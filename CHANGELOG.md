# Changelog

All changes on the `kfk-coin-token-icon` branch, newest first. Nothing here is live until the branch is merged into `main`.

## 26 Nov 2026 — Guided teaching experience
- Replaced the single "teach a skill" form with a **three-step lesson builder** and a progress indicator:
  1. **Choose your skill**: "What are you comfortable teaching?", with one-click skill ideas (Excel shortcuts, Conversational Spanish, Beginner guitar, Budget meal prep, Interview prep, Python basics), plus category and who it's for.
  2. **Create your lesson**: lesson title, what someone will learn (with a 240-character counter), format, length (15/30/60 min) and optional availability.
  3. **Publish your offer**: a live preview of the marketplace card, a quality checklist (title, detailed description, availability) and **Publish demo offer**.
- Added an **example of a good lesson description** with three writing tips and a "Use this example as a starting point" button.
- Friendly validation messages if the skill is missing or the description is too short (under 30 characters).
- Published offers now appear at the top of the **marketplace** with a "Your listing" badge (visible only on this device), and under **Your published offers** with "Simulate teaching this lesson (+1 token)".
- Publishing and teaching both show up in the token dashboard's activity feed.

## 26 Nov 2026 — Token dashboard
- New **Your token dashboard** section (after "How tokens work"), linked as **My tokens** in the navigation. The wallet button in the header now jumps to it instead of opening a pop-up.
- Shows the **current balance**, **lessons taught**, **lessons completed**, **tokens earned** and **tokens spent**.
- **Progress to your next lesson** bar: 0% (nothing listed), 50% (a teaching offer is listed but not yet completed), 100% (you have a token to spend), with a matching button.
- **Milestones** with progress bars: First token (teach 1), Community teacher (teach 3), Knowledge swapper (teach or complete 5).
- **Community leaderboard** ranked by lessons taught, with "You" highlighted and updating live. Other members are labelled as sample, illustrative data.
- **Your lessons & activity**: booked lessons with **Mark completed** and **Cancel (+1 token)**, plus a feed of recent token activity.
- Booked lessons can now be marked as completed. Ratings unlock after completion (previously after booking).
- All dashboard data is stored on the visitor's browser only.

## 26 Nov 2026 — Realistic marketplace (`4d88c01`)
- New skill categories: Languages, Technology, Business, Cooking, Sports, Music.
- New filters for **difficulty** (Beginner / Intermediate / Advanced) and **lesson length** (15 / 30 / 60 minutes). Search now also matches teacher names.
- Nine sample lessons (previously six). Each card shows the schedule (e.g. "Online conversational class · twice a week"), the title, "Taught by [name] · [level]", the session length, the next available time, a short description, the 1-token price and a **View lesson** button.
- **View lesson** detail panel: teacher profile and bio, availability time slots, **Book with 1 token** and **I want to learn this**.
- Demo **lesson ratings**: unlock only after a lesson is booked in the demo; stored on the visitor's browser only. No pre-filled ratings or reviews.
- Teachers and lessons are labelled as samples ("Sample listing" / "Sample teacher").
- Teach-a-skill form now asks for category, difficulty, online/in person and lesson length.
- Pilot survey "What would you like to learn?" options renamed to match the new lessons. Responses collected before this change use the old names.
- README test steps updated.

## 26 Nov 2026 — Blue and white colour scheme (`8667939`)
- Replaced the brown/cream palette with navy text, bright blue buttons and highlights, and white / light-blue backgrounds across every section.
- The gold KfK coin is unchanged.

## 26 Nov 2026 — Homepage first impression (`9eddd43`)
- New hero headline: "Learn something new. Share something you know."
- New subheading: "Exchange your skills with other people. Teach what you know, earn tokens and use them to learn something completely new."
- Hero buttons renamed to **Explore skills** and **Become a teacher**.
- Hero photo of two people sharing knowledge (`hero-people.jpg`), with floating "Teach Excel +1 token" and "Learn Spanish −1 token" cards and the KfK coin. Check the photo's licence before publishing.
- New **Why swap skills?** section comparing paying for lessons with swapping skills.
- **How tokens work** section now opens with an animated diagram: teach → token goes into your wallet → spend it on a lesson.
- "Why swap" link added to the navigation.

## 26 Nov 2026 — KfK coin as the token symbol (`6714aee`)
- Added `token.png`, a circular transparent cutout of the KfK coin.
- Replaced the ◈ symbol with the coin in the wallet button, the hero, and the price on each lesson card.
