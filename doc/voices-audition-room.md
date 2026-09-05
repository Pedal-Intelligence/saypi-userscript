# The audition room — the design behind Settings → Voices

**A design document, not a specification.** It explains what this page is trying to do and why it
goes about it this way, so that you can make good decisions about it rather than merely consistent
ones. If you need geometry, storage shapes, file names or call sites, those live in
[`doc/plans/2026-07-31-voices-audition-room-design.md`](plans/2026-07-31-voices-audition-room-design.md).
Read this one first; that one only makes sense once you know what it is serving.

---

## 1. The problem

SayPi's voice catalog went from a handful to 22 and will keep growing — the server owns it, and new
voices arrive without a client release. The obvious framing is *"we have too many voices, how do we
avoid overwhelming people?"*, and the obvious answer is tiers, shelves and progressive disclosure.

That framing is wrong, and it produced the page we replaced:

![The Voices tab before: a grid of cards with gradient orbs](images/voices-audition-room/01-before-cards.png)

Look at what that page asks of someone choosing a voice. Twenty-two coloured circles, each of which
must be clicked individually to hear anything. Names that mean nothing (*Ballad*? *Onyx*?). Taglines
that are honest but thin — "Smooth and melodic" and "Soft-spoken clarity" are not a decision. Two
cards both called **Paola**, distinguished only by the length of their descriptions. A hero panel
whose entire job is to announce that nothing has happened yet. Tier headings that state one fact
twice, from both ends.

The real problem is narrower and more useful than "too many voices":

> **A voice cannot be evaluated by reading.** Every name, tagline, badge and colour on that page is a
> *proxy* for the one fact that decides the choice: what it sounds like. So the page's job is not to
> organise proxies more cleverly. It is to get the user to sound as fast as possible, and to let them
> compare what they heard.

The old page was a **directory**. It answered "what voices exist?" — a question nobody has. The
question people actually have is "which of these do I want talking to me every day?", and answering
it on the old page meant twenty-two separate clicks with no memory of which you had already tried.
By the seventh card you have forgotten the first.

---

## 2. Goals

In priority order. When two conflict, the higher one wins.

1. **Time-to-ear.** Minimise actions between opening the page and hearing a voice. Then minimise
   actions to hearing a *second* one, because one voice in isolation tells you almost nothing.
2. **Comparison without memory.** The user must be able to put two voices back-to-back at will, and
   must never need to remember what something sounded like a minute ago.
3. **Legible at a glance.** Before reading a single word, the shape of the page should tell you
   something true about the voices in it.
4. **Calm.** This is a settings page inside a product about being hands-free and unbothered. It
   should not feel like an audio workstation, and it should not feel like work.

### Non-goals, stated so you don't drift into them

- **Not a catalog browser.** Completeness, filtering power and metadata richness are not virtues
  here. If a control does not help someone *choose*, it is clutter.
- **Not a place to show off the catalog's size.** Twenty-two is not a feature.
- **Not a configuration surface.** There is exactly one commitment (`Use`) and one optional
  refinement (pinning, on hosts that have an in-chat menu). Resist adding a third.

---

## 3. Constraints

These shaped the design more than the goals did. Several are not obvious.

**Every preview must be free.** Sample clips are pre-rendered, served without credentials, and cached
for a year. This is the single most load-bearing constraint on the page: it is why the user can play
everything, repeatedly, in any order, with no meter running and no warning copy. Anything that
introduces a per-play cost breaks the page's whole posture. See §6.

**The catalog is server-owned and grows.** A voice can appear tomorrow. Nothing may be hard-coded per
voice, and nothing may re-draw the existing voices when a new one lands. Scales are therefore keyed
to **fixed constants**, never to the catalog's own min/max.

**690px is the pane's ceiling, not its width.** Settings open in a browser tab whose content column
is the same at 1100px and at 1920px, so the page gets roughly 690px and cannot ask for more — a
Voices-only width rule is a known regression class here. Do not design against a wide window; there
isn't one, however big the screen is.

But the move that fixed the ceiling also removed the floor. Settings used to be a popup with a
736px minimum, which meant the shell's mobile layout could never actually engage; in a tab it does,
and this pane is now also drawn at ~440px (an ordinary half-screen desktop window — the sidebar is
still charged for, so the desktop layout at 736px is *narrower* than the mobile one at 700px) and at
~334px on a phone. So the column is not merely narrow, it is a range, and roughly half of it is
below what a single row of print, name, badge, description and action can fit in. What the page does
about that is in §5.

**The two hosts are not symmetric.** Claude has an in-chat voice menu with a small number of seats,
so pinning means something there. Pi retired its menu, so pinning would be a control that does
nothing. The page must degrade to "no menu concept at all" without looking broken or half-built.

**Everything is translated.** Copy lands in ~30 locales, some 40% longer than English. Chrome's i18n
has no plural forms. Counts must read correctly at 1 without a second string.

**Accessibility is not a pass at the end.** Audio that starts on its own is hostile to a screen
reader user, and colour that carries meaning alone is hostile to a colourblind one. Both are designed
around from the start rather than patched.

---

## 4. Design philosophy

Six principles. Most of the specific decisions below fall out of them, and if you are weighing a
change, these are the things to weigh it against.

### Every mark must be measured

Nothing on this page may *look* informative while carrying no information. The previous design's
gradient orbs were derived from a hash of the voice's id: they looked like a code you could learn and
were noise. That is worse than plain grey, because it invites the user to find a pattern that is not
there.

The rule that replaced it: **if you can see a difference between two marks, you must be able to hear
it.** Every pixel of a voice's mark comes from the audio you are about to judge.

### Spend colour on order, never on identity

Colour was banned from the previous redesign for good reason — 22 hues is confetti. But the ban was
aimed at the wrong target. What made the orbs bad was not colour; it was that the colour was
*arbitrary*. A single ordered ramp, keyed to a measured quantity, is the opposite of confetti: it
reads as one gradient flowing down the page and reinforces the ordering that is already there.

So: **no voice has a colour. The scale has a colour.** If you ever find yourself picking a swatch for
a particular voice, you have left the design.

### Encode important things more than once

Pitch is expressed three times: the row order, the vertical position of the trace, and the hue. This
is deliberate redundancy, not repetition. A user who cannot distinguish the hues loses nothing, and a
user who does not consciously notice the ordering still absorbs it from the shape.

### The page must not cost money

Nothing here spends a credit, so there is no budget to explain, no warning to write, no
"are you sure?", and no reason not to press play on everything. A large part of why the page feels
relaxed is that it *is* free, and the user can tell.

### Calm at rest, informative on demand

Twenty-two rows of full-strength detail is a wall. So the resting state is quiet — name, mark, and
nothing else — and the row you are pointing at reveals its description and its actions. The exception
that proves the rule: a voice whose name is ambiguous (two Paolas) shows its differentiator
**always**, because a disambiguator that hides does not disambiguate.

### Don't make the user hold state in their head

The page remembers what you have heard, so you never re-audition by accident and never lose your
place. The comparison pair populates itself from what you actually listened to, so "play the other
one" needs no setup. Anything that requires the user to track something mentally is a design failure
to be fixed, not a feature to be documented.

---

## 5. The approach

![The rail on Pi](images/voices-audition-room/02-rail-pi.png)

One list, called **the rail**. Every voice is one 42px row. There are no cards, no tier shelves, no
hero panel, and no rules between rows — separation comes from rhythm.

### Ordered by pitch, deepest to brightest

Price was the old organising axis: *HD* and *Everyday*. That is the vendor's axis. Nobody thinks
"I would like an Everyday voice"; they think "something deeper" or "something brighter". Pitch is a
listener's axis, it is continuous rather than chopped into two bins, and — unlike accent (populated
but nearly constant) or speaking rate (not populated at all) — it can actually be sourced, by
measuring it.

Tier survives as a **badge and a filter**, which narrow a continuum, rather than as shelves, which
chop it. The cost note that used to be a decorative shelf heading is now attached to the *voice*: it
hangs off every HD row as an ARIA description and off the `HD` chip as a tooltip, on every filter, and
it is still the HD filter's helper line when you choose that filter. Attaching it only to the filter
was the first attempt and it had a hole big enough to walk through — the default view is `All
voices`, so anyone who picked an HD voice without narrowing first never met the cost at all.

### Each voice is drawn from its own clip

![What a soundprint encodes](images/voices-audition-room/04-soundprint.png)

The **soundprint** is the page's signature. It is the same single decode pass that produces the
ordering, the mark and the loudness match — which is why it is the signature and not a garnish.

The faint horizontal line is the load-bearing detail. It sits at the same frequency, at the same
height, on every row. Without it you have 22 unrelated little pictures; with it you have one chart,
and the eye reads a continuous descent from deep to bright before it reads a single name.

Two voices that sound alike look alike. A fast talker's print is short. A monotone voice is a flat
ridge. The gaps are consonants and breaths — and the wide gap in the middle is a sentence boundary,
which is how we discovered that the Everyday clips all read the same line (see §6).

### On a narrow column the row spends height instead

The row above is one line of seven things, and it needs about 600px to be one honestly. Below that —
a half-screen window, a phone — something has to give, and which thing gives is not a free choice.
The mark gives first: it is a chart drawn against a fixed axis, so at a smaller scale it says exactly
what it said before. The name gives second; a name that ends in an ellipsis is a small loss. The
description gives last and, in practice, never — it is the twins' only difference, and a page with
two rows both reading *Paola* is not a narrower page, it is a broken one. Which is what the narrow
column used to produce: below about 580px the description sat on its floor at every width, the
longer taglines were ellipsised outright, and the twins' disambiguator had exactly zero headroom
left — on a page whose strings are translated into thirty languages, some 40% longer.

So below roughly 600px of rail the row stops being one line at all. The mark, the name and the
badges keep the first; the description and the actions take a second, underneath. The split is not
arbitrary — it is the same *calm at rest, informative on demand* the reveal already encodes, drawn
in space rather than in opacity. The top line is the row; the bottom line is what the row says when
you are standing on it.

Two consequences are worth stating, because they are the opposite of what "the mobile layout"
usually means. The description gets the whole width, so it stops being truncated — at 390px it has
189px, which is more than a badged row gets in the *full-width desktop* layout, where it sits on its
152px floor. And the print, no longer sharing a line with it, gets its **full** size back, which is
also the size it is drawn at: the chart is at its most legible exactly where the window is smallest.
The control bar needs no rule of its own — it is a handful of short controls whose number depends on
what the page can currently do, so it simply wraps.

"Never yields" was still an arithmetic claim, though, and it ran out one screen size below where it
was drawn. Line two is the description beside a 108px reservation for the actions, so a 249px rail
leaves the description 104px and `Speaks 33 languages` wants 121 — the twins were being ellipsised at
320px, in English, in the face the page was designed in. So the twins' disambiguator is now the one
line on the rail that **wraps** rather than ellipsising. That is a change of shape, not of margin: a
nowrap line's safety is a claim about one string in one face that every locale re-litigates, and a
line that wraps has no such claim to make. It costs nothing where the text already fits, which is
nearly everywhere; where it does not, the twin's row takes a second line of 12px type.

The ordinary taglines keep their ellipsis, and below about 360px they use it. That is the yield order
working rather than a hole in it: a tagline is one voice's description, where a disambiguator is two
rows' only difference, and wrapping all twenty-two of them would make every row taller at rest to
save a word the reader is not looking at.

The cost is height. A row grows by about half, and at rest most rows carry an empty second line. That
is the right way round: this page is a list you scroll, so vertical is the axis it can afford to
spend, and the alternative is a rail whose rows cannot be told apart.

Two things do not move, at any width. Every print is one width across the whole rail — a per-row
negotiation would let a badged row draw a shorter trace than its neighbour, and a trace's length is
its clip's length, so that is not a smaller chart but a chart that lies about half its rows. And the
shared reference line still sits at one height in every row, because that is the premise everything
else here rests on.

### Nothing outside the rail may export a width

The narrow layout above is about what the page *looks like* when the column is small. There is a
second, quieter question underneath it: how small is the column allowed to get, and who decides?

The answer should be "the window", and for the rail itself it is — `container-type: inline-size`
gives the list inline-size containment, so twenty-two rows of nowrap names and descriptions
contribute *nothing* to how wide this pane says it wants to be. Everything else here — the heading
row, the control bar, the tail — sits in ordinary flow, and there a single `white-space: nowrap`
string is a hard floor under the pane's minimum width. The shell then hands that floor to the whole
document: the settings content column is a flex item with `width: 504px`, so its automatic minimum
size is `min(504px, its contents' minimum)`, and a pane that insists on 500px makes a 736px window
scroll sideways.

That is not hypothetical. The keyboard hint was one nowrap line, and it cost 27px of horizontal
scroll on a Linux CI runner while measuring 0px on the machine it was designed on — same build, same
browser, different system font. A layout calibrated to one machine's glyph widths is a layout that
fails on someone else's, and the thirty translations still to land are a much bigger perturbation
than a font swap.

So the rule is structural rather than arithmetic: **outside the rail, text wraps.** `overflow-wrap:
anywhere` is the load-bearing half of it — it is the one wrapping mode that lowers an element's
*minimum* width to a single character, so no word, in any locale, in any face, can set this pane's
width. Nothing about the resting page changed: a wrapping row of controls breaks between whole
controls long before it breaks inside one. The one thing in here that genuinely cannot wrap is the
filter's `<select>`, whose minimum is its longest option — a bounded floor, measured rather than
assumed, and well under the column a 320px phone gives.

Inside the rail the same mistake is available and *quieter*, which is why it survived longer. The
rail's containment means a row that outgrows its line can never scroll the document; it simply paints
outside the card. The `Use` button was doing exactly that — 20px past the card's right edge, on the
current voice's row, at every window between about 665 and 730px in a 40%-longer locale — while the
page's scroll width read a contented zero. The cause was the same `min-width: auto` in a different
costume: a flex item's automatic minimum is its own content, so `flex: 0 0 96px` means *at least* 96px
and a nowrap badge means at least its own string. With the badges and the actions allowed to yield —
in that order, because a clipped `In use` is a decoration losing its tail and a clipped `Use` is the
page's one commit control — the row's minimum stops being text-derived at all: 594px of constants,
against the 608px at which it takes a second line. There is no width the one-line layout is used at
that it cannot draw, whatever the strings are.

### Listening is the primary interaction, and the keyboard is the primary instrument

`Space` plays the row you are on. `↑↓` walk. `⇧Space` plays *the other* of the last two voices you
heard, without moving focus or scroll. `Enter` commits. That is the whole model, and it makes the
central act — hear this, hear that, hear this again — a two-finger operation.

**Opening the tab gives the rail the keyboard**, landing on your current voice's row — which is what
makes "hear a voice: one action" true rather than decorative. This is less obvious than it sounds and
it was wrong for a while: an inactive settings panel is `display: none`, so the rail *cannot* hold
focus before its tab is on screen, and a tab switcher that toggles classes hands focus nowhere. The
rail meanwhile drew everything that *looks* like focus — a roving `aria-activedescendant`, a
`.focused` row, `tabIndex = 0` — while DOM focus sat on the sidebar button that opened it. `Space`
went to the button. The fix is a `TabController.onShown` hook, the mirror of the `onHidden` the
player already needed; the rail banks the claim and honours it on the next paint, because the catalog
is network-bound and the tab is activated long before there is a rail to focus.

Taking focus is deliberately **not** playing: the arming rule still holds, so arriving on the tab
never makes a sound, and the first `↓` is silent until you have played something yourself.

Mouse users get the same thing: the entire row is the play target, and the compare control in the bar
fills in visibly as they walk, which is how they discover it exists. The hovered or focused row shows
a small `▶` in its left gutter to say the row *is* the button — a pseudo-element in padding the row
already has, not twenty-two nested buttons, which would both shout at rest and put a control inside
every `role="option"`.

**Arrow keys do not play until you have explicitly played something.** This one rule buys three
things at once: a screen-reader user is never ambushed by audio, the browser's autoplay policy is
satisfied by a real gesture before anything chains, and nobody ever gets noise from merely opening
the page. There is a visible toggle for people who want it off permanently — a chip that reads
`○ Play as you move` when off and `● Play as you move` when on, because the shape has to carry the
state as well as the colour does. (It used to be struck through when off, which conventionally means
deleted or unavailable; the control is neither.)

The moment arrows *become* live is a change to what the keyboard does, and the page says so once —
appended to the first `Playing <voice>`, so it arrives on one line rather than as a second
interruption landing over the sample it is describing.

### Comparison has no mode

There is no "compare view" to enter and leave. The page silently tracks the last two distinct voices
you auditioned, seeded with your current one — so your very first `↓` then `⇧Space` is
incumbent-versus-challenger, which is the actual decision, with no setup at all.

Clips restart rather than resuming mid-phrase. ABX tools carry the playhead across the switch, which
is right for 30-second excerpts and wrong for 1.5-second ones where the same offset lands on a
different word. The opening is where a voice's character is clearest anyway.

### Say the same thing twice, but never in the same channel twice

Three of the page's facts are drawn rather than written, and drawing is the one channel a screen
reader cannot read. So each has exactly one spoken counterpart, and only one:

- **Which voice you have chosen.** The listbox's `aria-selected` marks the voice **in use** — the one
  thing `Use` writes. It used to track the arrow cursor, so the page announced "Onyx, selected"
  because Onyx happens to be the deepest voice and you had chosen nothing; the real commitment was
  reported by a second, quieter attribute. Walking a list is not choosing from it, and
  "selection follows focus" is for listboxes where moving the cursor *is* choosing. The cursor is
  carried by `aria-activedescendant` alone, which is what it is for.
- **What you have already heard.** Ink density is the visual expression, and the row's accessible
  name says `Heard`. Only the positive state — twenty-two rows announcing their default state is
  noise, and the counter in the bar already says how far along you are.
- **What HD costs.** The `HD` chip is the visual mark; the row's `aria-describedby` points at one
  hidden sentence for the whole rail. A *description*, not part of the name: spoken after the voice,
  after a pause, and skippable. Folding it into the name would make ten rows announce a sentence
  about billing before they announce which voice they are, which is the tier shelves' mistake in a
  new costume.

The rule underneath: if you can see it, you must be able to hear it — and exactly once.

### The page develops as you listen

Prints start faint and ink in once heard. A first-time visitor correctly sees a page of things they
do not know yet; the rail literally fills in as they work down it. There is no threshold and no mass
transition — it is the same variable, moving.

The counter (`9 of 22 heard`), the `Not yet heard` filter and `Play new (13)` are the half of this
that makes a hundred voices tractable. If only one part of the heard-state idea ever ships, it should
be those, not the ink.

### Per-host, without pretending the hosts are alike

![The rail on Claude, with menu seats](images/voices-audition-room/03-rail-claude.png)

Claude has a four-seat in-chat menu, so its rows carry a pin control and the page ends with a plain
summary of what is currently seated. Pi has no menu, so none of that renders — not greyed out, not
explained away. Absent. A host declares whether it has a menu; the page follows.

---

## 6. What we deliberately did not build

The reasoning matters more than the list, because these are the ideas that will be re-proposed.

**Typing your own sentence and hearing every voice say it.** This was approved and then cut on
evidence. The case for it was that fixed clips cannot support a fair comparison — but measurement
showed all twelve Everyday clips pause at the same point in their span (0.35–0.42), while the HD
clips scatter or have no pause at all. Twelve out of twelve inside a band that narrow does not happen
with twelve independently written scripts: **they already read the same line**, so the free
comparison is already fair where the choice is actually made. On top of that, the pricing helper
rounds to zero credits for short text, so we could not have shown an honest price for exactly the
kind of short phrase people would type. Cutting it left the page with no cost model at all.

*What would bring it back:* the HD clips being re-rendered on the shared line (an ask already filed),
or a flat-rate, server-cached preview endpoint. The seam was left in place.

**Per-voice colour.** See §4. The ramp is a scale, not 22 identities.

**Tier shelves.** Price is the vendor's axis.

**A tournament or funnel.** Multi-step flows that ask the user to shortlist, then compare, then
commit look tidy in a diagram and feel like work. `⇧Space` delivers the same outcome with no stages.

**Auto-advance as the opening gesture.** `Play all` exists, but it is not what the page offers first.
The invitation is "hear one voice", not "commit to a minute of audio". This one needed re-deciding
after the fact: `Play all` was drawn as a pill — outlined, white-filled, rounded — which made it the
only button-shaped thing on the page and therefore its apparent call to action, so the page's loudest
affordance contradicted its own stated intent. It is now set like the controls it sits among: plain
text, the bar's quiet ink, a `▶` in front of it. Still first in the bar, because it and its `6 of 22`
readout are one sentence — but no longer louder than the rail.

**A "New" badge on recently added voices.** The catalog carries no date. It would be a claim the data
cannot support.

---

## 7. How to tell whether a change is good

Concrete tests, in rough order of how often they catch things:

- **Does it add a mark that isn't measured?** If a new visual element could be drawn identically for
  a voice that sounds completely different, it does not belong.
- **Does it make the resting page louder?** Detail belongs on the focused row. The exception is
  anything a user needs in order to tell two rows apart.
- **Does it cost a credit?** If yes, you have changed the page's posture and you now owe the user an
  honest, explainable cost model. Be sure it is worth it.
- **Does it re-draw existing voices when the catalog grows?** Scales must be keyed to fixed
  constants. If adding a 23rd voice reflows the other 22, it is wrong.
- **Can a keyboard-only user do it? Can a screen-reader user do it without being ambushed by audio?**
- **Does it add a second way to say something the page already says?** Two ARIA attributes for one
  fact is how the page ended up announcing the wrong row as "selected". Pick the channel the platform
  owns and use only that one.
- **Is it drawn but not spoken?** Ink, hue, position and badges are all invisible to a screen reader.
  Anything the reader needs in order to choose needs a spoken counterpart — in the name if it
  identifies the row, in a description if it is a consequence of picking it.
- **Does it survive a 40%-longer translation, and read correctly at a count of 1?** If it is outside
  the rail, can its longest string *break*? A new `white-space: nowrap` there is a floor under the
  whole page's width, not a local decision — see §5.
- **Does it still work at ~690px — and at ~334px?** There is no wide window to design against, and
  since #584 there is no narrow floor either: the same pane is drawn at a third of its ceiling. If a
  new element only fits on one line, say which of the two lines it belongs to.
- **Is colour carrying meaning on its own?** It must always be the third encoding of something, never
  the first.

And the blunt one: **does it get the user to sound faster, or does it get between them and the
sound?** That is the whole page.

---

## 8. Known soft spots

Honest list, for whoever picks this up.

- **The row is wide and the middle is quiet.** At rest, the space between a voice's name and the
  right edge is empty. It is deliberate (detail on focus only) and it is the thing most likely to
  read as institutional rather than calm. If you want one thing to improve, this is it.
- **The original implementation was verified through DOM/ARIA tests.** The gap is narrower than it was — selection
  now marks the voice in use rather than the arrow cursor, heard state is in the accessible name, HD's
  cost is an ARIA description, and the moment the arrows become audible is announced — but every one
  of those was reasoned from the APG and verified with `getAttribute`, not with a reader. What a
  headless probe cannot tell you is how much of it is *too much*: whether "Marin — Heard — In use,
  selected" is informative or a mouthful, whether the HD description lands as a footnote or as an
  interruption, and whether the arming confirmation is heard at all over the sample it rides on. A
  live reader evaluation was not performed for that implementation. This is a historical evidence
  limit; attended screen-reader checks are not merge or release prerequisites under the founder’s
  [2026-09-05 decision](../AGENTS.md#autonomous-engineering-mandate).
- **Arriving now travels a little, where it used to travel not at all.** Taking DOM focus uses
  `preventScroll` on the listbox — otherwise the browser scrolls to the *top* of a 22-row element,
  which is both a jump and the wrong place — plus the row's own `nearest` scroll. `nearest` moves
  nothing when the row is already visible, and the minimum when it is not. But "the minimum" for a
  current voice at row 19 of 22 still takes the heading and the host switcher off-screen, which is
  precisely what arriving used to avoid by leaving focus unvisited. That trade is deliberate — a
  focus ring below the fold is worse than a scrolled page — but it is a trade, and the honest fix
  further out is a shorter route to your own voice rather than a longer scroll to it.
- **Sticky autoplay activation is designed around, not verified.** The automated harness disables
  autoplay policy outright, so a green test there proves nothing. It needs a real browser check.
- **Two server-side asks are outstanding**, both with measurements attached: the ten HD clips should
  be re-rendered on the line the Everyday clips already share, and one voice (Sage) ships about 7 dB
  quieter than the pack, which makes it lose comparisons for reasons that have nothing to do with how
  it sounds.
- **Tier is still binary.** HD and Everyday are a pricing artefact. If the catalog ever gets a third
  tier, the filter absorbs it, but the copy will need rethinking.
