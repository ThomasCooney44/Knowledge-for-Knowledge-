# Knowledge for Knowledge

A GitHub Pages pretotype for a peer-to-peer skill exchange. Teach a lesson, earn a demo token, spend it on another lesson.

## Files
- index.html, style.css, script.js
- Six lesson PNG images in the repository root (not in an assets folder).

## Deploy
Settings → Pages → Deploy from a branch → main → / (root).

## Test the experience
1. Browse the nine sample listings; filter by category, difficulty and lesson length; open "View lesson" to see the teacher profile and availability.
2. Try booking with zero tokens. Create a demo teaching offer and simulate completing it.
3. Confirm a demo booking and open the token dashboard (wallet button or "My tokens"). Mark the lesson completed and rate it, or cancel the booking and check the token is returned.
4. Try the separate "I want to learn this" action. Complete the anonymous pilot form, download its CSV, reload, and check persistence.
5. Reset the demo. No real bookings, lessons, accounts or transfers are created.

## Research and measurement
The pilot form captures a desired skill, willingness to teach, optional offered skill, time commitment and preferred format. It saves one anonymous response per browser; it does not transmit it. Visitors can choose to download and share the CSV. Do not ask visitors to include personal information.

To collect responses centrally, create a team-owned survey containing the same questions, add a privacy notice and set INTEREST_FORM_URL in script.js to its published responder URL. This displays a link to the external survey; it does not automatically submit the local form. Use the survey as the primary collection channel when it is ready. Count distinct responses, proportion willing to teach, offered/requested skill overlap, and time commitments. Do not count simulated token actions as actual demand or completed teaching.

For the pilot, one demo lesson costs one token irrespective of duration; test perceived fairness before building a real marketplace.
