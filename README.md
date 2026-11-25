# Knowledge for Knowledge

A lightweight GitHub Pages starter website for a university pretotype.

## Concept
Knowledge for Knowledge is a marketplace where people teach a skill to earn a token, and spend tokens to learn another skill.

## Files
- `index.html` – structure and content
- `style.css` – styling and layout
- `script.js` – demo logic for tokens, filtering and bookings
- `assets/` – bundled lesson images used in the marketplace

## Included lesson images
This updated version includes the user-provided images for:
- Spanish lessons
- Excel lessons
- Photography lessons

## How to use
1. Upload the files to your GitHub repository.
2. Keep all files in the root, with the `assets` folder beside them.
3. Enable GitHub Pages from `Settings → Pages → Deploy from a branch → main → / (root)`.
4. Open the live site URL after deployment.

## Demo behaviour
- Teaching offers, token balance and sample bookings are stored only in the browser using localStorage.
- No real accounts or payments exist.
- To connect a real sign-up form, add your Google Form link to `INTEREST_FORM_URL` in `script.js`.

## Notes
- Built with plain HTML, CSS and JavaScript so it works smoothly on GitHub Pages.
- Designed as a pretotype, not a full marketplace.
