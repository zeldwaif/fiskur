# Fiskur — Honest Critique

Written at the request of the authors, deliberately harsh. The goal is to find what's
weak while there's still time to fix it, not to be encouraging.

**Overall: 6.5/10 as a hackathon project. 3/10 as a product someone would actually keep using.**

That gap is the whole story. The engineering is better than the average hackathon
submission. The *product* is a thinner version of apps that already exist and have
millions of users. If you only read one section, read "The uncomfortable one" below.

---

## The uncomfortable one: the headline feature is the weakest part

The recommendation engine is what you'd lead a demo with, and it's roughly fifteen
hand-written `if` statements scoring hand-written tags that one person invented in an
afternoon. Nobody validated the weights against real catch data, because there is no
real catch data.

Concretely: why is "in the dusk low-light window" worth **+3** and "warm season" worth
**+2**? There is no answer. Those numbers were chosen because they felt right. The UI
then prints "**score 5**" next to a fish, which communicates a precision the system
does not have. A judge who actually fishes will ask where the weights came from within
about thirty seconds, and the honest answer is "we made them up."

**Two options, pick one before you demo:**

1. **Own it.** Rename "score" to something non-numeric — "Strong match / Fair match" —
   and say out loud in the demo: *"This is a transparent heuristic, not a model. Here's
   the exact rule set, it's forty lines, you can read it. The point is that it explains
   itself, which Fishbrain's black box doesn't."* Weakness reframed as a design choice.
2. **Ground it.** Even one real data source — a public creel survey, DFO catch stats —
   turns "we made it up" into "we calibrated against X." Not achievable today.

Option 1 is the play. Do not let a judge be the one to discover the numbers are arbitrary.

The same critique applies to the species data: fourteen species with prose habitat
descriptions, no citations, no source. It reads authoritative and isn't sourced.

---

## Competitive reality

Fishbrain has millions of users and — critically — millions of *logged catches*, which
is exactly the dataset that makes catch prediction work. Navionics owns charts. ANGLR
and FishAngler own logging. A rules engine written in a day cannot out-predict a company
sitting on years of real catch data. That's not pessimism, it's arithmetic.

**So the differentiator cannot be "better predictions."** Three angles that are actually
defensible:

- **Regulations done properly.** "Can I legally keep this fish?" is the highest-stakes
  question an angler asks. It varies by species, size, season and zone; getting it wrong
  is a fine. Toronto is Ontario Zone 16 — the rules are public, structured, and genuinely
  annoying to look up on the water. **Nobody has made this genuinely good.** This is the
  wedge. It was correctly deprioritized today because bad regulatory data is worse than
  none, but it's the thing that makes this a product instead of a toy.
- **Offline-first.** Fishing happens where there's no signal. See below — it's unbuilt.
- **Sustainability/safety as a first-class citizen** rather than a marketing bullet.

Pick one and say it in the first fifteen seconds of the demo. Right now the pitch is
"a fishing app," which invites the comparison you lose.

---

## Real bugs and structural problems

### 1. A catch log that can silently lose your catches
`savePersisted` wraps `localStorage.setItem` in a `try/catch` that **swallows the error
and does nothing**. localStorage is ~5MB. Photos are stored as base64 data URLs at
roughly 150–270KB each, so somewhere around 20–30 photos the quota is exceeded — and at
that point a logged catch appears in the UI (React state updated) but is **never
persisted**, and is gone on refresh, with no warning to the user.

For an app whose entire premise is "keep a record of your fishing," silently losing
records is the worst possible failure mode. Minimum fix: detect `QuotaExceededError` and
surface it. Real fix: IndexedDB for photo blobs.

### 2. Everything lives in localStorage
Clear your browser and your entire fishing history is gone. No account, no sync, no
export, no second device. Every "durable" feature is durable only until a cache clear.
This is fine as a Tier-2 deferral *if you say so in the demo*, and indefensible if a
judge discovers it.

### 3. The map and the log barely talk to each other
You log a catch by picking from a dropdown of previously-saved spots. The obvious
interaction — **tap the map where you caught it** — does not exist. These are two
separate apps sharing a nav bar. Wiring "long-press map → log catch here" would do more
for the demo than any new screen, and it's maybe an hour of work.

### 4. No offline support, despite being a PWA
The service worker caches the app shell, but the weather and daylight fetches just fail
when offline, and there's no queued-write story for logging a catch with no signal. This
is simultaneously the most defensible feature for a fishing app and completely unbuilt.
The PWA setup currently buys you an install prompt and nothing else.

### 5. Mobile is untested
This is a phone app used on a boat, and it's been developed and verified almost entirely
at desktop width. The responsive CSS exists but has never been properly exercised. Test
it on an actual phone before demoing, or don't claim mobile.

---

## UX

- **The landing gate is a liability.** Every single visit forces a click-through to an
  animation before you can see anything. For a utility you open with wet hands on a boat,
  that's friction traded for style. It also broke debugging twice during development,
  which is a smell. At minimum, remember that the user has already entered.
- **No onboarding.** A new user lands on Toronto Harbour with an empty everything. There's
  no "add your first spot" path. Empty states describe emptiness rather than guiding out
  of it.
- **"Score 5" means nothing to a user.** See above.

---

## Architecture: good, but over-built

Genuinely strong: the feature-based module structure, the provider abstraction, the fact
that swapping the persistence layer won't touch feature code, and the discipline of
labelling sample data as sample. That last one is rarer than it should be and worth
pointing at in the demo.

But it's over-engineered for five screens and zero users. A theme registry, a feature-flag
system, and **three** map provider implementations (two of which — Google and demo — are
dead code you now have to maintain) is a lot of abstraction bought before there was any
demonstrated need. A judge will read this either as engineering maturity or as
gold-plating; be ready to justify it as "so we can swap providers when the free tier
stops being enough" rather than "we like patterns."

---

## What I'd actually do with the remaining time

In priority order, ruthlessly:

1. **Reframe the score** (15 min) — non-numeric labels, and rehearse the "transparent
   heuristic, not a model" line. Removes your biggest demo vulnerability.
2. **Tap map → log a catch there** (~1 hr) — connects your two disconnected halves and is
   the single most impressive thing you could add.
3. **Handle the storage quota** (20 min) — at least tell the user when a save failed.
4. **Test on a real phone** (20 min) — you're claiming a mobile PWA.
5. **Write the regulations story into the pitch** (10 min) — you don't have to build it
   today, but you should be able to say exactly why it's the wedge and why you refused to
   ship guessed legal data. *Refusing to ship it is itself a strong answer* — it shows you
   understand the difference between a feature and a liability.

Do not add another screen. You have enough surface area and not enough depth.

---

## What's genuinely good

So the above is calibrated and not just negativity:

- Real APIs, no keys, no signup — the whole thing runs on free infrastructure and works
  for any coordinates on earth, not just the demo region.
- Choosing to **delete** the tide panel when moving to Toronto, instead of leaving a
  meaningless number on screen, is the single best decision in the codebase. Lake Ontario's
  astronomical tide is a couple of centimetres, swamped by wind seiche. Most teams would
  have shipped the broken panel. Say this out loud in the demo — it demonstrates judgment
  in a way no feature can.
- Explainable-by-construction recommendations, where every point carries a plain-language
  reason, and scores can go *down*. A model that only ever adds points ranks everything as
  "good," which is the same as saying nothing.
- Clean separation between sample data and real data, consistently labelled.
