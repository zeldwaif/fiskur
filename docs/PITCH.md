# Fiskur — Demo Script & Talking Points

Read this once before presenting. The two boxed answers are the ones that decide whether
you look like you understand your own product.

---

## The 15-second opening

> Fiskur is a fishing app for Toronto — Lake Ontario, the harbour, the Islands. It maps
> your spots, logs your catches, and tells you what's worth targeting right now based on
> live conditions. But the thing we actually care about is the part most fishing apps get
> wrong: **being honest about what the app does and doesn't know.**

Do not open with "it's a fishing app with maps and logging." That invites an immediate
comparison to Fishbrain, which has millions of users and years of real catch data, and you
lose that comparison. Open with the honesty angle, because that's the part you can defend.

---

## Demo route (4 minutes)

1. **Map** — Toronto Harbour, satellite. Search a spot. Point out it's OpenStreetMap +
   Esri imagery: no API key, no billing account, works anywhere on earth.
2. **Shift+click the water → "Log a catch here."** This is the money shot. A pin drops at
   the exact point, the panel opens prefilled with that coordinate. Fill in a species,
   attach a photo, save. Then show the catch appearing as a pin on the map *and* in the
   log. Say: *"The catch is pinned to the exact coordinate where it happened, not to a
   named spot we picked from a list afterwards."*
   (Shift is deliberate: plain click has to stay panning, because that's the gesture people
   use constantly. The rare, deliberate action is the one that gets the modifier.)
3. **Live location** — the ⦿ toolbar button starts real `watchPosition` tracking, drawn as
   a blue dot that follows you. Opt-in, not on by default: continuous GPS is a privacy and
   battery cost the user should choose to pay.
4. **Profile** — real stats computed from the log (catches, species collection, release
   rate, personal best), plus the friends list. Be upfront: *"Friends are device-local —
   there's no server yet, so nothing is sent anywhere and the UI says so. We built the
   shape a social graph needs without faking the graph."*
5. **Catch verification — the one nobody has seen before.** Attach a photo to a catch and
   the app reads the photo's own EXIF GPS and timestamp and cross-checks them against what
   you typed: *"Photo GPS matches this spot (within 40 m) · taken within 12 min of the
   logged time"* → **Verified**. Change the spot and watch it drop to *"Photo GPS is 11.9 km
   away"* → **Doesn't match**.
   Say: *"Every social fishing app has unverifiable catch reports, which is why their
   leaderboards are a joke and their hot-spot data is polluted. We turn a claim into
   evidence — the photo independently says where and when it was taken."*
6. **Fishing Logs** — click the photo thumbnail, it opens full size.
7. **Conditions** — live Toronto weather, real sunrise/sunset, and the ranked
   recommendations with the reasons visible under each fish.
8. Land on the two answers below.

---

## Answer 1: "How does the recommendation engine work?"

> **It's a transparent rule set, not a model.** About forty lines: it takes today's real
> sunrise and sunset, the live wind and temperature, and the month, and scores each
> species against tagged behaviours — does it feed in low light, does it hold on structure,
> is it cold-water or warm-water, is it running in autumn. Every point it adds or subtracts
> prints the reason right there in the UI.
>
> We deliberately don't show a numeric score, because we haven't calibrated these weights
> against real catch data — nobody has that data but the big incumbents. So we show
> "Strong / Good / Fair match" and we show our working. **You can audit every
> recommendation this app makes.** Fishbrain can't say that about theirs.

**Why this works:** you are pre-empting the exact hole in your project. A judge who fishes
will find it in thirty seconds. Getting there first turns your biggest weakness into a
deliberate design position. Never let them discover it.

Note the scores can go *down* as well as up — that's worth mentioning. A system that only
ever adds points rates every fish as good, which is the same as saying nothing.

---

## Answer 2: "What's the actual wedge? Why would anyone use this over Fishbrain?"

> **Regulations.** The highest-stakes question an angler asks isn't "what should I catch",
> it's *"am I allowed to keep this?"* In Ontario that answer depends on species, size,
> season, and which of twenty fisheries-management zones you're standing in — Toronto is
> Zone 16. Get it wrong and it's a fine. The rules are public but genuinely painful to
> check on the water.
>
> **Nobody has made this good.** That's the wedge, and it's the next thing we build.

Then, the part that actually impresses:

> And it's precisely why we *didn't* ship it today. We could have hard-coded some size
> limits and demoed a regulations screen this afternoon. But wrong legal information is
> worse than no legal information — it's the one feature in this app where being confidently
> wrong could actually cost a user money. We're not shipping it until it's sourced from the
> real regulation data, with the source and date shown to the user.

**Why this works:** every team ships features. Almost none can explain a feature they
deliberately refused to ship. It demonstrates you understand the difference between a
feature and a liability, which is a maturity signal you cannot fake.

---

## Same reasoning, second example: the tide panel

Have this ready, it reinforces the same point:

> The app originally had a tide panel — it was built for a saltwater region. When we moved
> the demo to Toronto we deleted it. Lake Ontario's astronomical tide is about two
> centimetres and it's completely swamped by wind-driven seiche, and NOAA has no Canadian
> Great Lakes tide predictions. The nearest-station lookup would have quietly pulled a
> station on the Atlantic coast and shown a confident, meaningless number.
>
> So we replaced it with sunrise/sunset, which is the thing that actually drives feeding in
> this fishery. **We'd rather remove a panel than display a number that means nothing.**

---

## Known weaknesses — have honest answers ready

Do not pretend these don't exist. Getting caught hiding one is worse than any of them.

| If they ask | Say |
|---|---|
| "Where's the backend?" | Everything is local-first in browser storage. Accounts and sync are the next tier. We chose to make the on-the-water experience real before making it multi-device. |
| "What happens offline?" | The app shell is cached and installs as a PWA, but the conditions fetches need a signal and there's no write queue yet. Offline-first is the highest-value thing left on our list — fishing happens where there's no signal. |
| "Is the species data sourced?" | It's regionally-accurate general angling knowledge, not cited research. It drives the picker and the heuristic. Same standard as the regulations answer: we'd cite it before we'd claim authority. |
| "Why three map providers?" | The provider interface means we can swap OpenLayers for Google if the free tier stops being enough, without touching feature code. Today it runs entirely on free, keyless sources. |
| "Isn't this just Fishbrain?" | Fishbrain wins on prediction because they have the catch data. We're not competing there — see the regulations answer. |
| "Can't someone fake a verified catch?" | Yes, with effort — you could edit EXIF. It raises the cost of lying from zero to non-trivial, which is the whole point. And we never accuse: a photo with no GPS is "unverified", a neutral state, not a fraud flag. |
| "What if the photo has no GPS?" | Very common — phones and messaging apps strip it. That catch is simply unverified. The feature adds a signal when one exists; it never punishes its absence. |

---

## What to say last

> Everything you just saw runs on free, keyless APIs and works for any coordinate on earth
> — we pointed it at Toronto, but there's nothing Toronto-specific in the architecture. The
> next two things we build are offline logging and Ontario regulations, in that order.
