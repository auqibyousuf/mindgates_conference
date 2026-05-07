# SPEC: Conference Event Platform

## Project Overview
**Conference Event** is a premier organization for scholarly study, facilitating National and International Conferences and academic publishing. The platform serves as a central hub for researchers to find upcoming conferences, view past events, browse published books, and recognize award winners.

**Core Mission:** Provide a vibrant forum for researchers worldwide with a premium, reliable, and easily maintainable web presence.

---

## Stakeholder Requirements
- **Editable Content:** The website must be "editable because conference content changes daily."
- **Data Sections:**
    - **Conferences:** Separate views for "Upcoming" and "Past" events.
    - **Books Published:** Gallery/List view with Author, Title, ISBN, and Front Page previews.
    - **Editor's Board:** Profiles for Chief Editor and Governing Council.
    - **Awards:** Recognition section for authors and researchers.
    - **Gallery:** Visual showcase of events.
    - **Contact:** Information for SSM College and Mindgates Softtech Solutions.

---

## Technical Stack (Proposed)
- **Framework:** Next.js (for SEO and performance).
- **Styling:** Vanilla CSS + "Liquid Glass" design system tokens.
- **Content Management:** JSON-based local CMS (for easy manual editing) or a lightweight headless CMS integration.
- **Components:** Modular React components for Conferences, Books, and Award cards.

---

## Design System: "Academic Glass"
A evolution of the "Liquid Glass" system:
- **Primary Color:** Deep Academic Blue or Emerald (based on previous preferences).
- **Surface:** Glassmorphic cards with subtle borders (`backdrop-filter: blur`).
- **Typography:** Serif for headings (scholarly feel), Sans-serif for body (readability).

---

## Data Models

### Conference
- `id`: string
- `title`: string
- `date`: string
- `venue`: string
- `type`: 'National' | 'International'
- `status`: 'Upcoming' | 'Past'
- `brochureUrl`: string (PDF)
- `proceedingsUrl`: string (PDF)

### Book
- `id`: string
- `author`: string
- `title`: string
- `isbn`: string
- `frontPageImage`: string
- `purchaseUrl`: string (optional)

### Award
- `id`: string
- `authorName`: string
- `title`: string
- `eventName`: string
- `eventDate`: string
- `awardName`: string

---

## Phase 1 Objectives (MVP)
1. Initialize Next.js project with GSD structure.
2. Implement the "Academic Glass" design system.
3. Build the Home page with Director Message and Notification sections.
4. Create the JSON-driven data layer for Conferences and Books.
