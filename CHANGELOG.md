# Changelog

All changes on the `kfk-coin-token-icon` branch, newest first. Nothing here is live until the branch is merged into `main`.

## 26 Nov 2026 — Trust & safety
- New **Trust & safety** section (before the pilot form), linked as **Trust & safety** in the navigation, with four feature cards: Verified profiles, Ratings & reviews, Report a problem and the Token-back promise.
- **Community guidelines** (six rules: be respectful, describe lessons honestly, meet safely, keep it token-only, show up or cancel early, speak up), also linked from the footer.
- **What makes a good lesson?** guidance (one clear outcome, the right length, start where they are, hands-on practice, something to take away), linked from the lesson builder's example box.
- **Your profile** card with a simulated **email verification** (no email is asked for or stored), plus lessons taught, lessons completed and reviews written.
- **Verified teachers**: sample teacher profiles in "View lesson" show a "✓ Verified email" badge.
- **Publishing requires verification**: if you haven't verified, Publish asks you to verify first. Verification status is also in the preview checklist.
- **Written reviews**: after completing and rating a lesson, learners can add a short review (stored locally, editable).
- **Report a problem** link in every lesson, with reasons: didn't match its description, inappropriate behaviour, felt unsafe, teacher didn't show up, something else. There's also a general "Report a concern about another member" in the profile card.
- **Token-back promise**: reporting that a booked lesson didn't match its description returns the token (once per lesson). The dashboard shows it as "Reported · token returned", and it no longer counts as spent.
- "I felt unsafe" reports show the emergency numbers (112 / 999).
- New FAQ: "How do you keep members safe?"
- All verification, reviews and reports are simulated and stored on the visitor's device only; nothing is sent.

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
