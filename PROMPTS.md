# AI Prompts Used in Building This Project

## Seed Prompt (Initial Setup)

```
I have a take-home assignment from Gladiator Tennis. I need to build a "Report Match Result"
flow where a user can log a tennis match they played against someone who isn't on the platform yet.

Requirements:
- Form-based flow with required fields
- Clear validation and error messaging
- Confirmation state after submit
- Match scores persist between sessions (localStorage)
- Need to model opponent invite states: "Invited" and "Invitation Accepted"

Stack: React, Next.js, TypeScript

Can you help me plan this out? What's the best way to structure a multi-step form for this?
I'm thinking: Opponent info → Match details → Score entry → Review & submit
```

---

## Iteration Prompt 1: Tennis Score Validation

```
For the score entry step, I need proper tennis scoring validation. Users should only be able
to enter valid set scores like 6-4, 6-3, 7-5, 7-6 (with tiebreak).

Can you create validation logic that:
- Checks if each set score is valid (winner needs 6+ games with 2 game lead, or 7-6/7-5)
- Handles tiebreaks when the score is 7-6 (needs tiebreak points)
- Automatically determines who won the match based on sets won
- Shows helpful error messages if the score doesn't make sense

This is important because tennis has specific scoring rules and invalid scores would look bad.
```

---

## Iteration Prompt 2: Opponent Invite Flow

```
The recruiter clarified: the opponent is NOT an existing Gladiator player. This flow is for
logging a match against someone outside the platform, which triggers an invite.

I need to show two states on the match:
1. "Invited" - invite sent, waiting for response
2. "Invitation Accepted" - they joined and confirmed

How should I model this in the types and show it in the UI? I want a timeline/progress
indicator showing: Match logged → Invite sent → Match confirmed

For the demo, can we simulate the status changing from Invited to Accepted after a few seconds?
```

---

## Iteration Prompt 3: UI Styling Update

```
I have a screenshot of the actual Gladiator Tennis app UI. It has:
- Dark theme with navy/slate background
- Red accent color for primary actions
- Clean card-based layout with subtle borders
- Professional, modern look

Can you update the styling to match this aesthetic? Also add some subtle animations
to make it feel polished - things like:
- Smooth transitions between form steps
- Hover effects on buttons
- Animated success state when match is submitted
- Loading spinners that fit the dark theme

Use Framer Motion for the animations.
```

---

## Iteration Prompt 4: Polish & Edge Cases

```
Before I submit, can you check:

1. Are all the loading/error/empty states handled properly?
2. Does the form validation catch all edge cases?
3. Is the localStorage persistence working correctly?
4. Does it look good on mobile?

Also make sure the opponent search has a nice UX - show existing players if they
type a name, but also let them add a new person who isn't in the system yet.
```

---
## Iteration Prompt 5: Test Suite

```
I need to add a comprehensive test suite for this project. Can you set up Jest with
React Testing Library and write tests that cover:

1. Tennis Score Validation Logic
   - Valid set scores (6-0, 6-4, 7-5, 7-6)
   - Invalid set scores (6-5, 8-6 without tiebreak, etc.)
   - Tiebreak validation (must have winner with 2+ point lead and 7+ points)
   - Match result calculation (best of 3 sets)
   - Edge cases like 3-0 sweeps being invalid

2. Mock Data Helpers
   - Player search functionality (case insensitive, partial matches)
   - API simulation functions (delays, error handling)
   - ID generation (uniqueness, format)
   - localStorage helpers

3. Form Context
   - State initialization
   - Step navigation (next, previous, go to specific step)
   - Form data updates for each step
   - Form reset functionality

4. Component Tests
   - OpponentStep: input rendering, validation errors, form submission
   - MatchHistory: loading states, empty states, match display, error handling

Make sure to mock framer-motion and next/link properly since they cause issues in tests.
Also mock localStorage in the test setup file.

I want good coverage but focus on the critical business logic, especially the tennis
scoring rules since those are complex.
```
---

## Quick Fix Prompts (During Development)

```
The date picker looks weird in dark mode - the calendar dropdown has white background.
Can you fix it to match the dark theme?
```

```
When I go back from step 3 to step 2, the form data is getting reset.
The context should preserve the state between steps.
```

```
The tiebreak input should only show when the set score is 7-6.
Right now it's showing for all sets.
```

---

## Final Review Prompt

```
I'm about to submit this. Can you do a final audit against the requirements?

Requirements checklist:
- [ ] Basic responsive layout
- [ ] Clear state management
- [ ] At least one async data flow
- [ ] Thoughtful loading, error, and empty states
- [ ] Sensible UX decisions and validation
- [ ] Readable, organized code

Also for Option A specifically:
- [ ] Form-based flow with required fields
- [ ] Clear validation and error messaging
- [ ] Confirmation state after submit
- [ ] Match scores persist between sessions
- [ ] Opponent invite states (Invited / Accepted)

What's missing or could be improved?
```


## Notes on Prompt Strategy

**What worked well:**
- Starting with a clear problem statement and requirements
- Breaking down the work into logical chunks (form structure → validation → styling)
- Referencing actual UI screenshots for design direction
- Asking for specific edge cases to be handled
- Specifying exactly what to test and what mocks were needed upfront

**Where I refined AI output:**
- Tennis scoring validation needed several iterations to get the rules right
- Had to clarify the opponent invite flow based on recruiter feedback
- Adjusted animations to be more subtle (AI initially made them too flashy)
- Fixed framer-motion mocks to properly filter out motion-specific props
- Updated test expectations for edge cases like 3-0 sweeps

**Key decisions I made (not AI):**
- Chose multi-step form over single long form for better UX
- Decided to focus on singles matches only (scoping decision)
- Used localStorage instead of a database (appropriate for exercise scope)
- Kept the invite status simulation simple (5-second timer) rather than over-engineering
